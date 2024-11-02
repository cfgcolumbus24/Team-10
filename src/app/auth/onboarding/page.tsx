"use client";

import { ChevronRight, Loader2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth, withAuthRedirect } from "@/contexts/AuthContext";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface ProfileFormData {
    name: string;
    bio: string;
    contact: string;
}

const OnboardingForm = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mediaId, setMediaId] = useState<number | null>(null);

    useEffect(() => {
        document.title = `Welcome :: AlumNet`;
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setError("");

            // 1. Get presigned URL
            const presignedResponse = await fetch("/api/media", {
                method: "POST",
            });

            if (!presignedResponse.ok) {
                throw new Error("Failed to get upload URL");
            }

            const {
                data: { uploadUrl, mediaId },
            } = await presignedResponse.json();
            setMediaId(mediaId);

            // 2. Upload file to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload file");
            }

            // 3. Show preview
            setPreviewUrl(URL.createObjectURL(file));
        } catch (err) {
            setError("Failed to upload image");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    pic: mediaId,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update profile");
            }

            router.push("/");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="relative w-32 h-32 rounded-full overflow-hidden bg-[#1CBCEE] flex items-center justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Upload className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <p className="text-sm text-gray-600">
                        Click to upload profile picture
                    </p>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                    Complete Your Profile
                </h1>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full Name Input */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            {...register("name", {
                                required: "Name is required",
                            })}
                            type="text"
                            id="name"
                            placeholder="Your full name"
                            className="w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1CBCEE] text-gray-900 placeholder-gray-500"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Bio Input */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="bio"
                            className="text-sm font-medium text-gray-700"
                        >
                            Bio
                        </label>
                        <textarea
                            {...register("bio")}
                            id="bio"
                            rows={4}
                            placeholder="Tell us about yourself"
                            className="w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1CBCEE] text-gray-900 placeholder-gray-500 resize-none"
                        />
                        {errors.bio && (
                            <span className="text-red-500 text-sm">
                                {errors.bio.message}
                            </span>
                        )}
                    </div>

                    {/* Contact Information Input */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="contact"
                            className="text-sm font-medium text-gray-700"
                        >
                            Contact Information
                        </label>
                        <input
                            {...register("contact")}
                            type="text"
                            id="contact"
                            placeholder="How can people reach you?"
                            className="w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1CBCEE] text-gray-900 placeholder-gray-500"
                        />
                        {errors.contact && (
                            <span className="text-red-500 text-sm">
                                {errors.contact.message}
                            </span>
                        )}
                    </div>

                    {/* Referral Email */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Enter a referral email of an artist who would enjoy LMCC to receive exclusive event invites and opportunities to join our art shows.
                        </label>
                        <input
                            {...register("name")}
                            type="email"
                            id="refEmail"
                            placeholder="Give a referral email"
                            className="w-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1CBCEE] text-gray-900 placeholder-gray-500"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-4 text-white bg-[#1CBCEE] rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                    >
                        <span className="flex items-center justify-center">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Complete Profile
                                    <ChevronRight className="w-4 h-4 transition-transform duration-300 -translate-x-1" />
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default withAuthRedirect(OnboardingForm);
