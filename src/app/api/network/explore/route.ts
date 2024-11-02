import { and, eq, inArray, isNull, not, sql } from "drizzle-orm";
import { follows, users } from "@/db/schema";

import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { withAuth } from "@/lib/auth";

async function getRandomUsers(
    dbClient: any,
    auth: boolean,
    currentUserId?: number
) {
    if (auth && currentUserId) {
        // Get IDs of users that the current user is following
        const followingQuery = await dbClient
            .select({ followingId: follows.followingId })
            .from(follows)
            .where(eq(follows.followerId, currentUserId));

        const followingIds = followingQuery.map((f: any) => f.followingId);

        // Add current user's ID to the exclusion list
        const excludeIds = [...followingIds, currentUserId];

        // Get random users excluding the ones user is following and themselves
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
        // If user is not authenticated, just get 5 random users
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

export const GET = withAuth(async (req, auth) => {
    const responseData = await getRandomUsers(
        dbClient,
        !!auth,
        auth ? auth.user.id : undefined
    );

    return NextResponse.json({
        success: true,
        data: responseData,
    });
});
