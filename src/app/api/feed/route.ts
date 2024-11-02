import { and, desc, eq, sql } from "drizzle-orm";
import { posts, users } from "@/db/schema";

import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

// Define the schema for filtering posts by type
const FeedTypeQuery = z.object({
    typeOnlyFeed: z.enum(["opportunity", "post", "event", "admin"]).optional(),
});

export const GET = withAuth(async (request, auth) => {
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
        const userId = auth.user.id; // Replace with the actual authenticated user ID

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

        const validPostTypes = [
            "opportunity",
            "post",
            "event",
            "admin",
        ] as const;
        type PostType = (typeof validPostTypes)[number];

        const postsQuery = dbClient
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.userId, userId),
                    typeOnlyFeed && validatedQuery.data.typeOnlyFeed
                        ? eq(
                              posts.type,
                              validatedQuery.data.typeOnlyFeed as PostType
                          )
                        : sql`1=1`
                )
            )
            .orderBy(desc(posts.timestamp));

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
});
