import React from 'react'

interface ProfileCardProps {
    firstName: string;
    lastName: string;
    profession: string;
    bio: string;
    profilePic: string;
}
export default function ProfileCard({
firstName, lastName, profession, bio, profilePic
} : ProfileCardProps) {
  return (
    <section >
        <button>
            Add
        </button>
        <div>
<img src={`${profilePic}`} alt = {`${firstName} ${lastName}`} />
        </div>

        <div>
            <div>
                <p>{firstName} {lastName}</p>
            </div>
            <div>
                <p>{bio}</p>
            </div>
        </div>
    </section>
  )
}
