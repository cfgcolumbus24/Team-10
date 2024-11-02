import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/client";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { z } from "zod";

const ParamsSchema = z.object({
    profileId: z.coerce.number(),
});

export async function GET(
    request: Request,
    { params }: { params: Record<string, string> }
): Promise<NextResponse<ApiResponse>> {
    try {
        // Validate params
        const result = ParamsSchema.safeParse({ profileId: params.profileId });

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

        return NextResponse.json({
            success: true,
            data: {
                message: "Hello world!",
                profile,
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
