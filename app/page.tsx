// app/create/page.tsx
"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useWaitForTransactionReceipt } from "wagmi";
import { useShagunContract } from "@/app/hooks/useShagunContract";

export default function CreateDistribution() {
    const [amount, setAmount] = useState("");
    const [recipientCount, setRecipientCount] = useState(1);
    const [baseNames, setBaseNames] = useState([""]);
    const [verifyBaseName, setVerifyBaseName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [distributionId, setDistributionId] = useState("");
    const [links, setLinks] = useState<string[]>([]);

    const { createDistribution, isWritePending } = useShagunContract();

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
        setIsLoading(true);

        try {
            const id = nanoid();
            const tx = await createDistribution(
                id,
                baseNames,
                verifyBaseName,
                amount
            );

            setDistributionId(id);

            // Generate claim links
            const newLinks = baseNames.map(
                (_, index) => `${window.location.origin}/claim/${id}/${index}`
            );
            setLinks(newLinks);
        } catch (err) {
            console.error("Error creating distribution:", err);
            setError("Failed to create distribution. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Create Shagun Distribution
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Total Amount (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.000000000000000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Number of Recipients
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={recipientCount}
                        onChange={(e) =>
                            updateRecipientCount(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Verify Base Names
                    </label>
                    <input
                        type="checkbox"
                        checked={verifyBaseName}
                        onChange={(e) => setVerifyBaseName(e.target.checked)}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-600">
                        Recipients must verify their Base name to claim
                    </span>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">
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
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    ))}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading || isWritePending}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                    {isLoading || isWritePending
                        ? "Creating..."
                        : "Create Distribution"}
                </button>
            </form>

            {links.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Claim Links</h2>
                    <div className="space-y-2">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="p-3 bg-gray-100 rounded"
                            >
                                <p className="font-medium">
                                    Recipient {index + 1}
                                </p>
                                <p className="text-sm break-all">{link}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
