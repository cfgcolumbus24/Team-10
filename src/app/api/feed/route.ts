import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client";
import { users, posts } from "@/db/schema";
import { z } from "zod";
import { desc, eq } from "drizzle-orm/sql/index";

// Define the schema for filtering posts by type
const FeedTypeQuery = z.object({
    typeOnlyFeed: z.enum(["opportunity", "post", "event", "admin"]).optional(),
});

export async function GET(
    request: NextRequest
): Promise<NextResponse<ApiResponse>> {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const typeOnlyFeed = searchParams.get("typeOnlyFeed");

        // Validate parameters
        const validatedQuery = FeedTypeQuery.safeParse({ typeOnlyFeed });

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

        // Build the query to get the user profile
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

        // Build the query to get posts for the user
        const postsQuery = dbClient
            .select()
            .from(posts)
            .where(eq(posts.userId, userId))
            .orderBy(desc(posts.timestamp)); // Sort by most recent first

        // If a post type is specified, filter by it
        if (validatedQuery.data.typeOnlyFeed) {
            postsQuery.where(eq(posts.type, validatedQuery.data.typeOnlyFeed));
        }

        // Execute the posts query
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
