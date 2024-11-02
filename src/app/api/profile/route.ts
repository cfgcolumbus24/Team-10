import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client"; // Import your database client
import { users, posts, media } from "@/db/schema"; // Import your schemas
import { z } from "zod";
import { eq } from "../../../../node_modules/drizzle-orm/index";

// Define Zod schema for validation
const UserProfileSchema= z.object({
    name: z.string(),
    bio: z.string().optional(),
    image: z.string().url().notNull().optional(),
    contact: z.string().nullable().optional(),
    posts: z.array(z.object({
        id: z.number(),
        body: z.string(),
        type: z.enum(["post", "opportunity", "event"]),
        // Add other relevant fields from your posts schema as needed
    })),
    gallery: z.array(z.object({
        id: z.number(),
        resourceUrl: z.string().url(),
        // Add other relevant fields from your media schema as needed
    })),
});

// GET /profile
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        // Replace with the user ID from the authenticated session or query parameters
        const userId = request.nextUrl.searchParams.get("userId") || "1"; // Assuming "1" is the default for testing

        // Fetch user profile data from the database
        const user = await dbClient
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .execute();

        if (user.length === 0) {
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

        const userProfile = user[0];

        // Fetch posts and media (gallery) for the user
        const userPosts = await dbClient
            .select()
            .from(posts)
            .where(eq(posts.userId, userId))
            .execute();

        const userGallery = await dbClient
            .select()
            .from(media)
            .where(eq(media.id, userProfile.image)) // Adjust this based on how your images are related
            .execute();

        // Construct the response data
        const responseData = {
            name: userProfile.name,
            bio: userProfile.bio,
            image: userProfile.image ? userProfile.image : null,
            contact: userProfile.contact,
            posts: userPosts.map(post => ({
                id: post.id,
                body: post.body,
                type: post.type,
                // Add other fields from the post as needed
            })),
            gallery: userGallery.map(mediaItem => ({
                id: mediaItem.id,
                resourceUrl: mediaItem.resourceUrl,
                // Add other fields from the media as needed
            })),
        };

        // Validate the response structure
        const validationResult = UserProfileSchema.safeParse(responseData);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Response data structure is invalid",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to get profile data",
            },
            {
                status: 500,
            }
        );
    }
}



// Optional: GET /profile/{userid} if you want to fetch a specific user's profile
// export async function GET_USER_PROFILE(request: NextRequest, { params }: { params: { userid: string } }): Promise<NextResponse<ApiResponse>> {
    // You can implement a similar logic as above using params.userid
//}
