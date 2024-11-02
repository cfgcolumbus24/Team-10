import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import csprng from "csprng";
import { dbClient } from "@/db/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { media } from "@/db/schema";
import { s3Client } from "@/aws/s3Client";
import { withAuth } from "@/lib/auth";
import { z } from "zod";

const PostSchema = z.object({});

export const POST = withAuth(
    async (request, auth): Promise<NextResponse<ApiResponse>> => {
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

            const body = await request.json();

            const result = PostSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid data",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const validatedData = result.data;

            const objectId = csprng(256, 16);
            const command = new PutObjectCommand({
                Bucket: "alumni-network-cfg",
                Key: objectId,
            });
            const presignedUploadUrl = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });

            const [{ mediaId }] = await dbClient
                .insert(media)
                .values({
                    resourceUrl: `https://alumni-network-cfg.s3.us-east-2.amazonaws.com/${objectId}`,
                })
                .returning({ mediaId: media.id });

            return NextResponse.json(
                {
                    success: true,
                    data: {
                        mediaId,
                        uploadUrl: presignedUploadUrl,
                    },
                },
                {
                    status: 201,
                }
            );
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to process request",
                },
                {
                    status: 500,
                }
            );
        }
    }
);
