import React from 'react';
import '../../app/globals.css'; // Adjust the path as necessary
import ContactCard from "@/components/ui/ContactCard";
import ProfileCard from "@/components/ui/ProfileCard";
import GalleryCard from "@/components/ui/GalleryCard";
import PostCard from "@/components/ui/PostCard";
import Navbar from '@/components/ui/Navbar';

export default function index() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col p-4 sm:p-8 md:mx-32 gap-4">
        
        {/* Profile and Contact Cards */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
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

        {/* Gallery and Post Cards */}
        <div className="flex flex-col mt-4 gap-4">
          <GalleryCard />
          <PostCard />
        </div>
      </div>
    </>
  );
}
