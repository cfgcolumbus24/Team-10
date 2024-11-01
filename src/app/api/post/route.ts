import * as schema from "@/db/schema";

import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { z } from "zod";

const PostSchema = z.object({
    image: z.string(),
    body: z.string(),
    type: z.enum(["post", "opportunity", "event"]),
});

export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse>> {
    try {
        const body = await request.json();

        const result = PostSchema.safeParse(body);
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
