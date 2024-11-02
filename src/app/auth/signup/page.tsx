"use client";

import React, { useState } from "react";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Schema definitions
const emailSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const fullSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be less than 64 characters"),
});
export const metadata: Metadata = {
    title: "Sign Up :: AlumNet",
};

type SignupFormData = z.infer<typeof fullSchema>;

const SignupForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignupFormData>();

    const resetState = () => {
        setShowPassword(false);
        setError("");
        reset({ password: "" });
    };

    const onSubmit = async (data: SignupFormData) => {
        if (!showPassword) {
            setShowPassword(true);
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "An error occurred during signup");
                return;
            }

            router.push("/auth/signin");
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1CBCEE]">
            <div className="h-fit w-full max-w-md flex flex-col gap-8 items-start justify-center bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-foreground">
                    Create your account
                </h1>

                <div className="w-full flex flex-col gap-4">
                    <span className="flex flex-row gap-1 text-lg text-foreground">
                        <p>Have an account?</p>
                        <Link
                            href="/auth/signin"
                            className="text-highlight hover:underline"
                        >
                            Sign In
                        </Link>
                    </span>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full h-fit flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-foreground"
                            >
                                Email
                            </label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email format",
                                    },
                                })}
                                type="email"
                                id="email"
                                placeholder="Email"
                                className="p-2 border border-gray-300 rounded-md bg-background text-foreground focus:border-blue-500 focus:outline-none"
                                onChange={() => resetState()}
                            />
                            {errors.email && (
                                <span className="text-red-600 text-sm">
                                    {errors.email.message as string}
                                </span>
                            )}
                        </div>

                        {showPassword && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Name
                                    </label>
                                    <input
                                        {...register("name", {
                                            required: "Name is required",
                                        })}
                                        type="text"
                                        id="name"
                                        placeholder="Your name"
                                        className="p-2 border border-gray-300 rounded-md bg-background text-foreground focus:border-blue-500 focus:outline-none"
                                    />
                                    {errors.name && (
                                        <span className="text-red-600 text-sm">
                                            {errors.name.message as string}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Password
                                    </label>
                                    <input
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be at least 8 characters",
                                            },
                                            maxLength: {
                                                value: 64,
                                                message:
                                                    "Password must be less than 64 characters",
                                            },
                                        })}
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        className="p-2 border border-gray-300 rounded-md bg-background text-foreground focus:border-blue-500 focus:outline-none"
                                    />
                                    {errors.password && (
                                        <span className="text-red-600 text-sm">
                                            {errors.password.message as string}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isLoading || Object.keys(errors).length > 0
                            }
                            className="p-2.5 font-semibold bg-[#1CBCEE] text-foreground rounded-md hover:bg-[#18A4D4] transition duration-200 group"
                        >
                            <span className="flex flex-row items-center justify-between">
                                {isLoading
                                    ? "Loading..."
                                    : showPassword
                                    ? "Sign Up"
                                    : "Continue"}
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 -translate-x-1 group-hover:translate-x-0" />
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
