import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const posts = [
  { id: 1, title: "Post 1", imageUrl: "./post1.png" },
  { id: 2, title: "Post 2", imageUrl: "./post2.png" },
  { id: 3, title: "Post 3", imageUrl: "./post3.png" },
  { id: 4, title: "Post 4", imageUrl: "./post4.png" },
  { id: 5, title: "Post 5", imageUrl: "./post5.png" },
];

export default function PostCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));

  const getDisplayPosts = () => {
    const mainIndex = currentIndex;
    const prevIndex = (mainIndex - 1 + posts.length) % posts.length;
    const nextIndex = (mainIndex + 1) % posts.length;
    return [posts[prevIndex], posts[mainIndex], posts[nextIndex]];
  };

  const displayPosts = getDisplayPosts();

  return (
    <div className="overflow-hidden p-4 bg-white rounded-lg shadow-md border border-gray-200 min-h-[300px] flex justify-center items-center relative mt-4">
      <button onClick={handlePrev} className="absolute inset-y-0 left-2 p-4 text-gray-500 hover:text-gray-700 z-10" aria-label="Previous post" style={{ fontSize: '2rem' }}>
        &#8249;
      </button>
      <div className="flex gap-x-6 transition-transform duration-300 ease-in-out justify-center items-center">
        {displayPosts.map((post, index) => {
          const isMainPost = index === 1;
          return (
            <div key={post.id} className={`transition-transform duration-500 ${isMainPost ? 'scale-105 shadow-lg z-10' : 'opacity-60 scale-95'}`} style={{ minWidth: isMainPost ? '80%' : '60%', maxWidth: isMainPost ? '80%' : '40%' }}>
              <Card className="w-full h-full">
                <CardHeader>
                  <img src={post.imageUrl} alt={post.title} className="w-full h-[200px] object-cover rounded-t-lg" />
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          );
        })}
      </div>
      <button onClick={handleNext} className="absolute inset-y-0 right-2 p-4 text-gray-500 hover:text-gray-700 z-10" aria-label="Next post" style={{ fontSize: '2rem' }}>
        &#8250;
      </button>
    </div>
  );
}
