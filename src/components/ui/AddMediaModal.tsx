"use client";

import React, { useRef, useState } from "react";

const AddMediaModal: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={openModal}
                className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90"
            >
                Add Media
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Container */}
                    <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-semibold">Add Media</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p>Select a file to upload:</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="mt-2"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            {previewUrl && (
                                <div className="mt-4">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-auto rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-[#1CBCEE] text-white rounded-lg hover:bg-[#1CBCEE]/90"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMediaModal;
