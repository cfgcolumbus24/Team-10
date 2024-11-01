import { NextResponse } from "next/server";

type PingResponse = {
    status: "ok";
    timestamp: string;
};

type ErrorResponse = {
    error: string;
};

export async function GET(): Promise<
    NextResponse<PingResponse | ErrorResponse>
> {
    try {
        const response: PingResponse = {
            status: "ok",
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const errorResponse: ErrorResponse = {
            error: "Internal Server Error",
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
