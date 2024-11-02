import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { media, posts, users } from "@/db/schema";

import { dbClient } from "@/db/client";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

// Define the schema for filtering posts by type
const FeedTypeQuery = z.object({
    typeOnlyFeed: z
        .enum(["opportunity", "post", "event", "admin"])
        .optional()
        .nullable(),
});

export async function GET(request: NextRequest) {
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

        const validPostTypes = [
            "opportunity",
            "post",
            "event",
            "admin",
        ] as const;
        type PostType = (typeof validPostTypes)[number];

        const postsQuery = dbClient
            .select({
                id: posts.id,
                resourceUrl: media.resourceUrl,
                type: posts.type,
                userId: posts.userId,
                userName: users.name,
                body: posts.body,
                timestamp: posts.timestamp,
            })
            .from(posts)
            .leftJoin(users, eq(posts.userId, users.id))
            .leftJoin(media, eq(posts.image, media.id))
            .where(
                typeOnlyFeed && validatedQuery.data.typeOnlyFeed
                    ? eq(
                          posts.type,
                          validatedQuery.data.typeOnlyFeed as PostType
                      )
                    : sql`1=1`
            )
            .orderBy(desc(posts.timestamp));

        // Execute the posts query
        const userPosts = await postsQuery.execute();

        // Combine profile and posts into the response
        const response = {
            success: true,
            data: {
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
