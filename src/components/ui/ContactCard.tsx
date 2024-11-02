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
        <div className="">
            <p>{email}</p>
            <p>{phone}</p>
        </div>
    )
}