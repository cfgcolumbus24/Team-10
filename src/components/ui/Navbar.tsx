"use client"

import { Search } from "lucide-react";
import Image from "next/image";
import React from 'react';
import SearchForm from "./SearchForm";
import { useRouter } from 'next/compat/router'

export default function Navbar() {
  const router = useRouter();

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center text-white">
                <Image
                  className="h-8 w-auto"
                  src="/LMCC_logo.png"
                  alt="LMCC"
                  width={32} // Specify width
                  height={32} // Specify height
                />
                <div className="ml-2">
                  Lower Manhattan Cultural Council Inc.
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                <a
                    href="#"
                    className="rounded-md px-1 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                  <svg className="w-6 h-6 mb-1" fill="white" viewBox="0 0 24 24">
                    <path d="M12 3l9 9h-3v9H6v-9H3l9-9z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="rounded-md px-1 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <svg className="w-6 h-6 mb-1 text-white" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2a2 2 0 00-2 2v1c-1.74 0-3.28.79-4.2 2.01A5.978 5.978 0 005 11v6l-1 1v1h16v-1l-1-1v-6a5.978 5.978 0 00-2.8-5.99A5.976 5.976 0 0014 5V4a2 2 0 00-2-2zM5 17h14v-6c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v6zM12 20c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
                  </svg>
                </a>
                </div>
              </div>
            </div>
            <SearchForm message="Searching for Events, Artists, and Jobs"/>
          </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <a
              href="#"
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Home
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Notifications
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
