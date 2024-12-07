// lib/abi/shagunABI.ts
export const SHAGUN_ABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "recipientIndex",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "baseName",
                type: "string",
            },
        ],
        name: "claimShare",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                internalType: "string[]",
                name: "baseNames",
                type: "string[]",
            },
            {
                internalType: "bool",
                name: "verifyBaseName",
                type: "bool",
            },
        ],
        name: "createDistribution",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                indexed: false,
                internalType: "address",
                name: "creator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amountPerRecipient",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "recipientCount",
                type: "uint256",
            },
        ],
        name: "DistributionCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "recipientIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "ShareClaimed",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        name: "distributions",
        outputs: [
            {
                internalType: "address",
                name: "creator",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountPerRecipient",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "verifyBaseName",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "recipientCount",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getBaseName",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
        ],
        name: "getDistributionInfo",
        outputs: [
            {
                internalType: "address",
                name: "creator",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountPerRecipient",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "verifyBaseName",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "recipientCount",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "distributionId",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "isShareClaimed",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const SHAGUN_CONTRACT_ADDRESS =
    "0xf7B56CF7bb1ca212696D2708d4Cf676EF0A68262";
