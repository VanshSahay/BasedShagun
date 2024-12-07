// lib/abi/shagunABI.ts
export const SHAGUN_ABI = [
    {
        inputs: [
            { internalType: "string", name: "distributionId", type: "string" },
            { internalType: "string[]", name: "baseNames", type: "string[]" },
            { internalType: "bool", name: "verifyBaseName", type: "bool" },
        ],
        name: "createDistribution",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "distributionId", type: "string" },
            {
                internalType: "uint256",
                name: "recipientIndex",
                type: "uint256",
            },
            { internalType: "string", name: "baseName", type: "string" },
        ],
        name: "claimShare",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "distributionId", type: "string" },
            { internalType: "uint256", name: "index", type: "uint256" },
        ],
        name: "getBaseName",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "distributionId", type: "string" },
        ],
        name: "getDistributionInfo",
        outputs: [
            { internalType: "address", name: "creator", type: "address" },
            {
                internalType: "uint256",
                name: "amountPerRecipient",
                type: "uint256",
            },
            { internalType: "bool", name: "verifyBaseName", type: "bool" },
            {
                internalType: "uint256",
                name: "recipientCount",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const SHAGUN_CONTRACT_ADDRESS =
    "0xf7B56CF7bb1ca212696D2708d4Cf676EF0A68262";
