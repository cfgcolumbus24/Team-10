import { NextRequest, NextResponse } from "next/server";
import { and, eq, inArray, isNull, not, sql } from "drizzle-orm";
import { follows, sessions, users } from "@/db/schema";

import { AuthContext } from "@/lib/auth";
import { dbClient } from "@/db/client";

// Helper function to extract auth context safely
async function getAuthContext(req: NextRequest): Promise<AuthContext | null> {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const session = await dbClient
            .select()
            .from(sessions)
            .where(eq(sessions.token, token))
            .execute();

        if (session.length < 1 || session[0].invalidated) return null;

        const { userId, createdAt, expiresAt } = session[0];

        const user = await dbClient
            .select({
                id: users.id,
                email: users.email,
                userType: users.userType,
            })
            .from(users)
            .where(eq(users.id, userId));

        if (user.length < 1) return null;

        return {
            session: {
                token,
                createdAt,
                expiresAt,
            },
            user: user[0],
        };
    } catch (error) {
        console.error("Auth extraction error:", error);
        return null;
    }
}

async function getRandomUsers(dbClient: any, auth: AuthContext | null) {
    if (auth?.user?.id) {
        // Get IDs of users that the current user is following
        const followingQuery = await dbClient
            .select({ followingId: follows.followingId })
            .from(follows)
            .where(eq(follows.followerId, auth.user.id));

        const followingIds = followingQuery.map((f: any) => f.followingId);
        const excludeIds = [...followingIds, auth.user.id];

        return await dbClient
            .select({
                id: users.id,
                name: users.name,
                bio: users.bio,
                pic: users.pic,
            })
            .from(users)
            .where(not(inArray(users.id, excludeIds)))
            .orderBy(sql`RANDOM()`)
            .limit(5);
    } else {
        return await dbClient
            .select({
                id: users.id,
                name: users.name,
                bio: users.bio,
                pic: users.pic,
            })
            .from(users)
            .orderBy(sql`RANDOM()`)
            .limit(5);
    }
}

export async function GET(req: NextRequest) {
    try {
        const auth = await getAuthContext(req);
        const responseData = await getRandomUsers(dbClient, auth);

        return NextResponse.json({
            success: true,
            data: responseData,
            isAuthenticated: !!auth,
        });
    } catch (error) {
        console.error("Error in GET:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch random users",
            },
            { status: 500 }
        );
    }
}
