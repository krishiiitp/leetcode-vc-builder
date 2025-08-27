"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false); // New state variable
  const pathname = usePathname();

  useEffect(() => {
    // Only run this code on the client side
    setIsClient(true);
    const username = localStorage.getItem("username");
    setUser(username);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link href="/">Leetcode Virtual Contest Builder</Link>
      </div>
      <div className="space-x-4">
        {isClient ? (
          !user ? (
            <>
              <Link href="/login" className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-700 transition-colors duration-200">
                Login
              </Link>
              <Link href="/signup" className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 transition-colors duration-200">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span>Hi, {user}</span>
              <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          )
        ) : (
          <div className="w-24 h-8 animate-pulse bg-gray-700 rounded-md"></div>
        )}
      </div>
    </nav>
  );
}