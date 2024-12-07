"use client";
// utility file
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useShagunContract } from "@/app/hooks/useShagunContract";
import { verifyMessage, formatEther } from "viem";

export default function ClaimPage() {
    const params = useParams();
    const { address, isConnected } = useAccount();
    const [baseName, setBaseName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
    const [expectedAddress, setExpectedAddress] = useState("");
    const [distributionInfo, setDistributionInfo] = useState<{
        creator: string;
        amountPerRecipient: bigint;
        verifyBaseName: boolean;
        recipientCount: number;
    } | null>(null);
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

    const fetchHtmlAndExtract = async (baseName: string) => {
        try {
            const response = await fetch(
                `https://cors-anywhere.herokuapp.com/https://basescan.org/name-lookup-search?id=${baseName}`,
                {
                    method: "GET",
                    headers: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "max-age=0",
                        cookie: "ASP.NET_SessionId=feoefocra04fbqnjdvszh20c; basescan_switch_token_amount_value=value; cf_clearance=VKIbeJ9t7Njel37PiFqjSHO.flMeQiEVfxALUPb1A6Q-1731032345-1.2.1.1-.u58OI4dwloKSQeP1Zz6RdvVrXlfZMmGNEDqC36t8b0BJxfb.aPuNMf2atHFVhl5MBHFhtpzqer.CLnnowpDUUF.erUf4WhLDQvFzj8OllD4Vv_6cdOniTSPXPOP0SMC9mAK5Kfc64NTW1s6TgRfnKF84qik.Tf_zDpQcsLeU97ZegBNV7eguA7sV_EVL81dl7SGF_e1sAq.vtcW_lpFCbZwRyFVzt2SNSK54O6gIy4FBXHtHFZzO9JJRUsgh9UpAVAGjKINqanunLQBJDMwQ6Qp7kB.ow8tUYrxZFr0J_LgA12DOTDIoVgn5SKIGB1hzGokYTemN1RL5DZ1z.1dkIAFjZeJKJNmMh5zWuLnb3Eq24YZLnNae9Q0aUXL5IxJnhV98nFUEZcRF8_slUzd5kPhBH1No67TWLLdveqslCE69OMDHZX9jOEJwxbTuRYb; basescan_pwd=4792:Qdxb:JnSaGTfjtdaESCnHwKYQyez3eEW52tE3kb9Ma4a1cP51JnKDpJfXsmCFO6GMM0+u; basescan_userid=pranav; basescan_autologin=True; __cflb=02DiuJ1fCRi484mKRwML12UraygpucsyTWc9pZJeZ3Txx; basescan_offset_datetime=+5.5",
                        dnt: "1",
                        priority: "u=0, i",
                        referer: "https://basescan.org/",
                        "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
                        "sec-ch-ua-arch": '"arm"',
                        "sec-ch-ua-bitness": '"64"',
                        "sec-ch-ua-full-version": '"131.0.6778.86"',
                        "sec-ch-ua-full-version-list":
                            '"Chromium";v="131.0.6778.86", "Not_A Brand";v="24.0.0.0"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-model": '""',
                        "sec-ch-ua-platform": '"macOS"',
                        "sec-ch-ua-platform-version": '"15.1.0"',
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "user-agent":
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    },
                }
            );

            const text = await response.text();
            const regex = /<span id="spanBSCAddress">([\s\S]*?)<\/span>/;
            const match = text.match(regex);

            if (match && match[1]) {
                return match[1].toLowerCase();
            }
            throw new Error("Base name resolution failed");
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

                // Resolve Base name to address
                if (name) {
                    const resolvedAddress = await fetchHtmlAndExtract(name);
                    setExpectedAddress(resolvedAddress);
                }
            } catch (err: any) {
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

            // Check if connected wallet matches resolved address
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

            // Wait for transaction confirmation
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
        <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
            <header className="pt-4 pr-4">
                <div className="flex justify-end">
                    <ConnectButton />
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-6">
                        Claim Your Shagun Share
                    </h1>

                    {isLoading && (
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                            <p>Loading distribution details...</p>
                        </div>
                    )}

                    {distributionInfo && (
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                            <p className="text-sm">
                                Amount to claim:{" "}
                                {formatEther(
                                    distributionInfo.amountPerRecipient
                                )}{" "}
                                ETH
                            </p>
                            <p className="text-sm mt-2">
                                Required Base Name: {baseName}
                            </p>
                            <p className="text-sm mt-2">
                                Required Address: {expectedAddress}
                            </p>
                        </div>
                    )}

                    {address && address.toLowerCase() !== expectedAddress && (
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 rounded">
                            <p>Connected wallet does not match the Base name</p>
                        </div>
                    )}

                    {transactionHash && (
                        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 rounded">
                            <p>Transaction submitted: </p>
                            <a
                                href={`https://base-sepolia.blockscout.com/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 break-all"
                            >
                                {transactionHash}
                            </a>
                        </div>
                    )}

                    {isAlreadyClaimed ? (
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
                            <p>This share has already been claimed.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {!isSignatureVerified ? (
                                <button
                                    onClick={verifySignature}
                                    disabled={isVerificationDisabled}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    {!isConnected
                                        ? "Connect Wallet to Verify"
                                        : address?.toLowerCase() !==
                                          expectedAddress
                                        ? "Connect Wallet Matching Base Name"
                                        : "Verify Wallet Ownership"}
                                </button>
                            ) : (
                                <div className="p-4 bg-green-100 dark:bg-green-900 rounded">
                                    <p>Wallet ownership verified!</p>
                                </div>
                            )}

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            <button
                                onClick={handleClaim}
                                disabled={
                                    isLoading ||
                                    isWritePending ||
                                    !isConnected ||
                                    !isSignatureVerified ||
                                    address?.toLowerCase() !== expectedAddress
                                }
                                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {isLoading || isWritePending
                                    ? "Claiming..."
                                    : "Claim Share"}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
