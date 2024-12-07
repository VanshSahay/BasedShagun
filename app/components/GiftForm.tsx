"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const GiftForm = () => {
    const router = useRouter();

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here
        router.push("/confirmation"); // Navigate to confirmation page or desired route
    };

    return (
        <div className="bg-gradient-to-br from-[#0051FF] to-[#3B82F6] rounded-3xl flex items-center justify-center relative">
            <motion.div
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10 max-w-lg w-full"
                initial={{
                    opacity: 0,
                    y: -20,
                    rotateX: 5,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
            >
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Create Your Shagun
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-200 font-medium mb-2">
                            Total Amount (ETH)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Enter total ETH amount"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-200 font-medium mb-2">
                            Number of Recipients
                        </label>
                        <input
                            type="number"
                            placeholder="Enter number of recipients"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-200 font-medium mb-2">
                            Recipient Base Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter recipient base name"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Create Shagun
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default GiftForm;
