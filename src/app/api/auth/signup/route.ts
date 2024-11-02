import * as argon2 from "argon2";

import { ApiResponse, statusMessageFromZodError } from "@/app/api/common";
import { ZodError, z } from "zod";

import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

// Registration request validation schema
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(RegExp("^.{8,64}$")), // 8-64 characters
    name: z.string(),
});

/**
 * POST handler for user registration
 * Validates input, checks for existing email, and creates new user
 */
export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse>> {
    try {
        // Parse and validate request body
        const body = await request.json();
        const { name, email, password } = registerSchema.parse(body);

        // Hash password at start to prevent timing attacks
        const passwordHash = await argon2.hash(password);

        // Check if email already exists
        const emailInstances = await dbClient
            .select({ email: users.email })
            .from(users)
            .where(eq(users.email, email))
            .execute();

        if (emailInstances.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email already registered",
                },
                {
                    status: 400,
                }
            );
        }

        // Create new user
        const [newUser] = await dbClient
            .insert(users)
            .values({
                name,
                email,
                passwordHash,
            })
            .returning({ id: users.id, email: users.email });

        return NextResponse.json(
            {
                success: true,
                data: {
                    userId: newUser.id,
                },
            },
            {
                status: 201,
            }
        );
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
}
