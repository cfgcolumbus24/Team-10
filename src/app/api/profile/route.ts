import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/app/api/common";
import { withAuth } from "@/lib/auth";

// Simple GET endpoint
export async function GET(
    request: NextRequest
): Promise<NextResponse<ApiResponse>> {
    try {
        // Mock data
        const data = { message: "Hello" };
        // Auth fetch

        return NextResponse.json({
            success: true,
            data: data,
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

export const PUT = withAuth(async (req, auth) => {
    // Mock data
    const data = { message: "Hello" };
    // Auth fetch

    return NextResponse.json({
        success: true,
        data: data,
    });
});
