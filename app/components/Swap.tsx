"use client";
import { SwapDefault } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useAccount } from "wagmi";

export default function Swap() {
    const { address } = useAccount();
    const ETHToken: Token = {
        address: "",
        chainId: 8453,
        decimals: 18,
        name: "Ethereum",
        symbol: "ETH",
        image: "",
    };

    const USDCToken: Token = {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        chainId: 8453,
        decimals: 6,
        name: "USDC",
        symbol: "USDC",
        image: "",
    };

    const swappableTokens: Token[] = [ETHToken, USDCToken];

    return <SwapDefault from={swappableTokens} to={swappableTokens} />;
}
