"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showToast, setShowToast] = useState(false);
  
  const copyEmailToClipboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = "chris@tarestudionyc.com";
    navigator.clipboard.writeText(email)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy email: ', err);
        // Fallback to mailto if copy fails
        window.location.href = `mailto:${email}`;
      });
  };
  
  return (
    <>
      <Header />
      {children}
      
      {/* Global Footer with Social Links */}
      <footer className="pb-12 pt-8 px-6" style={{backgroundColor: '#2A2726'}}>
        <div className="max-w-md mx-auto flex justify-center space-x-8">
          {/* Instagram Icon */}
          <a 
            href="https://instagram.com/tarecoffeeroom" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-300 hover:-translate-y-1"
            title="Follow us on Instagram"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          {/* Email Icon */}
          <a 
            href="#"
            onClick={copyEmailToClipboard}
            className="text-gray-500 hover:text-white transition-colors duration-300 hover:-translate-y-1"
            aria-label="Copy email to clipboard"
            title="Copy email to clipboard"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </footer>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed bottom-12 left-1/2 transform -translate-x-1/2 border border-white bg-black/80 text-white px-8 py-3 backdrop-blur-sm text-sm z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            chris@tarestudionyc.com.com copied
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 