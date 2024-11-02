import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { media, posts, users } from "@/db/schema"; // Import your schemas

import { ApiResponse } from "@/app/api/common";
import { dbClient } from "@/db/client"; // Import your database client
import { ne } from "drizzle-orm";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

const ParamsSchema = z.object({
    profileId: z.coerce.number(),
});

export const GET = withAuth(async (req, auth) => {
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

        const profileId = auth.user.id;

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
