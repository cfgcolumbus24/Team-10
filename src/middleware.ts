// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { sessions, users } from "@/db/schema";

import csprng from "csprng";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";

// Define the auth context type
export interface AuthContext {
    session: {
        token: string;
        createdAt: Date;
        expiresAt: Date;
    };
    user: {
        id: number;
        email: string;
    };
}

// Extend the NextRequest type to include our auth context
declare module "next/server" {
    interface NextRequest {
        auth?: AuthContext;
    }
}

export async function middleware(request: NextRequest) {
    console.log("Invoked auth middleware.");

    // Clone the response to modify headers
    const response = NextResponse.next();

    // Get the session token from cookies
    const sessionCookie = request.cookies.get("token")?.value;

    if (!sessionCookie) {
        return response;
    }

    // Validate session
    const session = await dbClient
        .select()
        .from(sessions)
        .where(eq(sessions.token, sessionCookie))
        .execute();

    if (session.length < 1) {
        return response;
    }

    const { token, userId, createdAt, expiresAt, invalidated } = session[0];

    // Check session validity
    if (invalidated) {
        await dbClient
            .update(sessions)
            .set({ invalidated: true })
            .where(eq(sessions.token, token))
            .execute();
        return response;
    }

    // Get user data
    const user = await dbClient
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(eq(users.id, userId));

    if (user.length < 1) {
        return response;
    }

    const { id, email } = user[0];

    // Check session expiry
    const timestamp = new Date(Date.now());
    if (timestamp <= createdAt || timestamp >= expiresAt) {
        await dbClient
            .update(sessions)
            .set({ invalidated: true })
            .where(eq(sessions.token, token))
            .execute();
        return response;
    }

    // Refresh session if close to expiry
    if (timestamp >= new Date(expiresAt.getTime() - 2 * 24 * 60 * 60 * 1000)) {
        const newToken = csprng(256, 16);
        const revalidated = await dbClient
            .insert(sessions)
            .values({
                token: newToken,
                userId: id,
            })
            .returning({
                revalidatedToken: sessions.token,
                revalidatedCreatedAt: sessions.createdAt,
                revalidatedExpiresAt: sessions.expiresAt,
            })
            .execute();

        const { revalidatedToken, revalidatedCreatedAt, revalidatedExpiresAt } =
            revalidated[0];

        // Set auth context in request headers
        response.headers.set(
            "x-auth-data",
            JSON.stringify({
                session: {
                    token: revalidatedToken,
                    createdAt: revalidatedCreatedAt,
                    expiresAt: revalidatedExpiresAt,
                },
                user: {
                    id,
                    email,
                },
            })
        );

        // Update session cookie
        response.cookies.set("token", revalidatedToken, {
            secure: true,
            sameSite: "lax",
            httpOnly: false,
        });

        return response;
    }

    // Set auth context in request headers for current session
    response.headers.set(
        "x-auth-data",
        JSON.stringify({
            session: {
                token,
                createdAt,
                expiresAt,
            },
            user: {
                id,
                email,
            },
        })
    );

    return response;
}

// Only run middleware on api routes
export const config = {
    matcher: "/api/:path*",
};

// Helper function to get auth context in API routes
export function getAuthFromRequest(
    request: NextRequest
): AuthContext | undefined {
    const authHeader = request.headers.get("x-auth-data");
    if (!authHeader) return undefined;

    try {
        return JSON.parse(authHeader);
    } catch {
        return undefined;
    }
}
