"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useAccount } from "wagmi";
import { useShagunContract } from "@/app/hooks/useShagunContract";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import BackgroundAnimations from "@/app/components/Background-animations";

const indianLanguages = [
    { name: "English", text: "Shagun", font: "" },
    { name: "Hindi", text: "शगुन", font: "font-devanagari" },
    { name: "Tamil", text: "சகுன்", font: "font-tamil" },
    { name: "Telugu", text: "శఖున్", font: "font-telugu" },
    { name: "Bengali", text: "শগুন", font: "font-bengali" },
    { name: "Malayalam", text: "ശഗുൻ", font: "font-malayalam" },
];

export default function CreateDistribution() {
    const [amount, setAmount] = useState("");
    const [recipientCount, setRecipientCount] = useState(1);
    const [baseNames, setBaseNames] = useState([""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [links, setLinks] = useState<string[]>([]);
    const [transactionHash, setTransactionHash] = useState("");
    const [currentLang, setCurrentLang] = useState(0);

    const { address, isConnected } = useAccount();
    const { createDistribution, verifyDistribution, isWritePending } =
        useShagunContract();

    const handleBaseNameChange = (index: number, value: string) => {
        const newBaseNames = [...baseNames];
        newBaseNames[index] = value;
        setBaseNames(newBaseNames);
    };

    const updateRecipientCount = (count: number) => {
        setRecipientCount(count);
        const newBaseNames = Array(count)
            .fill("")
            .map((_, i) => baseNames[i] || "");
        setBaseNames(newBaseNames);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setTransactionHash("");

        if (!isConnected) {
            setError("Please connect your wallet first");
            return;
        }

        try {
            setIsLoading(true);
            const id = nanoid();

            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Invalid amount");
            }

            if (!baseNames.every((name) => name.trim())) {
                throw new Error("All base names must be filled");
            }

            const { hash, distributionId } = await createDistribution(
                id,
                baseNames,
                true, // Always verify base names
                amount
            );

            setTransactionHash(hash);

            await new Promise((resolve) => setTimeout(resolve, 5000));

            try {
                const distributionInfo = await verifyDistribution(
                    distributionId
                );
                const newLinks = baseNames.map(
                    (_, index) =>
                        `${window.location.origin}/claim/${distributionId}/${index}`
                );
                setLinks(newLinks);
            } catch (verifyError) {
                console.error("Failed to verify distribution:", verifyError);
                setError(
                    "Transaction submitted but distribution not found. Please check the transaction hash."
                );
            }
        } catch (err: any) {
            console.error("Create distribution failed:", err);
            setError(err.message || "Failed to create distribution");
        } finally {
            setIsLoading(false);
        }
    };

    // Language rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLang((prev) => (prev + 1) % indianLanguages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0051FF] to-[#3B82F6] flex flex-col items-center justify-center overflow-hidden relative">
            <BackgroundAnimations />
            <motion.div
                className="text-center bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/20 relative z-10 max-w-2xl w-full"
                initial={{ opacity: 0, y: -100, rotateX: 50 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
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
                            exit={{ opacity: 0, y: -50, scale: 0.9, width: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            {indianLanguages[currentLang].text}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mb-6">
                    <ConnectButton />
                </div>

                {transactionHash && (
                    <div className="mb-4 p-4 bg-white/20 rounded">
                        <p className="text-white">Transaction submitted: </p>
                        <a
                            href={`https://base-sepolia.blockscout.com/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-200 hover:text-blue-100 break-all"
                        >
                            {transactionHash}
                        </a>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 text-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Total Amount (ETH)
                        </label>
                        <input
                            type="number"
                            step="0.000000000000000001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-white/10 border-white/20 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Number of Recipients
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={recipientCount}
                            onChange={(e) =>
                                updateRecipientCount(Number(e.target.value))
                            }
                            className="w-full px-3 py-2 border rounded-md bg-white/10 border-white/20 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-white">
                            Recipient Base Names
                        </label>
                        {baseNames.map((name, index) => (
                            <input
                                key={index}
                                value={name}
                                onChange={(e) =>
                                    handleBaseNameChange(index, e.target.value)
                                }
                                placeholder={`Recipient ${index + 1} Base name`}
                                className="w-full px-3 py-2 border rounded-md bg-white/10 border-white/20 text-white"
                                required
                            />
                        ))}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || isWritePending}
                        className="w-full relative inline-flex items-center justify-center bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg shadow-md 
                            transition duration-300 ease-in-out
                            hover:bg-yellow-300 
                            focus:outline-none focus:ring-2 focus:ring-yellow-500
                            disabled:bg-gray-400 disabled:cursor-not-allowed
                            transform hover:scale-105 active:scale-95"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-blue-900" />
                            <span className="font-semibold tracking-wide">
                                {isLoading || isWritePending
                                    ? "Creating..."
                                    : "Create Distribution"}
                            </span>
                        </div>
                    </motion.button>
                </form>

                {links.length > 0 && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-xl font-bold mb-4 text-white">
                            Claim Links
                        </h2>
                        <div className="space-y-2">
                            {links.map((link, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-white/10 rounded"
                                >
                                    <p className="font-medium text-white">
                                        Recipient {index + 1}
                                    </p>
                                    <p className="text-sm break-all text-blue-200">
                                        {link}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
