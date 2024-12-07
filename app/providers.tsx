"use client";

// app/layout.tsx
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "viem/chains";
const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <OnchainKitProvider
                            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                            projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
                            chain={base}
                        >
                            <RainbowKitProvider>{children}</RainbowKitProvider>
                        </OnchainKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </body>
        </html>
    );
}
