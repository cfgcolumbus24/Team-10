import { media, posts, users } from "@/db/schema";

import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { eq, and, notEq } from "drizzle-orm/sql/index";
import { z } from "zod";

const ParamsSchema = z.object({
    profileId: z.coerce.number(),
});

export async function GET(
    request: Request,
    { params }: { params: Record<string, string> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const paramValues = await params;
        const result = ParamsSchema.safeParse({
            profileId: paramValues.profileId,
        });

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

        const { profileId } = result.data;

        const [profile] = await dbClient
            .select({
                id: users.id,
                name: users.name,
                bio: users.bio,
                contact: users.contact,
                pic: users.pic,
            })
            .from(users)
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

        const userPosts = await dbClient.execute(
            `SELECT * FROM posts WHERE "userId" = $1 AND type != 'post'`,
            [profileId]
        );
        const galleryPosts = await dbClient.execute(
            `SELECT * FROM posts WHERE "userId" = $1 AND type = 'post'`,
            [profileId]
        );

        /*
        const userPosts = await dbClient
            .select()
            .from(posts)
            .where(eq(posts.userId, profile.id))
            .where(notEq(posts.type, "post")); //change made to just show other posts
            

        const galleryPosts = await dbClient
            .select()
            .from(posts)
            .where(eq(posts.userId, profile.id))
            .where(eq(posts.type, "post"))
            .execute();
            */
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
                galleryPosts,
                userPosts,
                userMedia,
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
