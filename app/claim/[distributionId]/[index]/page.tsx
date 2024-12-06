// app/claim/[distributionId]/[index]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownLink,
    WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from "@coinbase/onchainkit/identity";

export default function ClaimPage() {
    const params = useParams();
    const [baseName, setBaseName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClaim = async () => {
        if (!baseName) return;

        try {
            setIsLoading(true);
            setError("");

            // Contract interaction will go here
        } catch (error) {
            console.error("Error claiming share:", error);
            setError("Failed to claim your share. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
            <header className="pt-4 pr-4">
                <div className="flex justify-end">
                    <div className="wallet-container">
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
                                <WalletDropdownLink
                                    icon="wallet"
                                    href="https://keys.coinbase.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Wallet
                                </WalletDropdownLink>
                                <WalletDropdownDisconnect />
                            </WalletDropdown>
                        </Wallet>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-6">
                        Claim Your Shagun Share
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Your Base Name
                            </label>
                            <input
                                value={baseName}
                                onChange={(e) => setBaseName(e.target.value)}
                                placeholder="Enter your Base name"
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            onClick={handleClaim}
                            disabled={isLoading || !baseName}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isLoading ? "Claiming..." : "Claim Share"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
