import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { media, posts, users } from "@/db/schema";
import { withAuth, withOptionalAuth } from "@/lib/auth";

import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client";
import { ne } from "drizzle-orm";
import { z } from "zod";

const ParamsSchema = z.object({
    profileId: z.coerce.number(),
});

// Add this helper function to parse URL parameters
function extractProfileId(url: string): number | null {
    const match = url.match(/\/api\/profile\/(\d+)/);
    return match ? parseInt(match[1]) : null;
}

export const GET = withOptionalAuth(async (req: NextRequest, auth) => {
    try {
        // Extract profileId from URL path instead of search params
        const profileId = extractProfileId(req.nextUrl.pathname);

        if (!profileId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid profile ID",
                },
                { status: 400 }
            );
        }

        const [profile] = await dbClient
            .select({
                id: users.id,
                name: users.name,
                bio: users.bio,
                contact: users.contact,
                pic: users.pic,
                picUrl: media.resourceUrl,
            })
            .from(users)
            .leftJoin(media, eq(media.id, users.pic))
            .where(eq(users.id, profileId));

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                { status: 404 }
            );
        }

        const userPosts = await dbClient
            .select()
            .from(posts)
            .where(and(eq(posts.userId, profile.id), ne(posts.type, "post")));

        const galleryPosts = await dbClient
            .select()
            .from(posts)
            .where(and(eq(posts.userId, profile.id), eq(posts.type, "post")));

        const eventPosts = await dbClient
            .select()
            .from(posts)
            .where(and(eq(posts.userId, profile.id), eq(posts.type, "event")));

        const jobsPosts = await dbClient
            .select()
            .from(posts)
            .where(
                and(eq(posts.userId, profile.id), eq(posts.type, "opportunity"))
            );

        const userMedia = await dbClient
            .select({ url: media.resourceUrl, postId: posts.id })
            .from(posts)
            .leftJoin(media, eq(posts.image, media.id))
            .where(eq(posts.userId, profile.id));

        return NextResponse.json({
            success: true,
            data: {
                message: "Hello world!",
                profile,
                userPosts,
                galleryPosts, // Added this to match your API response type
                jobsPosts,
                eventPosts,
                userMedia,
            },
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
});
