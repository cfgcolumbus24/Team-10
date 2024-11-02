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
    <section className="w-3/4 mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex items-center relative space-x-4 mt-4">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Avatar className="items-center justify-center align-center w-32 h-32">
          <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png" className="rounded-full object-cover"/>
          <AvatarFallback>PFP</AvatarFallback>
        </Avatar>

      </div>

      {/* Profile Details */}
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <p className="text-xl font-semibold">{firstName} {lastName}</p>
            <p className="text-base text-gray-500">{profession}</p>
          </div>
          
        </div>
        {/* Bio */}
        <p className="text-gray-700 text-sm">{bio}</p>
        
      </div>
      {/* Add Friend Button */}
      <button className="bg-[#1CBCEE] text-white py-1.5 px-3 rounded-md hover:bg-[#F3686B] flex items-start self-start space-x-1">
        <MdPersonAdd className="text-lg" />
        <span>Add</span>
      </button>
    </section>
  );
}
