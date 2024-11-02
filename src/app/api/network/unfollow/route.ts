import { and, eq } from "drizzle-orm";

import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { follows } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

//User To Un-Follow
const FollowSchema = z.object({
    userId: z.coerce.number(),
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
                .delete(follows)
                .where(
                    and(
                        eq(follows.followerId, auth.user.id),
                        eq(follows.followingId, validatedData.userId)
                    )
                )
                .execute();

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
