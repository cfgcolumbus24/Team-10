import React from 'react'
import ProfileCard from "../../components/ui/ProfileCard"
export default function page() {
  return (
    <ProfileCard
        firstName="John"
        lastName="Doe"
        profession="Painter"
        bio="Living life, designing art, painting pictures, OSU GRAD"
        profilePic="/blankProfilePic.png" 
      />
  )
}
