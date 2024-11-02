import "../../app/globals.css"; // Adjust the path as necessary

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MdPersonAdd } from "react-icons/md";
import React from "react";

interface ProfileCardProps {
    name: string;
    bio: string;
    resourceUrl: string;
    contact: string;
    addButton: boolean;
}

export default function ProfileCard({
    name,
    resourceUrl,
    bio,
    contact,
    addButton,
}: ProfileCardProps) {
    return (
        <section className="w-3/4 mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex items-center relative space-x-4 mt-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
                <Avatar className="items-center justify-center align-center w-32 h-32">
                    <AvatarImage
                        src={resourceUrl}
                        className="rounded-full object-cover"
                    />
                    <AvatarFallback>PFP</AvatarFallback>
                </Avatar>
            </div>
            {/* Profile Details */}
            <div className="flex-1 gap-1">
                <div className="flex items-baseline justify-between mb-2">
                    <div>
                        <p className="text-2xl font-semibold">{name}</p>
                    </div>
                </div>
                {/* Bio */}
                <p className="text-gray-700 text-xl">{bio}</p>
                <p className="pt-1">{contact}</p>
            </div>
            {/* Add Friend Button */}
            {addButton && (
                <button className="bg-[#1CBCEE] text-white py-1.5 px-3 rounded-md hover:bg-[#F3686B] flex items-start self-start space-x-1">
                    <MdPersonAdd className="text-lg" />
                    <span>Add</span>
                </button>
            )}
        </section>
    );
}
