"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Client component that uses useSearchParams
function CanceledContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [redirectCounter, setRedirectCounter] = useState(5);

  // Determine where to redirect based on type
  const redirectPath = type === "studio" ? "/studio" : "/room";

  // Redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectPath;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectPath]);

  return (
    <motion.div
      className="max-w-xl w-full text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-light mb-8 tracking-wide">
        ORDER CANCELED
      </h1>

      <div className="w-12 h-px bg-white mx-auto mb-8" />
      
      <p className="text-gray-300 mb-10">
        Your purchase was canceled. No charges were made to your account.
      </p>
      
      <p className="text-gray-500 text-sm mb-10">
        Redirecting in {redirectCounter}...
      </p>

      <div>
        <Link
          href={redirectPath}
          className="border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 inline-block"
        >
          RETURN TO {type?.toUpperCase() || "SELECTION"}
        </Link>
      </div>
    </motion.div>
  );
}

// Loading fallback for Suspense
function CanceledLoading() {
  return (
    <div className="max-w-xl w-full text-center">
      <h1 className="text-3xl font-light mb-8 tracking-wide">
        LOADING...
      </h1>
      <div className="w-12 h-px bg-white mx-auto mb-8" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function CanceledPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white" style={{backgroundColor: '#2A2726'}}>
      <Suspense fallback={<CanceledLoading />}>
        <CanceledContent />
      </Suspense>
    </main>
  );
} 