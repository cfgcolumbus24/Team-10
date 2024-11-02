"use client";

import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Search } from "lucide-react";
import SearchForm from "./SearchForm";
import { useRouter } from "next/compat/router";

export default function Navbar() {
    const router = useRouter();

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

    const [profile, setProfile] = useState<{
        name?: string;
        bio?: string;
        contact?: string;
        picUrl?: string;
    } | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch("/api/profile");
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setProfile(result.data.profile);
                console.log(result.data.profile);
            }
        }
        fetchProfile();
    }, []);

    return (
        <>
            <nav className="bg-[#131313] bg-opacity-90 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white hover:text-[#121212] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                <svg
                                    className="hidden h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center text-white">
                                <Image
                                    className="h-8 w-auto pr-4"
                                    src="/LMCClogo.png"
                                    alt="LMCC"
                                    width={32}
                                    height={32}
                                />
                                <div className="ml-2 text-[#25BAF0] font-bold">
                                    <Badge
                                        className="text-lg px-4 py-1 bg-[#131313] text-[#25BAF0] cursor-pointer hover:bg-[#4372BC]"
                                        onClick={() =>
                                            window.open(
                                                "https://lmcc.net",
                                                "_blank"
                                            )
                                        }
                                    >
                                        Lower Manhattan Cultural Council
                                    </Badge>
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Button
                                        className="rounded-full px-3 py-4 text-base font-medium bg-none text-[#000000] hover:bg-[#4372BC]"
                                        onClick={() =>
                                            (window.location.href = "/")
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#25BAF0"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                    </Button>
                                    <Button
                                        className="rounded-full px-3 py-4 text-base font-medium bg-none text-[#000000] hover:bg-[#4372BC]"
                                        onClick={() =>
                                            (window.location.href = "/")
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#25BAF0"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <SearchForm message="Searching for Events, Artists, and Jobs" />
                            {!!profile && (
                                <button
                                    className="px-4 py-2 border border-transparent bg-[#F3686B] text-white rounded transition-all duration-300 
               hover:bg-white hover:border-[#F3686B] hover:text-[#F3686B]"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => (window.location.href = "/")}
                        >
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white hover:text-[#121212]"
                            onClick={() => (window.location.href = "/")}
                        >
                            Notifications
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}
