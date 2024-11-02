"use client";

import React, { useRef, useState } from 'react';

const Modal: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null); // State to hold the uploaded file
    const [postBody, setPostBody] = useState(""); // State to hold the post body
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewUrl(null);
        setFile(null);
        setPostBody(""); // Reset post body when modal is closed
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handlePostSubmit = async () => {
        try {
            let mediaId: number | null = null;

            // If there's a file, request the media generation
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                // Call the media generation endpoint
                const mediaResponse = await fetch('/api/media', {
                    method: 'POST',
                    body: formData,
                });
                
                const mediaData = await mediaResponse.json();
                if (mediaData.success) {
                    mediaId = mediaData.data.mediaId;
                } else {
                    console.error("Media generation failed:", mediaData.error);
                }
            }

            // Now create the post
            const postResponse = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    body: postBody,
                    image: mediaId, // Use the media ID if available
                    type: 'post', // Change this to whatever type you need
                }),
            });

            const postData = await postResponse.json();
            if (postData.success) {
                closeModal(); // Close the modal on success
            } else {
                console.error("Post creation failed:", postData.error);
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={openModal}
                className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90"
            >
                Create a Post
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>

                    {/* Modal Container */}
                    <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-semibold">Create a Post</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p>What do you want to talk about?</p>
                            <textarea
                                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Write something..."
                                value={postBody}
                                onChange={(e) => setPostBody(e.target.value)} // Update post body state
                            ></textarea>

                            {/* Media Preview */}
                            {previewUrl && (
                                <div className="mt-4">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-1/4 h-1/4 rounded-md object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mt-4">
                            {/* Add Media Button */}
                            <button
                                onClick={triggerFileInput}
                                className="flex items-center text-gray-600 hover:text-gray-800"
                            >
                                <svg
                                    className="w-6 h-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.172 7l-3.586-3.586a1 1 0 00-1.415 0L6.172 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1h-2.172zM12 10a3 3 0 110 6 3 3 0 010-6z"
                                    ></path>
                                </svg>
                                Add Media
                            </button>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {/* Post and Cancel Buttons */}
                            <div>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePostSubmit} // Call post submit handler
                                    className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
