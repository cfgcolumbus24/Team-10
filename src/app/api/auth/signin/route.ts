import * as argon2 from "argon2";

import { ApiResponse, statusMessageFromZodError } from "@/app/api/common";
import { ZodError, z } from "zod";
import { sessions, users } from "@/db/schema";

import { NextResponse } from "next/server";
import csprng from "csprng";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";

// Define the expected request body structure
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

/**
 * POST handler for user login
 * Validates credentials, creates a session, and sets a cookie
 */
export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse>> {
    try {
        // Parse and validate request body
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        // Generate a secure random token for the session
        const token = csprng(256, 16);

        // Look up user by email
        const query = await dbClient
            .select({
                userId: users.id,
                passwordHash: users.passwordHash,
                onboarded: users.onboarded,
            })
            .from(users)
            .where(eq(users.email, email));

        // Handle user not found
        if (query.length < 1) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid credentials",
                },
                {
                    status: 400,
                }
            );
        }

        const { userId, passwordHash, onboarded } = query[0];

        // Verify password
        if (!(await argon2.verify(passwordHash, password))) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid credentials",
                },
                {
                    status: 400,
                }
            );
        }

        // Create new session
        await dbClient.insert(sessions).values({
            token,
            userId,
        });

        // Create response with cookie
        const response = NextResponse.json(
            {
                success: true,
                data: {
                    userId,
                    token,
                    onboarded,
                },
            },
            {
                status: 200,
            }
        );

        // Set session cookie
        response.cookies.set("token", token, {
            secure: true,
            sameSite: "lax",
            httpOnly: false,
        });

        return response;
    } catch (e) {
        console.error(e);

        // Handle validation errors
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

        // Handle all other errors
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
}
