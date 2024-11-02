import { NextResponse } from "next/server";
import { dbClient } from "@/db/client"; // Import your database client
import { eq } from "drizzle-orm";
import { users } from "@/db/schema"; // Import your users schema
import { withAuth } from "@/lib/auth";
import { z } from "zod";

// Define Zod schema for profile update validation
const UpdateProfileSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    pic: z.coerce.number().optional(),
    contact: z.string().optional(),
});

// POST /profile
export const POST = withAuth(async (request, auth) => {
    try {
        // Get the request body
        const body = await request.json();

        // Validate the incoming data against the schema
        const result = UpdateProfileSchema.safeParse(body);

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

        // Get the authenticated user's ID from the request context
        const userId = auth.user.id; // Replace with the actual authenticated user ID

        // Prepare the updates
        const updates: any = {};
        if (validatedData.name) updates.name = validatedData.name;
        if (validatedData.bio !== undefined) {
            updates.bio = validatedData.bio; // Allow null
        }
        if (validatedData.pic) updates.pic = validatedData.pic;
        if (validatedData.contact) updates.contact = validatedData.contact;

        // Update the user profile in the database
        const updatedUser = await dbClient
            .update(users)
            .set(updates)
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                bio: users.bio,
                pic: users.pic,
                contact: users.contact,
            }) // Return updated user data
            .execute();

        // Check if user was found and updated
        if (updatedUser.length < 1) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Return the updated user data
        return NextResponse.json({
            success: true,
            data: updatedUser[0],
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update profile",
            },
            {
                status: 500,
            }
        );
    }
});
