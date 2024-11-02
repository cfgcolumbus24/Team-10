import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

interface ContactCardProps {
  email: string;
  phone: string;
}

export default function ContactCard({
  email,
  phone,
}: ContactCardProps) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4 sm:p-2 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center sm:items-start gap-4 mt-4">
      <div className="flex items-center gap-x-2">
        <FaPhoneAlt className="text-gray-500" />
        <p className="m-0 text-sm sm:text-base"><a href={`tel:${phone}`}>{phone}</a></p>
      </div>

      <div className="flex items-center gap-x-2">
        <IoMdMail className="text-gray-500" />
        <p className="m-0 text-sm sm:text-base"><a href={`mailto:${email}`}>{email}</a></p>
      </div>
    </div>
  );
}
