import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { posts } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

const PostSchema = z.object({
    image: z.number().nullable(),
    body: z.string(),
    type: z.enum(["post", "opportunity", "event", "admin"]),
});

export const POST = withAuth(
    async (request, auth): Promise<NextResponse<ApiResponse>> => {
        try {
            if (!auth || !auth.user.id) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized",
                    },
                    { status: 400 }
                );
            }

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

            const [{ postId }] = await dbClient
                .insert(posts)
                .values({
                    userId: auth.user.id,
                    body: validatedData.body,
                    image: validatedData.image,
                    type: validatedData.type,
                })
                .returning({ postId: posts.id });

            return NextResponse.json(
                {
                    success: true,
                    data: { postId },
                },
                {
                    status: 201,
                }
            );
        } catch (error) {
            console.log(error);
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
);
