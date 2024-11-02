import React from 'react';


interface ContactCardProps {
  email: string;
  phone: string;
}

export default function ContactCard({ 
    email,
    phone
}: ContactCardProps) {
    return (
        <div className="w-1/4 mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center gap-y-8 relative space-x-4 mt-4">
            <p><a href={`mailto:${email}`}>{email}</a></p>
            <p><a href={`tel:${phone}`}>{phone}</a></p>
        </div>
    )
}