import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client";
import { users, posts } from "@/db/schema";
import { z } from "zod";
// import { desc, eq } from "drizzle-orm/sql/index";

var data = {
    "success": true,
    "data": {
        "posts": [
            {
                "id": 6,
                "userId": 1,
                "body": "Organizing a tech meetup next week. All alumni welcome!",
                "image": 4,
                "type": "event",
                "timestamp": "2024-02-06T10:00:00.000Z"
            },
            {
                "id": 5,
                "userId": 2,
                "body": "Just completed my MBA! Grateful for all the support from our alumni network.",
                "image": null,
                "type": "post",
                "timestamp": "2024-02-05T13:20:00.000Z"
            },
            {
                "id": 4,
                "userId": 3,
                "body": "Important: New features added to the alumni portal. Check them out!",
                "image": null,
                "type": "admin",
                "timestamp": "2024-02-04T16:45:00.000Z"
            },
            {
                "id": 3,
                "userId": 3,
                "body": "Save the date: Annual Alumni Reunion - June 15th, 2024",
                "image": 6,
                "type": "event",
                "timestamp": "2024-02-03T11:00:00.000Z"
            },
            {
                "id": 2,
                "userId": 2,
                "body": "Our company is hiring software engineers! Great opportunity for recent grads. DM me for details.",
                "image": 5,
                "type": "opportunity",
                "timestamp": "2024-02-02T09:15:00.000Z"
            },
            {
                "id": 1,
                "userId": 1,
                "body": "Excited to share that I'll be speaking at next month's tech conference! Let me know if any fellow alumni are attending.",
                "image": null,
                "type": "post",
                "timestamp": "2024-02-01T14:30:00.000Z"
            }
        ]
    }
};

// Define the schema for filtering posts by type
const FeedTypeQuery = z.object({
    typeOnlyFeed: z.enum(["opportunity", "post", "event", "admin"]).optional(),
});

// export async function GET(request: NextRequest) {
//     return NextResponse.json(data);
//   }


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