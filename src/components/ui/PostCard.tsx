import React, { useState, useEffect } from 'react';
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
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size to apply responsive styling
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize(); // Initialize on first render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? posts.length - 1 : prevIndex - 1;
      console.log("Scrolling Left to Index:", newIndex); // Debugging log
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
      console.log("Scrolling Right to Index:", newIndex); // Debugging log
      return newIndex;
    });
  };

  const getDisplayPosts = () => {
    const mainIndex = currentIndex;
    const prevIndex = (mainIndex - 1 + posts.length) % posts.length;
    const nextIndex = (mainIndex + 1) % posts.length;
    return [posts[prevIndex], posts[mainIndex], posts[nextIndex]];
  };

  const displayPosts = getDisplayPosts();

  return (
    <div className="overflow-hidden p-4 bg-white rounded-lg shadow-md border border-gray-200 min-h-[300px] flex justify-center items-center relative mt-4">
      <button
        onClick={handlePrev}
        className="absolute inset-y-0 left-2 p-4 text-gray-500 hover:text-gray-700 z-10"
        aria-label="Previous post"
        style={{ fontSize: '2rem' }} // Larger button for better touch support
      >
        &#8249;
      </button>

      <div className="flex gap-x-6 transition-transform duration-300 ease-in-out justify-center items-center">
        {displayPosts.map((post, index) => {
          const isMainPost = index === 1; // Main post is always at center in the array

          // Styles for main and teased posts based on screen size
          const mainPostStyles = isLargeScreen
            ? "scale-105 shadow-lg z-10 transform translate-y-[-5px] opacity-100"
            : "scale-100 opacity-100";
          const teaserStyles = isLargeScreen
            ? "opacity-60 scale-95"
            : "opacity-40 scale-90";

          return (
            <div
              key={post.id}
              className={`transition-transform duration-500 ease-in-out ${
                isMainPost ? mainPostStyles : teaserStyles
              }`}
              style={{
                minWidth: isMainPost ? "80%" : "60%",
                maxWidth: isMainPost ? "80%" : "40%",
              }}
            >
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        className="absolute inset-y-0 right-2 p-4 text-gray-500 hover:text-gray-700 z-10"
        aria-label="Next post"
        style={{ fontSize: '2rem' }} // Larger button for better touch support
      >
        &#8250;
      </button>
    </div>
  );
}
