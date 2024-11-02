import { and, eq } from "drizzle-orm";

import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { posts } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

const ParamsSchema = z.object({
    postId: z.coerce.number(),
});

export async function GET(
    request: Request,
    { params }: { params: Record<string, string> }
): Promise<NextResponse<ApiResponse>> {
    try {
        // Validate params
        const result = ParamsSchema.safeParse({ postId: params.postId });

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid parameters",
                    details: result.error.issues,
                },
                { status: 400 }
            );
        }

        const { postId } = result.data;

        const post = await dbClient
            .select()
            .from(posts)
            .where(eq(posts.id, postId));

        if (!post || post.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Post not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                message: "Hello world!",
                postId,
                post: post[0],
            },
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to get data",
            },
            { status: 500 }
        );
    }
}

export const DELETE = withAuth(async (req, auth) => {
    if (!auth || !auth.user.id) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }

    try {
        // Extract postId from URL
        const url = new URL(req.url);
        const pathParts = url.pathname.split("/");
        const postIdFromPath = pathParts[pathParts.length - 1];

        // Validate params
        const result = ParamsSchema.safeParse({ postId: postIdFromPath });

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid parameters",
                    details: result.error.issues,
                },
                { status: 400 }
            );
        }

        const { postId } = result.data;

        // Check if post exists and belongs to user
        const post = await dbClient
            .select()
            .from(posts)
            .where(and(eq(posts.id, postId), eq(posts.userId, auth.user.id)));

        if (!post || post.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Post not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                message: "Protected action completed",
                userId: auth.user.id,
                postId,
            },
        });
    } catch (error) {
        console.error("Error in DELETE:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process request",
            },
            { status: 500 }
        );
    }
});
