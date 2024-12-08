"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useShagunContract } from "@/app/hooks/useShagunContract";
import { verifyMessage, formatEther } from "viem";
import { motion } from "framer-motion";
import BackgroundAnimations from "../../../components/Background-animations";
import { ArrowRight, MailOpen } from "lucide-react";
import { NFTMintCardDefault } from "@coinbase/onchainkit/nft";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from "@coinbase/onchainkit/identity";

// Define the type for distribution info
interface DistributionInfo {
    creator: string;
    amountPerRecipient: bigint;
    verifyBaseName: boolean;
    recipientCount: number;
}

export default function ClaimPage() {
    const params = useParams();
    const { address, isConnected } = useAccount();
    const [baseName, setBaseName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
    const [expectedAddress, setExpectedAddress] = useState("");
    const [distributionInfo, setDistributionInfo] =
        useState<DistributionInfo | null>(null);
    const [transactionHash, setTransactionHash] = useState("");
    const [isSignatureVerified, setIsSignatureVerified] = useState(false);

    const distributionId = params.distributionId as string;
    const recipientIndex = parseInt(params.index as string);

    const {
        verifyDistribution,
        checkIfClaimed,
        claimShare,
        getBaseName,
        isWritePending,
    } = useShagunContract();

    const { signMessageAsync } = useSignMessage();

    // Updated fetchHtmlAndExtract function in your component
    const fetchHtmlAndExtract = async (baseName: string) => {
        try {
            const response = await fetch(
                `/api/resolve-base-name?id=${baseName}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Base name resolution failed");
            }

            return data.address;
        } catch (error) {
            console.error("Error fetching HTML:", error);
            throw error;
        }
    };

    useEffect(() => {
        const checkDistributionStatus = async () => {
            try {
                setIsLoading(true);
                const info = await verifyDistribution(distributionId);
                if (!info) {
                    throw new Error("Distribution not found");
                }

                setDistributionInfo({
                    creator: info[0] as string,
                    amountPerRecipient: info[1] as bigint,
                    verifyBaseName: info[2] as boolean,
                    recipientCount: Number(info[3]),
                });

                const claimed: any = await checkIfClaimed(
                    distributionId,
                    recipientIndex
                );
                setIsAlreadyClaimed(claimed);

                const name = await getBaseName(distributionId, recipientIndex);
                setBaseName(name || "");

                if (name) {
                    const resolvedAddress = await fetchHtmlAndExtract(name);
                    setExpectedAddress(resolvedAddress);
                }
            } catch (err) {
                console.error("Error checking distribution:", err);
                setError("Failed to load distribution information");
            } finally {
                setIsLoading(false);
            }
        };

        if (distributionId && !isNaN(recipientIndex)) {
            checkDistributionStatus();
        }
    }, [distributionId, recipientIndex]);

    const verifySignature = async () => {
        try {
            if (!isConnected || !address) {
                throw new Error("Please connect your wallet first");
            }

            if (address.toLowerCase() !== expectedAddress) {
                throw new Error(
                    "Connected wallet does not match the Base name"
                );
            }

            const message = `Verify ownership of wallet ${address} for Shagun distribution ${distributionId}`;
            const signature = await signMessageAsync({ message });

            const verified = await verifyMessage({
                message,
                signature,
                address: address,
            });

            if (!verified) {
                throw new Error("Signature verification failed");
            }

            setIsSignatureVerified(true);
            return true;
        } catch (error: any) {
            console.error("Signature verification failed:", error);
            setError(error.message || "Failed to verify signature");
            return false;
        }
    };

    const handleClaim = async () => {
        if (!isConnected) {
            setError("Please connect your wallet first");
            return;
        }

        if (isAlreadyClaimed) {
            setError("This share has already been claimed");
            return;
        }

        if (address?.toLowerCase() !== expectedAddress) {
            setError("Connected wallet does not match the Base name");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            if (!isSignatureVerified) {
                const signatureValid = await verifySignature();
                if (!signatureValid) {
                    throw new Error(
                        "Please verify your wallet ownership first"
                    );
                }
            }

            const result = await claimShare(
                distributionId,
                recipientIndex,
                baseName
            );
            setTransactionHash(result.hash);

            await new Promise((resolve) => setTimeout(resolve, 5000));

            const claimed = await checkIfClaimed(
                distributionId,
                recipientIndex
            );
            if (claimed) {
                setIsAlreadyClaimed(true);
            } else {
                setError(
                    "Transaction submitted but claim not verified. Please check the transaction hash."
                );
            }
        } catch (error: any) {
            console.error("Error claiming share:", error);
            setError(
                error.message || "Failed to claim your share. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isVerificationDisabled =
        !isConnected ||
        isLoading ||
        isSignatureVerified ||
        address?.toLowerCase() !== expectedAddress;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0051FF] to-[#3B82F6] flex flex-col items-center justify-center overflow-hidden relative">
            <BackgroundAnimations />

            <header className="absolute top-4 right-4 z-20">
                <Wallet>
                    <ConnectWallet>
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                        <Identity
                            className="px-4 pt-3 pb-2"
                            hasCopyAddressOnClick
                        >
                            <Avatar />
                            <Name />
                            <Address />
                            <EthBalance />
                        </Identity>
                        <WalletDropdownDisconnect />
                    </WalletDropdown>
                </Wallet>
            </header>

            <motion.div
                className="text-center bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/20 relative z-10 w-full max-w-md"
                initial={{ opacity: 0, y: -100, rotateX: 50 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl font-bold text-white mb-6"
                >
                    Claim Your Shagun
                </motion.h1>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-4 bg-white/20 rounded-lg text-white"
                    >
                        <p>Loading distribution details...</p>
                    </motion.div>
                )}

                {distributionInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-4 bg-white/20 rounded-lg text-white"
                    >
                        <p className="text-sm">
                            Amount to claim:{" "}
                            {formatEther(distributionInfo.amountPerRecipient)}{" "}
                            ETH
                        </p>
                        <p className="text-sm mt-2">
                            Required Base Name: {baseName}
                        </p>
                        <p className="text-sm mt-2">
                            Required Address: {expectedAddress}
                        </p>
                    </motion.div>
                )}

                {address && address.toLowerCase() !== expectedAddress && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-4 bg-red-400/20 rounded-lg text-white"
                    >
                        <p>Connected wallet does not match the Base name</p>
                    </motion.div>
                )}

                {transactionHash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-4 bg-green-400/20 rounded-lg text-white"
                    >
                        <p>Transaction submitted: </p>
                        <a
                            href={`https://base-sepolia.blockscout.com/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300 break-all"
                        >
                            {transactionHash}
                        </a>
                    </motion.div>
                )}

                {isAlreadyClaimed ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-yellow-400/20 rounded-lg text-white"
                    >
                        <p>This share has already been claimed.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {!isSignatureVerified ? (
                            <motion.button
                                onClick={verifySignature}
                                disabled={isVerificationDisabled}
                                className="w-full group overflow-hidden bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg shadow-md 
                                    flex items-center justify-center space-x-2
                                    transition duration-300 ease-in-out
                                    hover:bg-yellow-300 disabled:bg-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-yellow-500
                                    transform hover:scale-105 active:scale-95"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MailOpen className="w-5 h-5 mr-2" />
                                <span className="font-semibold tracking-wide">
                                    {!isConnected
                                        ? "Connect Wallet to Verify"
                                        : address?.toLowerCase() !==
                                          expectedAddress
                                        ? "Connect Wallet Matching Base Name"
                                        : "Verify Wallet Ownership"}
                                </span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-green-400/20 rounded-lg text-white"
                            >
                                <p>Wallet ownership verified!</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-300 text-sm"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            onClick={handleClaim}
                            disabled={
                                isLoading ||
                                isWritePending ||
                                !isConnected ||
                                !isSignatureVerified ||
                                address?.toLowerCase() !== expectedAddress
                            }
                            className="w-full group overflow-hidden bg-green-400 text-blue-900 py-3 px-6 rounded-lg shadow-md 
                                flex items-center justify-center space-x-2
                                transition duration-300 ease-in-out
                                hover:bg-green-300 disabled:bg-gray-400
                                focus:outline-none focus:ring-2 focus:ring-green-500
                                transform hover:scale-105 active:scale-95"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="font-semibold tracking-wide">
                                {isLoading || isWritePending
                                    ? "Claiming..."
                                    : "Claim Share"}
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
