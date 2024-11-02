"use client";

import React, { useState } from 'react';

interface InputFieldProps {
    message: string; 
}

const InputField: React.FC<InputFieldProps> = ({ message }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Searching for:", searchTerm);
    };

    return (
        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="relative">
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={message} 
                    required
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
        </form>
    );
};

export default InputField;
