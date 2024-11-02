"use client";

import { Lock, User } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email: string;
    password: string;
}

interface ApiResponse {
    error?: string;
    data?: {
        onboarded: boolean;
    };
}

export const metadata: Metadata = {
    title: "Sign In :: AlumNet",
};

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: "",
        password: "",
    });

    const validateEmail = (email: string): string => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!email) {
            return "Email is required";
        }
        if (!emailRegex.test(email)) {
            return "Invalid email format";
        }
        return "";
    };

    const validatePassword = (password: string): string => {
        if (!password) {
            return "Password is required";
        }
        return "";
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email") {
            setFormErrors((prev) => ({
                ...prev,
                email: validateEmail(value),
            }));
            setShowPassword(false);
            setFormData((prev) => ({
                ...prev,
                password: "",
            }));
        } else if (name === "password") {
            setFormErrors((prev) => ({
                ...prev,
                password: validatePassword(value),
            }));
        }
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const emailError = validateEmail(formData.email);
        setFormErrors((prev) => ({
            ...prev,
            email: emailError,
        }));

        if (emailError) {
            return;
        }

        if (!showPassword) {
            setShowPassword(true);
            return;
        }

        const passwordError = validatePassword(formData.password);
        setFormErrors((prev) => ({
            ...prev,
            password: passwordError,
        }));

        if (passwordError) {
            return;
        }

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok) {
                setError(result.error || "An error occurred");
                return;
            }

            if (!result.data?.onboarded) {
                window.location.href = "/auth/onboarding";
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                {/* User Icon Circle */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#1CBCEE] flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                    MEMBER LOGIN
                </h1>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email/Username Input */}
                    <div className="relative">
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Username"
                            className="w-full p-4 pl-12 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        />
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        {formErrors.email && (
                            <span className="text-red-500 text-sm mt-1 block">
                                {formErrors.email}
                            </span>
                        )}
                    </div>

                    {/* Password Input */}
                    {showPassword && (
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="w-full p-4 pl-12 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            {formErrors.password && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {formErrors.password}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 text-gray-600">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span>Remember me</span>
                        </label>
                        <a className="text-blue-500 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full p-4 text-white bg-[#1CBCEE] rounded-lg hover:[#1CBCEE] transition-colors duration-200 font-medium"
                    >
                        LOGIN
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center text-gray-600">
                        <span>Need an account? </span>
                        <a
                            href="/auth/signup"
                            className="text-blue-500 hover:underline"
                        >
                            Sign Up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
