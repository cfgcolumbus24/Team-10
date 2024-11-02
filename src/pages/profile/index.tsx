import React from 'react';
import '../../app/globals.css'; // Adjust the path as necessary
import ContactCard from "@/components/ui/ContactCard";
import ProfileCard from "@/components/ui/ProfileCard";
import GalleryCard from "@/components/ui/GalleryCard";
import PostCard from "@/components/ui/PostCard";
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer'

export default function index() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col px-4 sm:mr-12 sm:ml-12 md:mr-20 md:ml-20 lg:mr-32 lg:ml-32">
        
        <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
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

        <div className="flex flex-col mt-4 pb-4"> {/* Added pb-4 here */}
          <GalleryCard />
          <PostCard />
        </div>
      </div>
      <Footer />
    </>
  );
}
