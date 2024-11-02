import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (rq, auth) => {
    return NextResponse.json({
        success: true,
        data: {
            auth,
        },
    });
});
