"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundAnimations from "./components/Background-animations";
import { Mail } from "lucide-react";

const indianLanguages = [
    { name: "English", text: "Shagun", font: "" },
    { name: "Hindi", text: "शगुन", font: "font-devanagari" },
    { name: "Tamil", text: "சகுன்", font: "font-tamil" },
    { name: "Telugu", text: "శఖున్", font: "font-telugu" },
    { name: "Bengali", text: "শগুন", font: "font-bengali" },
    { name: "Malayalam", text: "ശഗുൻ", font: "font-malayalam" },
];

const BasedShagunLandingPage = () => {
    const [currentLang, setCurrentLang] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLang((prev) => (prev + 1) % indianLanguages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleGiftClick = () => {
        router.push("/shagun");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0051FF] to-[#3B82F6] flex flex-col items-center justify-center overflow-hidden relative">
            <BackgroundAnimations />
            <motion.div
                className="text-center bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/20 relative z-10"
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
                <div className="flex justify-center items-center mb-4">
                    <motion.div
                        className="text-6xl font-bold text-white mr-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                    >
                        Based
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentLang}
                            className={`text-6xl font-bold ${indianLanguages[currentLang].font} text-white inline-block`}
                            initial={{
                                opacity: 0,
                                y: 50,
                                scale: 0.9,
                                width: 0,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                width: "auto",
                            }}
                            exit={{
                                opacity: 0,
                                y: -50,
                                scale: 0.9,
                                width: 0,
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                        >
                            {indianLanguages[currentLang].text}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.div
                    className="text-lg text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                >
                    Bringing shaguns onchain in the <br />
                    most <b>BASED</b> way.
                </motion.div>

                <motion.button
                    onClick={handleGiftClick}
                    className="mt-8 relative inline-flex items-center justify-center bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg shadow-md 
        space-x-2
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

                    <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-blue-900 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-semibold tracking-wide">
                            Gift Shagun
                        </span>
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default BasedShagunLandingPage;
