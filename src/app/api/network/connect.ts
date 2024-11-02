import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { follows } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";
import { doesNotMatch } from "assert";
import { and, eq } from "../../../../node_modules/drizzle-orm/expressions";

//User To follow
const FollowSchema = z.object({
    userId: z.string().uuid(), 
});

export const POST = withAuth(
    async (request, auth): Promise<NextResponse<ApiResponse>> => {
        try {
            if (!auth || !auth.user.id) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized",
                    },
                    { status: 401 }
                );
            }

            const body = await request.json();
            const result = FollowSchema.safeParse(body);
            
            //User doesn't exist
            if (!result.success) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid data",
                    },
                    { status: 400 }
                );
            }

            const validatedData = result.data;

            // Check if the follow relationship already exists
            const existingFollow = await dbClient
                .select()
                .from(follows)
                .where(and(eq(auth.user.id, follows.followerID), eq(follows.followingID, validatedData.userID)))
                .execute();

            if (existingFollow.length > 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Already following this user",
                    },
                    { status: 409 }
                );
            }

            // Insert the new follow relationship
            await dbClient.insert(follows).values({
                followerId: auth.user.id,
                followingId: validatedData.userId,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: "Followed the user",
                },
                { status: 201 }
            );
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to process request",
                },
                { status: 500 }
            );
        }
    }
);
