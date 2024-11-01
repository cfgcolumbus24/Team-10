import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, auth) => {
    return NextResponse.json({
        success: true,
        data: {
            userId: auth.user.id,
            email: auth.user.email,
        },
    });
});

export const POST = withAuth(async (req, auth) => {
    const body = await req.json();

    return NextResponse.json({
        success: true,
        data: {
            message: "Protected action completed",
            userId: auth.user.id,
        },
    });
});
