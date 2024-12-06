// app/page.tsx
"use client";

import { useState } from "react";
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
    Badge,
    EthBalance,
} from "@coinbase/onchainkit/identity";

interface Recipient {
    baseName: string;
    claimed: boolean;
}

function IdentityDemo() {
    return (
        <Identity
            address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        >
            <Avatar />
            <Name>
                <Badge />
            </Name>
            <Address />
        </Identity>
    );
}

export default function App() {
    const [amount, setAmount] = useState<string>("");
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [numRecipients, setNumRecipients] = useState<number>(2);
    const [verifyBaseName, setVerifyBaseName] = useState<boolean>(false);
    const [distributionLinks, setDistributionLinks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAddRecipient = () => {
        if (recipients.length < numRecipients) {
            setRecipients([...recipients, { baseName: "", claimed: false }]);
        }
    };

    const handleUpdateRecipient = (index: number, baseName: string) => {
        const newRecipients = [...recipients];
        newRecipients[index] = { ...newRecipients[index], baseName };
        setRecipients(newRecipients);
    };

    const handleCreateDistribution = async () => {
        setIsLoading(true);
        try {
            // Implementation will go here once we add contract integration
            const baseUrl = window.location.origin;
            const distributionId = `dist-${Date.now()}`;
            const links = recipients.map(
                (_, index) => `${baseUrl}/claim/${distributionId}/${index}`
            );
            setDistributionLinks(links);
        } catch (error) {
            console.error("Error creating distribution:", error);
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

            <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-6">
                        Create Shagun Distribution
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Amount (ETH)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter ETH amount"
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Number of Recipients
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={numRecipients}
                                onChange={(e) =>
                                    setNumRecipients(parseInt(e.target.value))
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={verifyBaseName}
                                onChange={(e) =>
                                    setVerifyBaseName(e.target.checked)
                                }
                                className="mr-2"
                            />
                            <label>Verify Base Names</label>
                        </div>

                        <div className="space-y-4">
                            {recipients.map((recipient, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium mb-2">
                                        Recipient {index + 1} Base Name
                                    </label>
                                    <input
                                        value={recipient.baseName}
                                        onChange={(e) =>
                                            handleUpdateRecipient(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter Base name"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            ))}
                        </div>

                        {recipients.length < numRecipients && (
                            <button
                                onClick={handleAddRecipient}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add Recipient
                            </button>
                        )}

                        <button
                            onClick={handleCreateDistribution}
                            disabled={
                                isLoading || recipients.length === 0 || !amount
                            }
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isLoading
                                ? "Creating Distribution..."
                                : "Create Distribution"}
                        </button>

                        {distributionLinks.length > 0 && (
                            <div className="mt-6 space-y-2">
                                <h3 className="text-lg font-semibold">
                                    Claim Links:
                                </h3>
                                {distributionLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                                    >
                                        <p className="break-all">{link}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
