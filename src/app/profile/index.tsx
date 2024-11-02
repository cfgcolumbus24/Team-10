import ContactCard from "@/components/ui/ContactCard";
import GalleryCard from "@/components/ui/GalleryCard";
import Navbar from "@/components/ui/Navbar";
import PostCard from "@/components/ui/PostCard";
import ProfileCard from "@/components/ui/ProfileCard";
import React from "react";

export default function index() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col mr-32 ml-32">
                <div className="flex gap-x-4">
                    <ProfileCard
                        firstName="John"
                        lastName="Doe"
                        profession="Painter"
                        bio="Living life, designing art, painting pictures, OSU GRAD"
                    />
                    <ContactCard
                        email="Testing@gmail.com"
                        phone="123-456-7890"
                    />
                </div>
                <div className="flex flex-col">
                    <GalleryCard />
                    <PostCard />
                </div>
            </div>
        </>
    );
}
