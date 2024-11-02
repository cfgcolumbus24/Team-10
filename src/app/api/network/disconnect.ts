import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { follows } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";
import { doesNotMatch } from "assert";

//User To Un-Follow
const FollowSchema = z.object({
    userId: z.string().uuid(), 
});

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
                .where(and(eq(auth.user.id, follows.followerID), eq(follows.followingID, validatedData.userID)))
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




