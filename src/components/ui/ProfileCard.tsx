import React from 'react';
import '../../app/globals.css'; // Adjust the path as necessary


interface ProfileCardProps {
  firstName: string;
  lastName: string;
  profession: string;
  bio: string;
  profilePic: string;
}

export default function ProfileCard({
  firstName,
  lastName,
  profession,
  bio,
  profilePic,
}: ProfileCardProps) {
  return (
    <section className="w-3/4 mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex items-center relative space-x-6">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <img
          src={profilePic}
          alt={`${firstName} ${lastName}`}
          className="w-36 h-36 rounded-full object-cover border-4 border-gray-100 p-1"
        />
      </div>

      {/* Profile Details */}
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-2xl font-bold">{firstName} {lastName}</p>
            <p className="text-lg text-gray-500">{profession}</p>
          </div>
          {/* Add Friend Button */}
          <button className="bg-[#1CBCEE] text-white py-2 px-4 rounded-md hover:bg-[#F3686B]">
            Add
          </button>
        </div>
        {/* Bio */}
        <p className="text-gray-700 text-sm">{bio}</p>
      </div>
    </section>
  );
}
