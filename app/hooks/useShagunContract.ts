// hooks/useShagunContract.ts
import {
    useWriteContract,
    useReadContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

const SHAGUN_CONTRACT_ADDRESS = "0x0FdEf0cFD9E787315746498ec4AC8822F6449ef9";

// Contract ABI - Add this to a separate file in production
const SHAGUN_ABI = [
    {
        inputs: [
            { name: "distributionId", type: "string" },
            { name: "baseNames", type: "string[]" },
            { name: "verifyBaseName", type: "bool" },
        ],
        name: "createDistribution",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { name: "distributionId", type: "string" },
            { name: "recipientIndex", type: "uint256" },
            { name: "baseName", type: "string" },
        ],
        name: "claimShare",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "distributionId", type: "string" }],
        name: "getDistributionInfo",
        outputs: [
            { name: "creator", type: "address" },
            { name: "amountPerRecipient", type: "uint256" },
            { name: "verifyBaseName", type: "bool" },
            { name: "recipientCount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "distributionId", type: "string" },
            { name: "index", type: "uint256" },
        ],
        name: "isShareClaimed",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

export function useShagunContract() {
    const { writeContract, isPending: isWritePending } = useWriteContract();

    // Create a new distribution
    const createDistribution = async (
        distributionId: string,
        baseNames: string[],
        verifyBaseName: boolean,
        totalAmount: string
    ) => {
        if (!baseNames.length)
            throw new Error("Must have at least one recipient");

        const tx = await writeContract({
            address: SHAGUN_CONTRACT_ADDRESS,
            abi: SHAGUN_ABI,
            functionName: "createDistribution",
            args: [distributionId, baseNames, verifyBaseName],
            value: parseEther(totalAmount),
        });

        return tx;
    };

    // Claim a share
    const claimShare = async (
        distributionId: string,
        recipientIndex: number,
        baseName: string
    ) => {
        const tx = await writeContract({
            address: SHAGUN_CONTRACT_ADDRESS,
            abi: SHAGUN_ABI,
            functionName: "claimShare",
            args: [distributionId, BigInt(recipientIndex), baseName],
        });

        return tx;
    };

    // Get distribution info
    const useDistributionInfo = (distributionId: string) => {
        return useReadContract({
            address: SHAGUN_CONTRACT_ADDRESS,
            abi: SHAGUN_ABI,
            functionName: "getDistributionInfo",
            args: [distributionId],
        });
    };

    // Check if share is claimed
    const useIsShareClaimed = (distributionId: string, index: number) => {
        return useReadContract({
            address: SHAGUN_CONTRACT_ADDRESS,
            abi: SHAGUN_ABI,
            functionName: "isShareClaimed",
            args: [distributionId, BigInt(index)],
        });
    };

    return {
        createDistribution,
        claimShare,
        useDistributionInfo,
        useIsShareClaimed,
        isWritePending,
    };
}
