import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0">
        
        {/* Connect Section */}
        <div>
          <h5 className="text-lg font-semibold">Connect</h5>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/LMCCNYC/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-[#1CBCEE] transition-colors" />
            </a>
            <a href="https://twitter.com/LMCC" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-[#1CBCEE] transition-colors" />
            </a>
            <a href="https://www.instagram.com/lmcc_nyc/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-[#1CBCEE] transition-colors" />
            </a>
            <a href="https://www.linkedin.com/company/lower-manhattan-cultural-council/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="hover:text-[#1CBCEE] transition-colors" />
            </a>
          </div>
          <p className="text-sm">125 Maiden Lane, 2nd Floor, New York, NY 10038</p>
          <p className="text-sm">(212) 219-9401</p>
          <p className="text-sm"><a href="mailto:info@lmcc.net" className="hover:text-[#1CBCEE] transition-colors">info@lmcc.net</a></p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h5 className="text-lg font-semibold">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="https://lmcc.net/about/" className="hover:text-[#1CBCEE] transition-colors">About</a></li>
            <li><a href="https://lmcc.net/get-involved/donate/" className="hover:text-[#1CBCEE] transition-colors">Support LMCC</a></li>
            <li><a href="https://lmcc.net/about/contact/" className="hover:text-[#1CBCEE] transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-900 text-center py-4 mt-8">
        <p className="text-sm">© 2024 Lower Manhattan Cultural Council | LMCC</p>
      </div>
    </footer>
  );
}
