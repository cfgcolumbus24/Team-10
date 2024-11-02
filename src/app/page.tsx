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

import { ChevronRight } from "lucide-react";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
    useEffect(() => {
        document.title = `Feed :: AlumNet`;
    }, []);

    const [feed, setFeed] = useState([]);
    const [profile, setProfile] = useState<{
        name?: string;
        bio?: string;
        contact?: string;
        picUrl?: string;
    }>({});
    const [explore, setExplore] = useState<
        { id: string; name: string; bio: string; pic: string; picUrl: string }[]
    >([]);

    const handleSignOut = async () => {
        try {
            const response = await fetch("/api/auth/signout", {
                // Adjust the path based on your API structure
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                // Redirect to sign-in page if sign-out is successful
                window.location.href = "/";
            } else {
                // Handle sign-out error (you might want to display this to the user)
                console.error("Sign out error:", data.error);
            }
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

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
            <div className="w-full flex-auto content-center items-start justify-center flex p-20 space-x-8 ">
                {profile && profile.name ? (
                    <div className="w-[25%]">
                        <Card className="gap-0 group">
                            <Link href="/profile">
                                <div className="flex items-center justify-center pt-4 pb-0">
                                    <Avatar className="items-center justify-center align-center w-32 h-32 clip-content">
                                        <AvatarImage
                                            src={profile.picUrl}
                                            className="rounded-full object-cover"
                                        />
                                        <AvatarFallback>PFP</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="text-center align-center gap-0">
                                    <CardHeader>
                                        <CardTitle className="text-4xl group-hover:text-gray-600">
                                            {profile.name}
                                        </CardTitle>
                                        <p className="group-hover:text-gray-600">
                                            Your profile
                                        </p>
                                    </CardHeader>
                                </div>
                            </Link>
                            <div className="flex justify-center mb-4">
                                <button
                                    className="px-4 py-2 border border-transparent bg-[#F3686B] text-white rounded transition-all duration-300 
               hover:bg-white hover:border-[#F3686B] hover:text-[#F3686B]"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
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
                <div className="w-[40%] space-y-8 flex flex-col gap-1">
                    {profile && profile.name ? (
                        <Card className="">
                            <CardHeader className="flex flex-row gap-3">
                                <Modal></Modal>
                            </CardHeader>
                        </Card>
                    ) : null}
                    {feed.map((post) => (
                        <Card key={post["id"]}>
                            <CardHeader className="group-hover:text-gray-500">
                                <div
                                    className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
                                    onClick={() =>
                                        (window.location.href =
                                            "/profile/" + post["userId"])
                                    }
                                >
                                    <Avatar className="items-center justify-center align-center w-16 h-16">
                                        <AvatarImage
                                            className="w-full h-full object-cover clip-content"
                                            src={post["userPicResourceUrl"]}
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
                            <CardContent className="flex flex-col gap-4">
                                {post["resourceUrl"] && (
                                    <div className="flex flex-row items-center justify-center text-clip object-cover clip-content">
                                        <img
                                            className="rounded-md"
                                            src={post["resourceUrl"]}
                                        ></img>
                                    </div>
                                )}
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
                        <CardContent className="flex flex-col">
                            {explore.map((stuff) => (
                                <a
                                    className="flex gap-4 group p-2" // Changed to flex layout with gap
                                    key={stuff.id}
                                    href={`/profile/${stuff.id}`}
                                >
                                    <div>
                                        <Avatar className="items-center justify-center align-center w-16 h-16 object-cover clip-content">
                                            <AvatarImage src={stuff.picUrl} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="font-bold group-hover:text-gray-500">
                                            {stuff.name}
                                        </div>
                                        <div className="text-sm">
                                            {stuff.bio}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                    <div className="h-8"></div>
                    {profile.name && (
                        // view the job postings and events
                        <div>
                            <Card>
                                <CardContent className="flex flex-col p-4 space-y-2">
                                    {feed
                                        .filter(
                                            (e) => e["type"] == "opportunity"
                                        )
                                        .map((event) => (
                                            <a
                                                className="flex flex-col group border-b border-gray-200 pb-2 last:border-b-0"
                                                key={event["id"]}
                                                href={`/events/${event["id"]}`}
                                            >
                                                <div className="font-semibold text-lg group-hover:text-gray-700">
                                                    Job Posting
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {event["body"]} |{" "}
                                                    {event["image"]}
                                                </div>
                                            </a>
                                        ))}
                                    <Link
                                        href="/"
                                        className="text-gray-400 text-sm mt-4 flex items-center"
                                    >
                                        View more LMCC Job Opportunities
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </CardContent>
                            </Card>

                            <div className="h-8"></div>
                            <Card>
                                <CardContent className="flex flex-col p-4 space-y-2">
                                    {feed
                                        .filter((e) => e["type"] == "event")
                                        .map((event) => (
                                            <a
                                                className="flex flex-col group border-b border-gray-200 pb-2 last:border-b-0"
                                                key={event["id"]}
                                                href={`/events/${event["id"]}`}
                                            >
                                                <div className="font-semibold text-lg group-hover:text-gray-700">
                                                    LMCC Events
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {event["body"]} |{" "}
                                                    {event["image"]}
                                                </div>
                                            </a>
                                        ))}
                                    <Link
                                        href="/"
                                        className="text-gray-400 text-sm mt-4 flex items-center"
                                    >
                                        View more LMCC Events
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
