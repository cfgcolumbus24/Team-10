import { NextRequest, NextResponse } from "next/server";
import { sessions, users } from "@/db/schema";

import csprng from "csprng";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";

export interface AuthContext {
    session: {
        token: string;
        createdAt: Date;
        expiresAt: Date;
    };
    user: {
        id: number;
        email: string;
        userType: string; // Added userType to the user interface
    };
}

export interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export function withAuth(
    handler: (
        req: NextRequest,
        auth: AuthContext
    ) => Promise<NextResponse<ApiResponse>>
) {
    return async function (
        req: NextRequest
    ): Promise<NextResponse<ApiResponse>> {
        try {
            const token = req.cookies.get("token")?.value;

            if (!token) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Unauthorized",
                    },
                    { status: 401 }
                );
            }

            // Validate session
            const session = await dbClient
                .select()
                .from(sessions)
                .where(eq(sessions.token, token))
                .execute();

            if (session.length < 1) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid session",
                    },
                    { status: 401 }
                );
            }

            const { userId, createdAt, expiresAt, invalidated } = session[0];

            // Check session validity
            if (invalidated) {
                await dbClient
                    .update(sessions)
                    .set({ invalidated: true })
                    .where(eq(sessions.token, token));

                return NextResponse.json(
                    {
                        success: false,
                        error: "Session expired",
                    },
                    { status: 401 }
                );
            }

            // Get user data (now including userType)
            const user = await dbClient
                .select({
                    id: users.id,
                    email: users.email,
                    userType: users.userType, // Added userType to the selection
                })
                .from(users)
                .where(eq(users.id, userId));

            if (user.length < 1) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "User not found",
                    },
                    { status: 401 }
                );
            }

            const { id, email, userType } = user[0];

            // Check session expiry
            const timestamp = new Date(Date.now());
            if (timestamp <= createdAt || timestamp >= expiresAt) {
                await dbClient
                    .update(sessions)
                    .set({ invalidated: true })
                    .where(eq(sessions.token, token));

                return NextResponse.json(
                    {
                        success: false,
                        error: "Session expired",
                    },
                    { status: 401 }
                );
            }

            // Refresh session if close to expiry
            if (
                timestamp >=
                new Date(expiresAt.getTime() - 2 * 24 * 60 * 60 * 1000)
            ) {
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

                const {
                    revalidatedToken,
                    revalidatedCreatedAt,
                    revalidatedExpiresAt,
                } = revalidated[0];

                const response = await handler(req, {
                    session: {
                        token: revalidatedToken,
                        createdAt: revalidatedCreatedAt,
                        expiresAt: revalidatedExpiresAt,
                    },
                    user: { id, email, userType }, // Added userType to the auth context
                });

                // Set new token cookie
                response.cookies.set("token", revalidatedToken, {
                    secure: true,
                    sameSite: "lax",
                    httpOnly: false,
                });

                return response;
            }

            // Call the handler with current auth context
            return handler(req, {
                session: {
                    token,
                    createdAt,
                    expiresAt,
                },
                user: { id, email, userType }, // Added userType to the auth context
            });
        } catch (error) {
            console.error("Auth error:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Authentication failed",
                },
                { status: 500 }
            );
        }
    };
}

export function withOptionalAuth(
    handler: (
        req: NextRequest,
        auth?: AuthContext
    ) => Promise<NextResponse<ApiResponse>>
) {
    return async function (
        req: NextRequest
    ): Promise<NextResponse<ApiResponse>> {
        try {
            const token = req.cookies.get("token")?.value;

            // If no token, proceed without auth
            if (!token) {
                return handler(req);
            }

            // Validate session
            const session = await dbClient
                .select()
                .from(sessions)
                .where(eq(sessions.token, token))
                .execute();

            // If no valid session, proceed without auth
            if (session.length < 1) {
                return handler(req);
            }

            const { userId, createdAt, expiresAt, invalidated } = session[0];

            // Check session validity
            if (invalidated) {
                // Session is invalid, proceed without auth
                await dbClient
                    .update(sessions)
                    .set({ invalidated: true })
                    .where(eq(sessions.token, token));
                return handler(req);
            }

            // Get user data
            const user = await dbClient
                .select({
                    id: users.id,
                    email: users.email,
                    userType: users.userType,
                })
                .from(users)
                .where(eq(users.id, userId));

            // If no user found, proceed without auth
            if (user.length < 1) {
                return handler(req);
            }

            const { id, email, userType } = user[0];

            // Check session expiry
            const timestamp = new Date(Date.now());
            if (timestamp <= createdAt || timestamp >= expiresAt) {
                await dbClient
                    .update(sessions)
                    .set({ invalidated: true })
                    .where(eq(sessions.token, token));
                return handler(req);
            }

            // Refresh session if close to expiry
            if (
                timestamp >=
                new Date(expiresAt.getTime() - 2 * 24 * 60 * 60 * 1000)
            ) {
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

                const {
                    revalidatedToken,
                    revalidatedCreatedAt,
                    revalidatedExpiresAt,
                } = revalidated[0];

                const response = await handler(req, {
                    session: {
                        token: revalidatedToken,
                        createdAt: revalidatedCreatedAt,
                        expiresAt: revalidatedExpiresAt,
                    },
                    user: { id, email, userType },
                });

                // Set new token cookie
                response.cookies.set("token", revalidatedToken, {
                    secure: true,
                    sameSite: "lax",
                    httpOnly: false,
                });

                return response;
            }

            // Call the handler with current auth context
            return handler(req, {
                session: {
                    token,
                    createdAt,
                    expiresAt,
                },
                user: { id, email, userType },
            });
        } catch (error) {
            console.error("Auth error:", error);
            // On any error, proceed without auth instead of failing
            return handler(req);
        }
    };
}
