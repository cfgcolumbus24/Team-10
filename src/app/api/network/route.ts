import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { follows } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";
import { doesNotMatch } from "assert";

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
                .where((q) =>
                    q.andWhere("followerId", "=", auth.user.id)
                     .andWhere("followingId", "=", validatedData.userId)
                )
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

export const disconnect = withAuth(
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

            // Delete the follow relationship if it exists
            const deleted = await dbClient
                .delete()
                .from(follows)
                .where((q) =>
                    q.andWhere("followerId", "=", auth.user.id)
                     .andWhere("followingId", "=", validatedData.userId)
                )
                .execute();

            if (deleted.rows === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "No follow relationship found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: "Unfollowed the user",
                },
                { status: 200 }
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




