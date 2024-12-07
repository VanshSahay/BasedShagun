// hooks/useShagunContract.ts
import { useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { SHAGUN_ABI, SHAGUN_CONTRACT_ADDRESS } from "@/app/lib/shagunABI";
import { useState } from "react";

export function useShagunContract() {
    const [currentDistributionId, setCurrentDistributionId] = useState<
        string | null
    >(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const {
        writeContractAsync,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract();

    // Distribution info read contract
    const { data: distributionData, refetch: refetchDistribution } =
        useReadContract({
            address: SHAGUN_CONTRACT_ADDRESS,
            abi: SHAGUN_ABI,
            functionName: "getDistributionInfo",
            args: currentDistributionId ? [currentDistributionId] : undefined,
        });

    // Check if claimed read contract
    const { data: isClaimedData, refetch: refetchClaimed } = useReadContract({
        address: SHAGUN_CONTRACT_ADDRESS,
        abi: SHAGUN_ABI,
        functionName: "isShareClaimed",
        args: currentDistributionId
            ? [currentDistributionId, BigInt(currentIndex)]
            : undefined,
    });

    // Get base name read contract
    const { data: baseNameData, refetch: refetchBaseName } = useReadContract({
        address: SHAGUN_CONTRACT_ADDRESS,
        abi: SHAGUN_ABI,
        functionName: "getBaseName",
        args: currentDistributionId
            ? [currentDistributionId, BigInt(currentIndex)]
            : undefined,
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
            const amountInWei = parseEther(totalAmount);

            const hash = await writeContractAsync({
                address: SHAGUN_CONTRACT_ADDRESS,
                abi: SHAGUN_ABI,
                functionName: "createDistribution",
                args: [distributionId, baseNames, verifyBaseName],
                value: amountInWei,
            });

            return {
                hash,
                distributionId,
            };
        } catch (error: any) {
            console.error("Distribution creation failed:", error);
            throw error;
        }
    };

    const claimShare = async (
        distributionId: string,
        recipientIndex: number,
        baseName: string
    ) => {
        try {
            const hash = await writeContractAsync({
                address: SHAGUN_CONTRACT_ADDRESS,
                abi: SHAGUN_ABI,
                functionName: "claimShare",
                args: [distributionId, BigInt(recipientIndex), baseName],
            });

            return { hash };
        } catch (error: any) {
            console.error("Claim share failed:", error);
            throw error;
        }
    };

    const verifyDistribution = async (distributionId: string) => {
        setCurrentDistributionId(distributionId);
        const result = await refetchDistribution();

        if (!result.data) {
            throw new Error("Distribution not found");
        }

        return result.data;
    };

    const checkIfClaimed = async (distributionId: string, index: number) => {
        setCurrentDistributionId(distributionId);
        setCurrentIndex(index);
        const result = await refetchClaimed();
        return result.data;
    };

    const getBaseName = async (distributionId: string, index: number) => {
        setCurrentDistributionId(distributionId);
        setCurrentIndex(index);
        const result = await refetchBaseName();
        return result.data;
    };

    return {
        createDistribution,
        verifyDistribution,
        claimShare,
        checkIfClaimed,
        getBaseName,
        isWritePending,
        writeError,
        distributionData,
    };
}
