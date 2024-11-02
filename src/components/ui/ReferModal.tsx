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

    return (
        <div className="flex flex-row gap-4 justify-center items-center">
            <button
                onClick={openModal}
                className="px-4 py-2 bg-[#1CBCEE] text-2xl text-white rounded-lg hover:bg-[#1CBCEE]/90"
            >
                Refer someone
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
                                Refer someone below
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mt-4">
                            <input
                                type="email"
                                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter email address..."
                                value={postBody}
                                onChange={(e) => setPostBody(e.target.value)}
                            />

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
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
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
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90 disabled:opacity-50"
                                    disabled={isUploading}
                                >
                                    Refer
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
