"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const topics = ["Dynamic Programming", "Graph", "Array", "Greedy", "Tree"];

export default function Home() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser(username);
  }, []);

  const handleBuildContest = () => {
    if (!user) {
      setShowModal(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const apiUrl = `http://localhost:8000/api/build-contest?topic=${selectedTopic}`;
    console.log(`Building contest with API call to: ${apiUrl}`);

    // Here you would make the actual API call
    // await fetch(apiUrl, { method: "POST" });
    // router.push("/contest-dashboard");
    
    // For now, let's show a success-like modal
    // You can replace this with a real loading or success modal after the API call
    setShowModal(false);
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center bg-gray-950 text-white relative">
      <main className="flex flex-col items-center text-center max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
            Leetcode Virtual Contest Builder
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl">
            Choose a topic and build a personalized LeetCode-style virtual contest. Sharpen your skills with a curated set of 4 problems: 1 Easy, 2 Medium, and 1 Hard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md flex flex-col gap-4 items-center"
        >
          <div className="w-full relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-3 bg-gray-800 border-2 border-purple-500 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            >
              <option value="">Select a Topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuildContest}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Build Contest
          </motion.button>
        </motion.div>
      </main>

      <footer className="row-start-3 mt-16 text-gray-500 text-sm">
        <p>© 2025 Leetcode Virtual Contest Builder</p>
      </footer>
      
      {/* Modal/Notification */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-xl shadow-2xl z-50 text-center border-2 border-purple-500"
          >
            <h3 className="text-xl font-semibold text-white mb-2">Login Required</h3>
            <p className="text-gray-400">Redirecting to login page...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}