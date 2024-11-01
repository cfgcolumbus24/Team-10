import { ApiResponse } from "@/app/api/common";
import { NextResponse } from "next/server";
import { useRouter } from "next/router";

export async function DELETE(): Promise<NextResponse<ApiResponse>> {
    try {
        const router = useRouter();

        const data = { message: "Hello world!", postId: router.query.postId };

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to get data",
            },
            {
                status: 500,
            }
        );
    }
}
