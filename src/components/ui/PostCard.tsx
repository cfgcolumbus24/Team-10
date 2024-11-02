import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const posts = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
  { id: 3, title: "Post 3" },
  { id: 4, title: "Post 4" },
  { id: 5, title: "Post 5" },
];

export default function PostCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 min-h-[300px] flex justify-center items-center relative mt-4">
      <button onClick={handlePrev} className="absolute left-0 p-2 text-gray-500 hover:text-gray-700" aria-label="Previous post">
        &#8249;
      </button>

      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle>{posts[currentIndex].title}</CardTitle>
        </CardHeader>
      </Card>

      <button onClick={handleNext} className="absolute right-0 p-2 text-gray-500 hover:text-gray-700" aria-label="Next post">
        &#8250;
      </button>
    </div>
  );
}
