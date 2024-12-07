// hooks/useShagunContract.ts
import { useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { SHAGUN_ABI, SHAGUN_CONTRACT_ADDRESS } from "@/app/lib/shagunABI";
import { useState } from "react";

export function useShagunContract() {
    const [currentDistributionId, setCurrentDistributionId] = useState<
        string | null
    >(null);

    const {
        writeContractAsync,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract();

    // Set up read contract with dynamic args
    const { data: distributionData, refetch } = useReadContract({
        address: SHAGUN_CONTRACT_ADDRESS,
        abi: SHAGUN_ABI,
        functionName: "getDistributionInfo",
        args: currentDistributionId ? [currentDistributionId] : undefined,
        query: {
            enabled: Boolean(currentDistributionId),
        },
    });

    const createDistribution = async (
        distributionId: string,
        baseNames: string[],
        verifyBaseName: boolean,
        totalAmount: string
    ) => {
        if (!baseNames.length) {
            throw new Error("Must have at least one recipient");
        }

        try {
            console.log("Creating distribution with params:", {
                distributionId,
                baseNames,
                verifyBaseName,
                totalAmount,
            });

            const amountInWei = parseEther(totalAmount);

            const txParams = {
                address: SHAGUN_CONTRACT_ADDRESS,
                abi: SHAGUN_ABI,
                functionName: "createDistribution",
                args: [distributionId, baseNames, verifyBaseName],
                value: amountInWei,
            };

            console.log("Transaction parameters:", txParams);

            const hash = await writeContractAsync({
                address: SHAGUN_CONTRACT_ADDRESS,
                abi: SHAGUN_ABI,
                functionName: "createDistribution",
                args: [distributionId, baseNames, verifyBaseName],
                value: amountInWei,
            });
            console.log("Transaction hash:", hash);

            return {
                hash,
                distributionId,
            };
        } catch (error: any) {
            console.error("Distribution creation failed:", {
                error,
                message: error.message,
                code: error.code,
                details: error.details,
                distributionId,
                baseNames,
                verifyBaseName,
                totalAmount,
            });
            throw error;
        }
    };

    const verifyDistribution = async (distributionId: string) => {
        // Update the distribution ID to trigger a new read
        setCurrentDistributionId(distributionId);
        // Refetch the data
        const result = await refetch();

        if (!result.data) {
            throw new Error("Distribution not found");
        }

        return result.data;
    };

    return {
        createDistribution,
        verifyDistribution,
        isWritePending,
        writeError,
        distributionData,
    };
}
