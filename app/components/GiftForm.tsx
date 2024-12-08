"use client";
import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useAccount } from "wagmi";
import { useShagunContract } from "@/app/hooks/useShagunContract";
import { ArrowRight, Check, AlertTriangle, X, Plus } from "lucide-react";

import { FundButton } from "@coinbase/onchainkit/fund";
import { WalletDefault } from "@coinbase/onchainkit/wallet";

interface FormData {
    totalAmount: number;
}

const GiftForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        totalAmount: 0,
    });
    const [baseNames, setBaseNames] = useState<string[]>([""]);
    const [errors, setErrors] = useState<
        Partial<Record<keyof FormData, string>>
    >({});
    const router = useRouter();

    // Blockchain-related states
    const [isLoading, setIsLoading] = useState(false);
    const [blockchainError, setBlockchainError] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [links, setLinks] = useState<string[]>([]);

    // Blockchain hooks
    const { address, isConnected } = useAccount();
    const { createDistribution, verifyDistribution, isWritePending } =
        useShagunContract();

    // Handle base name changes for individual recipients
    const handleBaseNameChange = (index: number, value: string) => {
        const newBaseNames = [...baseNames];
        newBaseNames[index] = value;
        setBaseNames(newBaseNames);
    };

    // Add a new recipient
    const addRecipient = () => {
        if (baseNames.length < 50) {
            setBaseNames([...baseNames, `Recipient-${baseNames.length + 1}`]);
        }
    };

    // Remove a recipient
    const removeRecipient = () => {
        if (baseNames.length > 1) {
            setBaseNames(baseNames.slice(0, -1));
        }
    };

    const validateField = useCallback((value: string) => {
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
            return "Enter a valid ETH amount";
        }
        if (amount > 100) {
            return "Maximum 100 ETH allowed";
        }
        return "";
    }, []);

    const handleInputChange = useCallback(
        (value: string) => {
            const currentError = validateField(value);
            setErrors((prev) => ({
                totalAmount: currentError,
            }));

            setFormData((prevData) => ({
                ...prevData,
                totalAmount: currentError ? 0 : parseFloat(value),
            }));
        },
        [validateField]
    );

    const handleFormSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setBlockchainError("");
            setTransactionHash("");

            // Validate total amount
            const amountError = validateField(formData.totalAmount.toString());
            if (amountError) {
                setErrors({ totalAmount: amountError });
                return;
            }

            // Validate base names
            if (!baseNames.every((name) => name.trim())) {
                setBlockchainError("All recipient names must be filled");
                return;
            }

            // Blockchain submission logic
            if (!isConnected) {
                setBlockchainError("Please connect your wallet first");
                return;
            }

            try {
                setIsLoading(true);
                const id = nanoid();

                const { hash, distributionId } = await createDistribution(
                    id,
                    baseNames,
                    true,
                    formData.totalAmount.toString()
                );

                setTransactionHash(hash);

                await new Promise((resolve) => setTimeout(resolve, 5000));

                try {
                    await verifyDistribution(distributionId);
                    const newLinks = baseNames.map(
                        (_, index) =>
                            `${window.location.origin}/claim/${distributionId}/${index}`
                    );
                    setLinks(newLinks);
                } catch (verifyError) {
                    console.error(
                        "Failed to verify distribution:",
                        verifyError
                    );
                    setBlockchainError(
                        "Transaction submitted but distribution not found. Please check the transaction hash."
                    );
                }
            } catch (err: any) {
                console.error("Create distribution failed:", err);
                setBlockchainError(
                    err.message || "Failed to create distribution"
                );
            } finally {
                setIsLoading(false);
            }
        },
        [
            formData,
            baseNames,
            validateField,
            router,
            isConnected,
            createDistribution,
            verifyDistribution,
        ]
    );

    const isFormValid = useMemo(() => {
        return (
            formData.totalAmount > 0 &&
            baseNames.length > 0 &&
            baseNames.every((name) => name.trim() !== "")
        );
    }, [formData, baseNames]);

    const handleSwapRedirect = () => {
        router.push("/swap");
    };

    return (
        <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md"
            initial={{ opacity: 0, y: -20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="mb-4 flex gap-2">
                <WalletDefault />
                <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#111827] hover:text-[#111827] 111827 text-[#F6F7F9] px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    onClick={handleSwapRedirect}
                >
                    Swap
                </button>
                <FundButton />
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

            {blockchainError && (
                <div className="mb-4 p-4 bg-red-500/20 text-red-100 rounded">
                    {blockchainError}
                </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="How much ETH to distribute?"
                        className={`w-full border rounded-lg p-3 pr-10 focus:outline-none text-black 
                                ${
                                    errors.totalAmount
                                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                }`}
                        value={formData.totalAmount.toString()}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    {errors.totalAmount ? (
                        <AlertTriangle
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                            size={20}
                        />
                    ) : (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                </div>

                {errors.totalAmount && (
                    <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {errors.totalAmount}
                    </motion.p>
                )}

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white text-lg">Recipient Names</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={removeRecipient}
                                className="p-1 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-50"
                                disabled={baseNames.length <= 1}
                            >
                                <X size={16} className="text-white" />
                            </button>
                            <span className="text-white text-sm">
                                {baseNames.length}
                            </span>
                            <button
                                type="button"
                                onClick={addRecipient}
                                className="p-1 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-50"
                                disabled={baseNames.length >= 50}
                            >
                                <Plus size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                    {baseNames.map((name, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                placeholder={`Name for Recipient ${index + 1}`}
                                value={name}
                                onChange={(e) =>
                                    handleBaseNameChange(index, e.target.value)
                                }
                                className="w-full border rounded-lg p-2 focus:outline-none text-black"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading || isWritePending}
                        className={`
                                w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all 
                                group
                                ${
                                    isFormValid && !isLoading && !isWritePending
                                        ? "bg-blue-900 text-white hover:bg-blue-950 hover:shadow-md"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                    >
                        <span className="transition-transform group-hover:translate-x-1">
                            {isLoading || isWritePending
                                ? "Creating..."
                                : "Next"}
                        </span>
                        {!(isLoading || isWritePending) && (
                            <ArrowRight
                                size={20}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        )}
                    </button>
                </div>
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
                                    Recipient {index + 1}: {baseNames[index]}
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
    );
};

export default GiftForm;
