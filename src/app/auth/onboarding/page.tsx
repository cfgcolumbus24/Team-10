"use client";

import { ChevronRight, Loader2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mediaId, setMediaId] = useState<number | null>(null);

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

            router.push("/feed");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-row items-center w-full justify-center pt-20">
            <div className="h-fit w-1/2 flex flex-col gap-8 items-start justify-center">
                <h1 className="text-4xl font-bold text-foreground">
                    Complete your profile
                </h1>

                <div className="w-full flex flex-col gap-4">
                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full h-fit flex flex-col gap-6"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="relative w-32 h-32 rounded-full overflow-hidden bg-background cursor-pointer group"
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
                                    <div className="w-full h-full flex items-center justify-center bg-background">
                                        <Upload className="w-8 h-8 text-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            <p className="text-sm text-foreground">
                                Click to upload profile picture
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-foreground"
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
                                className="p-2 border rounded-md bg-background text-foreground"
                            />
                            {errors.name && (
                                <span className="text-red-600 text-sm">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="bio"
                                className="text-sm font-medium text-foreground"
                            >
                                Bio
                            </label>
                            <textarea
                                {...register("bio")}
                                id="bio"
                                rows={4}
                                placeholder="Tell us about yourself"
                                className="p-2 border rounded-md bg-background text-foreground resize-none"
                            />
                            {errors.bio && (
                                <span className="text-red-600 text-sm">
                                    {errors.bio.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="contact"
                                className="text-sm font-medium text-foreground"
                            >
                                Contact Information
                            </label>
                            <input
                                {...register("contact")}
                                type="text"
                                id="contact"
                                placeholder="How can people reach you?"
                                className="p-2 border rounded-md bg-background text-foreground"
                            />
                            {errors.contact && (
                                <span className="text-red-600 text-sm">
                                    {errors.contact.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="p-2.5 font-semibold bg-blue-300 text-foreground rounded-md hover:bg-blue-400 disabled:bg-blue-200 group"
                        >
                            <span className="flex flex-row items-center justify-between">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Complete Profile
                                        <ChevronRight className="w-4 h-4 transition-transform duration-300 -translate-x-1 group-hover:translate-x-0" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;
