import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/app/api/common";

import { dbClient } from "@/db/client";
import { users, posts } from "@/db/schema";
import { z } from "zod";

const FeedTypeQuery = z.object ({
    typeOnlyFeed: z.enum(["opportunity", "post","event", "admin"]).optional()
})



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


import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client";
import { users, posts, media } from "@/db/schema"; // Ensure you import all necessary schemas
import { z } from "zod";

// Define the query parameters schema for validation
const FeedQuerySchema = z.object({
    postType: z.enum(["post", "opportunity", "event"]).optional(),
});

// GET /feed
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const postType = searchParams.get("postType");

        // Validate the query parameters
        const validatedQuery = FeedQuerySchema.safeParse({ postType });

        if (!validatedQuery.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid query parameters",
                },
                {
                    status: 400,
                }
            );
        }

        // Get the authenticated user's ID from the request context
        const userId = "1"; // Replace with the actual authenticated user ID

        // Build the query to get the user profile and posts
        const userProfile = await dbClient
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .execute();

        if (userProfile.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Get posts for the user, optionally filtering by post type
        const postsQuery = dbClient
            .select()
            .from(posts)
            .where(eq(posts.userId, userId))
            .orderBy(desc(posts.createdAt)); // Sort by most recent first

        // If a post type is specified, filter by it
        if (validatedQuery.data.postType) {
            postsQuery.where(eq(posts.type, validatedQuery.data.postType));
        }

        const userPosts = await postsQuery.execute();

        // Combine profile and posts into the response
        const response = {
            success: true,
            data: {
                profile: userProfile[0], // Assuming userProfile contains only one user
                posts: userPosts,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to retrieve feed",
            },
            {
                status: 500,
            }
        );
    }
}
