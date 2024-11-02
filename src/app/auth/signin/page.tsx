"use client";

import React, { useState } from "react";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema definitions
const emailSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const fullSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm();

    const onSubmit = async (data: any) => {
        if (!showPassword) {
            setShowPassword(true);
            return;
        }

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "An error occurred");
                return;
            }

            if (!result.data.onboarded) {
                window.location.href = "/auth/onboarding";
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    const resetState = () => {
        setShowPassword(false);
        setError("");
        reset({ password: "" });
    };

    return (
        <div className="h-fit w-1/2 flex flex-col gap-8 items-start justify-center ml-48 mt-40">
            <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>

            <div className="w-full flex flex-col gap-4">
                <span className="flex flex-row gap-1 text-lg text-foreground">
                    <p>Need an account?</p>
                    <Link
                        href="/auth/signup"
                        className="text-highlight hover:underline"
                    >
                        Sign Up
                    </Link>
                </span>

                {error && <div className="text-red-600 text-sm">{error}</div>}

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
                            className="p-2 border rounded-md bg-background text-foreground"
                            onChange={() => resetState()}
                        />
                        {errors.email && (
                            <span className="text-red-600 text-sm">
                                {errors.email.message as string}
                            </span>
                        )}
                    </div>

                    {showPassword && (
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
                                })}
                                type="password"
                                id="password"
                                placeholder="Password"
                                className="p-2 border rounded-md bg-background text-foreground"
                            />
                            {errors.password && (
                                <span className="text-red-600 text-sm">
                                    {errors.password.message as string}
                                </span>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={Object.keys(errors).length > 0}
                        className="p-2.5 font-semibold bg-blue-300 text-foreground rounded-md hover:bg-blue-400 disabled:bg-blue-200 groupÍ"
                    >
                        <span className="flex flex-row items-center justify-between">
                            {showPassword ? "Sign In" : "Continue"}
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 -translate-x-1 group-hover:translate-x-0" />
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
