"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundAnimations from "../../../components/Background-animations";
import { ArrowRight, MailOpen } from "lucide-react";

const ShagunClaimPage = () => {
    const [baseName, setBaseName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleClaim = () => {
        // Basic validation
        if (!baseName.trim()) {
            setError("Please enter your Base username");
            return;
        }

        // Additional validation can be added here
        // For example, checking username format, length, etc.

        // If validation passes, navigate to next step or process claim
        router.push(`/shagun/claim/${baseName}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0051FF] to-[#3B82F6] flex flex-col items-center justify-center overflow-hidden relative">
            <BackgroundAnimations />

            <motion.div
                className="text-center bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/20 relative z-10 w-full max-w-md"
                initial={{
                    opacity: 0,
                    y: -100,
                    rotateX: 50,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                }}
                transition={{
                    duration: 1,
                    ease: "easeOut",
                }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl font-bold text-white mb-6"
                >
                    Claim Your Shagun
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-6"
                >
                    <input
                        type="text"
                        value={baseName}
                        onChange={(e) => {
                            setBaseName(e.target.value);
                            setError(""); // Clear error when user starts typing
                        }}
                        placeholder="Enter your Base username"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white 
                            placeholder-white/50 border border-white/30 
                            focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-300 mt-2 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                </motion.div>

                <motion.button
                    onClick={handleClaim}
                    className="w-full group overflow-hidden bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg shadow-md 
                        flex items-center justify-center space-x-2
                        transition duration-300 ease-in-out
                        hover:bg-yellow-300 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500
                        transform hover:scale-105 active:scale-95"
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                    }}
                    whileTap={{
                        scale: 0.95,
                        transition: { duration: 0.2 },
                    }}
                >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

                    <MailOpen className="w-5 h-5 mr-2 text-blue-900 group-hover:rotate-12 transition-transform duration-300" />

                    <span className="font-semibold tracking-wide">
                        Claim Shagun
                    </span>

                    <ArrowRight className="w-5 h-5 ml-2 text-blue-900 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-sm text-white/70 mt-6"
                >
                    Enter your Base username to claim your Shagun
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ShagunClaimPage;
