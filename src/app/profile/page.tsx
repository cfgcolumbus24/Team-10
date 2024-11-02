"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent, CardDescription } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import ProfileCard from "@/components/ui/ProfileCard";

interface UserProfile {
    id: number;
    name: string;
    bio: string | null;
    contact: string | null;
    pic: string | null;
    picUrl: string | null;
}

interface GalleryPost {
    id: number;
    userId: number;
    body: string;
    image: number;
    type: "post";
    timestamp: string;
    resourceUrl: string;
}

interface UserMedia {
    url: string;
    postId: number;
}

interface ApiResponseData {
    message: string;
    profile: UserProfile;
    userPosts: any[]; // You can replace 'any' with a specific type if needed
    galleryPosts: GalleryPost[];
    userMedia: UserMedia[];
}

interface ApiResponse {
    success: boolean;
    data: ApiResponseData;
}

export default function Index() {
    const [profile, setProfile] = useState<ApiResponseData | null>(null);

    useEffect(() => {
        document.title = `Profile :: AlumNet`;
    }, []);

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch("/api/profile");
            const result: ApiResponse = await response.json();
            console.log(result);
            if (result.success) {
                setProfile(result.data);
                console.log(result.data);
            }
        }
        fetchProfile();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col mr-32 ml-32">
                <div className="flex gap-x-4">
                    <ProfileCard
                        name={profile?.profile.name}
                        bio={profile?.profile.bio}
                        resourceUrl={profile?.profile.picUrl}
                        contact={profile?.profile.contact}
                        addButton={false}
                    />
                </div>
                <div className="flex flex-grid gap-4 pt-12">
                    {profile?.userMedia.map((post) => (
                        <a key={post.postId} className="group">
                            <Card>
                                <div className="flex flex-row items-center justify-center w-64 h-64">
                                    <img
                                        className="rounded-md w-full h-full object-cover"
                                        src={post.url}
                                        alt="Post image"
                                    />
                                </div>
                            </Card>
                        </a>
                    ))}
                </div>
                <div className="flex flex-col gap-4 py-8 items-center justify-center">
                    <div className="w-[40%] space-y-8 flex flex-col gap-1">
                        {profile?.galleryPosts.map((post) => (
                            <a key={post.id} className="group">
                                <Card>
                                    <CardHeader className="">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="items-center justify-center align-center w-16 h-16 object-cover clip-content">
                                                <AvatarImage
                                                    src={
                                                        profile.profile
                                                            .picUrl || ""
                                                    }
                                                />
                                                <AvatarFallback>
                                                    UA
                                                </AvatarFallback>
                                            </Avatar>
                                            <CardTitle className="text-2xl">
                                                {profile.profile.name}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        {post.resourceUrl && (
                                            <div className="flex flex-row items-center justify-center text-clip">
                                                <img
                                                    className="rounded-md"
                                                    src={post.resourceUrl}
                                                    alt="Post image"
                                                />
                                            </div>
                                        )}
                                        <CardDescription className="text-2xl">
                                            {post.body}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
