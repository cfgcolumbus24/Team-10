import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-start lg:items-center lg:space-x-16 space-y-8 lg:space-y-0">
        
        <div className="lg:w-1/3 space-y-4">
          <h5 className="text-lg font-semibold">Connect</h5>
          <div className="flex space-x-6">
            <a href="https://www.facebook.com/LMCCNYC/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="hover:text-[#1CBCEE] transition-colors text-xl" />
            </a>
            <a href="https://twitter.com/LMCC" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="hover:text-[#1CBCEE] transition-colors text-xl" />
            </a>
            <a href="https://www.instagram.com/lmcc_nyc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-[#1CBCEE] transition-colors text-xl" />
            </a>
            <a href="https://www.linkedin.com/company/lower-manhattan-cultural-council/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn className="hover:text-[#1CBCEE] transition-colors text-xl" />
            </a>
          </div>
          <address className="not-italic text-sm space-y-1">
            <p>125 Maiden Lane, 2nd Floor</p>
            <p>New York, NY 10038</p>
            <p>(212) 219-9401</p>
            <p>
              <a href="mailto:info@lmcc.net" className="hover:text-[#1CBCEE] transition-colors">
                info@lmcc.net
              </a>
            </p>
          </address>
        </div>

     
        <div className="lg:w-1/3 space-y-4">
          <h5 className="text-lg font-semibold">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://lmcc.net/about/" className="hover:text-[#1CBCEE] transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="https://lmcc.net/get-involved/donate/" className="hover:text-[#1CBCEE] transition-colors">
                Support LMCC
              </a>
            </li>
            <li>
              <a href="https://lmcc.net/about/contact/" className="hover:text-[#1CBCEE] transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

 
      <div className="bg-gray-900 text-center py-4 mt-8">
        <p className="text-sm">© 2024 Lower Manhattan Cultural Council | LMCC</p>
      </div>
    </footer>
  );
}
