"use client";

import React, { useRef, useState } from "react";

const Modal: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [postBody, setPostBody] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewUrl(null);
        setFile(null);
        setPostBody("");
        setIsUploading(false);
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
        if (!file && !postBody) return;

        setIsUploading(true);
        try {
            let mediaId: number | null = null;

            if (file) {
                // 1. Get the presigned URL from your API
                const presignedUrlResponse = await fetch("/api/media", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                    }),
                });

                const {
                    data: { uploadUrl, mediaId: newMediaId },
                } = await presignedUrlResponse.json();

                // 2. Upload the file directly to S3 using the presigned URL
                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload to S3");
                }

                mediaId = newMediaId;
            }

            // 3. Create the post with the media ID
            const postResponse = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    body: postBody,
                    image: mediaId,
                    type: "post",
                }),
            });

            const postData = await postResponse.json();
            if (postData.success) {
                closeModal();
            } else {
                throw new Error(postData.error || "Failed to create post");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-row gap-4 justify-center items-center">
            <button
                onClick={openModal}
                className="px-4 py-2 bg-[#1CBCEE] text-2xl text-white rounded-lg hover:bg-[#1CBCEE]/90"
            >
                Create a Post
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    ></div>

                    <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-semibold">
                                Create a Post
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mt-4">
                            <p>What do you want to talk about?</p>
                            <textarea
                                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Write something..."
                                value={postBody}
                                onChange={(e) => setPostBody(e.target.value)}
                            ></textarea>

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

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={triggerFileInput}
                                className="flex items-center text-gray-600 hover:text-gray-800"
                                disabled={isUploading}
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            <div>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePostSubmit}
                                    className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90 disabled:opacity-50"
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Post"}
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
