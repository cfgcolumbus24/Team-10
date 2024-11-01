import type { ZodError } from "zod";

export type ApiResponse = {
    success: boolean;
    data?: any;
    error?: string;
};

export function statusMessageFromZodError(e: ZodError): string {
    const errorMessages = e.issues.map((issue) => {
        const { path, message } = issue;
        return `${path.join(".")}: ${message}`;
    });

    const statusMessage = errorMessages.join(", ");

    return statusMessage;
}
