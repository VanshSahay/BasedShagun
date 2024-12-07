"use client";

import React from "react";
import { motion } from "framer-motion";

const BackgroundAnimations = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Animated Rangolis */}
            <motion.div
                className="absolute top-10 left-10 w-40 h-40 border-4 border-yellow-400 rounded-full"
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-32 h-32 border-4 border-orange-400 rounded-full"
                animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Animated Diyas */}
            <motion.div
                className="absolute bottom-20 left-20 w-16 h-16 bg-orange-500 rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-yellow-300 rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
            <motion.div
                className="absolute top-1/4 right-1/4 w-12 h-12 bg-orange-500 rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-yellow-300 rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>

            {/* Animated Peacock Feathers */}
            <motion.div
                className="absolute top-1/3 right-10 w-20 h-40 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"
                animate={{
                    rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-700 rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
            <motion.div
                className="absolute bottom-1/4 left-1/5 w-16 h-32 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"
                animate={{
                    rotate: [0, -10, 0, 10, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-700 rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>

            {/* Animated Lotuses */}
            <motion.div
                className="absolute bottom-10 left-1/4 flex justify-center items-center"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute w-8 h-16 bg-pink-400 rounded-full origin-bottom"
                        style={{
                            rotate: `${index * 45}deg`,
                            transformOrigin: "bottom",
                        }}
                        animate={{
                            scaleY: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2,
                        }}
                    />
                ))}
            </motion.div>
            <motion.div
                className="absolute top-1/5 right-1/4 flex justify-center items-center"
                animate={{
                    rotate: -360,
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute w-6 h-12 bg-pink-300 rounded-full origin-bottom"
                        style={{
                            rotate: `${index * 45}deg`,
                            transformOrigin: "bottom",
                        }}
                        animate={{
                            scaleY: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.25,
                        }}
                    />
                ))}
            </motion.div>

            {/* Henna Patterns */}
            <motion.div
                className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-red-500 rounded-full"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute inset-2 border-2 border-red-500 rounded-full"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </motion.div>
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-red-400 rounded-full"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute inset-2 border-2 border-red-400 rounded-full"
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </motion.div>
        </div>
    );
};

export default BackgroundAnimations;
