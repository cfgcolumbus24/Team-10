import React from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

interface ContactCardProps {
  email: string;
  phone: string;
}

export default function ContactCard({ 
    email,
    phone
}: ContactCardProps) {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-center gap-y-4 sm:gap-y-8 relative mt-4">
            <div className="flex items-center gap-x-2">
                <FaPhoneAlt className="mr-2"/>
                <p className="m-0"><a href={`mailto:${email}`}>{email}</a></p>
            </div>

            <div className="flex items-center gap-x-2">
                <IoMdMail className="mr-2"/>
                <p className="m-0 mx-0"><a href={`tel:${phone}`}>{phone}</a></p>
            </div>  
        </div>
    )
}
