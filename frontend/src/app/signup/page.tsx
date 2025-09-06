"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.8 } },
};

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [uuid, setUuid] = useState("");
  const [timer, setTimer] = useState(60);
  const [showVerificationFailed, setShowVerificationFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    let countdown: any;
    if (isVerifying) {
      setTimer(60);
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleVerificationTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isVerifying]);

  const handleVerificationTimeout = () => {
    setIsVerifying(false);
    setShowVerificationFailed(true);
    setTimeout(() => {
      setShowVerificationFailed(false);
    }, 2000);
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const leetcodeRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}`
      );

      if (!leetcodeRes.ok) {
        const errorData = await leetcodeRes.json();
        const errorMessage =
          errorData.message ||
          "Username not found on LeetCode. Please use your LeetCode username.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const newUuid = crypto.randomUUID();
      setUuid(newUuid);
      setIsVerifying(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (timer > 0) {
      const leetcodeRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}`
      );
      console.log(leetcodeRes)
      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      handleVerificationTimeout();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 1500);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 font-inter">
      <AnimatePresence mode="wait">
        {isVerifying ? (
          <motion.div
            key="verify"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full p-8 bg-gray-900 backdrop-filter backdrop-blur-lg bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Verify your LeetCode profile
            </h2>
            <p className="mb-4 text-gray-300">
              Please copy the UUID below and add it to your LeetCode profile's
              "About Me" section to verify your account.
            </p>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 mb-6">
              <span className="truncate flex-1 text-sm font-mono text-gray-200">
                {uuid}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="ml-4 px-3 py-1 bg-purple-600 rounded-md text-sm font-semibold text-white"
              >
                {copyStatus}
              </motion.button>
            </div>
            <div className="text-gray-400 mb-6 font-semibold">
              Time remaining: {timer} seconds
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerify}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
            >
              Verify
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full p-8 bg-gray-900 backdrop-filter backdrop-blur-lg bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700"
          >
            <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Signup
            </h2>
            <form onSubmit={handleSignup} className="space-y-6">
              <input
                type="text"
                placeholder="Username (same as LeetCode)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                disabled={loading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </motion.button>
            </form>

            {error && (
              <p className="mt-4 text-red-400 text-center font-medium">
                {error}
              </p>
            )}

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-purple-400 hover:underline">
                Log in here.
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-teal-500 text-white rounded-lg shadow-lg z-50 bg-opacity-95"
          >
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-3xl font-bold">Success!</h3>
            <p className="mt-2 text-lg">Redirecting to login...</p>
          </motion.div>
        )}

        {showVerificationFailed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-red-500 text-white rounded-lg shadow-lg z-50 bg-opacity-95"
          >
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-3xl font-bold">Signup Failed!</h3>
            <p className="mt-2 text-lg">Please try again.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}