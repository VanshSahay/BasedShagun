"use client";
import React from "react";
import BackgroundAnimations from "../components/Background-animations";
import Swap from "../components/Swap";

const SwapPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0051FF] to-[#3B82F6] relative overflow-hidden">
            <BackgroundAnimations />
            <div className="relative z-10 w-full max-w-md">
                <Swap />
            </div>
        </div>
    );
};

export default SwapPage;
