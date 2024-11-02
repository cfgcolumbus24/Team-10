"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { use, useEffect, useState } from "react";

import AddMediaModal from "@/components/ui/AddMediaModal";
import Image from "next/image";
import InputField from "@/components/ui/InputField";
import Modal from "@/components/ui/Modal";
import Navbar from "../components/ui/Navbar";
import SearchForm from "@/components/ui/SearchForm";

export default function Home() {
    const [feed, setFeed] = useState([]);
    const [profile, setProfile] = useState<{
        name?: string;
        bio?: string;
        contact?: string;
    }>({});
    const [explore, setExplore] = useState<
        { id: string; name: string; bio: string; pic: string }[]
    >([]);

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch("/api/feed");
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setFeed(result.data.posts);
                console.log(result.data.posts);
            }
        }

        async function fetchProfile() {
            const response = await fetch("/api/profile");
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setProfile(result.data.profile);
                console.log(result.data.profile);
            }
        }

        async function fetchExplore() {
            const response = await fetch("/api/network/explore");
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setExplore(result.data);
                console.log(result.data);
            }
        }

        fetchPosts();
        fetchProfile();
        fetchExplore();
    }, []);

    return (
        <div className="">
            <Navbar />

            {/* left panel - profile info */}
            <div className="w-full flex-auto content-center items-start justify-center flex p-20 space-x-8">
                {profile && profile.name ? (
                    <div className="w-[25%]">
                        <Card className="gap-0">
                            <div className="flex items-center justify-center pt-4 pb-0">
                                <Avatar className="items-center justify-center align-center w-32 h-32">
                                    <AvatarImage
                                        src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                                        className="rounded-full object-cover"
                                    />
                                    <AvatarFallback>PFP</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-center align-center gap-0">
                                <CardHeader>
                                    <CardTitle className="text-4xl">
                                        {profile.name}
                                    </CardTitle>
                                    <CardDescription className="text-xl">
                                        {profile.bio}
                                    </CardDescription>
                                    <CardDescription className="text-2xl">
                                        {profile.contact}
                                    </CardDescription>
                                </CardHeader>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="w-[25%]">
                        <Card className="gap-0">
                            <div className="text-center align-center gap-0">
                                <CardHeader>
                                    <CardTitle className="text-4xl">
                                        Sign In
                                    </CardTitle>
                                    <CardDescription className="text-xl">
                                        Please sign in to view your profile
                                    </CardDescription>
                                    <button
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() =>
                                            (window.location.href =
                                                "/auth/signin")
                                        }
                                    >
                                        Sign In
                                    </button>
                                </CardHeader>
                            </div>
                        </Card>
                    </div>
                )}

                {/* middle panel - make a post and post feed below it */}
                <div className="w-[40%] space-y-8">
                    {profile && profile.name ? (
                        <Card className="">
                            <CardHeader className="flex flex-row gap-3">
                                <Avatar className="items-center justify-center align-center w-16 h-16">
                                    <AvatarImage
                                        src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                                        className="rounded-full object-cover"
                                    />
                                    <AvatarFallback>PFP</AvatarFallback>
                                </Avatar>
                                <Modal></Modal>
                            </CardHeader>
                        </Card>
                    ) : null}
                    {feed.map((post) => (
                        <Card key={post["id"]} className="">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="items-center justify-center align-center w-16 h-16">
                                        <AvatarImage
                                            src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${post["userId"]}.png`}
                                        />
                                        <AvatarFallback>
                                            {post["image"]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-2xl">
                                        {post["userName"]}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-2xl">
                                    {post["body"]}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* right panel - connect with other  */}
                <div className="w-[25%]">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {profile && profile.name
                                    ? "Connect"
                                    : "Explore"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {explore.map((stuff) => (
                                <div
                                    className="grid grid-rows-3 grid-flow-col gap-1"
                                    key={stuff.id}
                                >
                                    <div className="row-span-3">
                                        <Avatar className="items-center justify-center align-center w-16 h-16">
                                            <AvatarImage src={`${stuff.pic}`} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="col-span-2 font-bold">
                                        {stuff.name}
                                    </div>
                                    <div className="row-span-2 col-span-2 text-sm">
                                        {stuff.bio}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
