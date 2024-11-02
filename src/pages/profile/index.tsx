import React from 'react'
import '../../app/globals.css' // Adjust the path as necessary
import ContactCard from "../../components/ui/ContactCard"
import ProfileCard from "../../components/ui/ProfileCard"
export default function index() {
  return (
    <div className="flex p-4">
      <ProfileCard
          firstName="John"
          lastName="Doe"
          profession="Painter"
          bio="Living life, designing art, painting pictures, OSU GRAD"
          profilePic="/blankProfilePic.png" 
        />
        <ContactCard 
          email="Testing@gmail.com"
          phone="123-456-7890"
        />
      </div>
  )
}
