import { ApiResponse, statusMessageFromZodError } from "@/app/api/common";
import { ZodError, z } from "zod";

import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";
import { sessions } from "@/db/schema";
import { withAuth } from "@/lib/auth";

/**
 * POST handler for user logout
 * Invalidates the current session and clears the session cookie
 */
export const POST = withAuth(async (req, auth) => {
    try {
        // Get auth context from your auth middleware
        if (!auth.session.token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No active session",
                },
                {
                    status: 400,
                }
            );
        }

        // Invalidate the session in the database
        await dbClient
            .update(sessions)
            .set({ invalidated: true })
            .where(eq(sessions.token, auth.session.token));

        // Create response and clear the cookie
        const response = NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            }
        );

        // Clear the session cookie
        response.cookies.set("token", "", {
            secure: true,
            sameSite: "lax",
            httpOnly: false,
            maxAge: 0, // This makes the cookie expire immediately
        });

        return response;
    } catch (e) {
        console.error(e);

        if (e instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: statusMessageFromZodError(e),
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "An unexpected error occurred",
            },
            {
                status: 500,
            }
        );
    }
});
