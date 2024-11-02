import React from 'react';
import '../../app/globals.css'; // Adjust the path as necessary
import { MdPersonAdd } from 'react-icons/md';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  profession: string;
  bio: string;
}

export default function ProfileCard({
  firstName,
  lastName,
  profession,
  bio
}: ProfileCardProps) {
  return (
    <section className="w-3/4 sm:w-full mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row items-center relative space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Avatar className="items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
          <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png" className="rounded-full object-cover"/>
          <AvatarFallback>PFP</AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Details */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between mb-2">
          <div>
            <p className="text-lg sm:text-xl font-semibold">{firstName} {lastName}</p>
            <p className="text-sm sm:text-base text-gray-500">{profession}</p>
          </div>
        </div>
        {/* Bio */}
        <p className="text-gray-700 text-sm">{bio}</p>
      </div>
      
      {/* Add Friend Button */}
      <button className="bg-[#1CBCEE] text-white py-1.5 px-3 rounded-md hover:bg-[#F3686B] flex items-center space-x-1 mt-2 sm:mt-0 self-center sm:self-start">
        <MdPersonAdd className="text-lg" />
        <span>Add</span>
      </button>
    </section>
  );
}
