import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/app/api/common";
import { z } from "zod";

// Define Zod schema for validation
const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});

// Simple GET endpoint
export async function GET(
    request: NextRequest
): Promise<NextResponse<ApiResponse>> {
    try {
        // Mock data
        const data = { message: "Hello" };
        // Auth fetch

        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to get data",
            },
            {
                status: 500,
            }
        );
    }
}

// POST endpoint with Zod validation
export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse>> {
    try {
        // Get the request body
        const body = await request.json();

        // Validate with Zod
        const result = UserSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid data",
                },
                {
                    status: 400,
                }
            );
        }

        const validatedData = result.data;

        return NextResponse.json(
            {
                success: true,
                data: validatedData,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process request",
            },
            {
                status: 500,
            }
        );
    }
}
