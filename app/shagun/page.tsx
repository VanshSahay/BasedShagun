"use client";
import React from "react";
import GiftForm from "../components/GiftForm";
import BackgroundAnimations from "../components/Background-animations";

const ShagunPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0051FF] to-[#3B82F6] relative overflow-hidden">
            <BackgroundAnimations />
            <div className="relative z-10 w-full max-w-md">
                <GiftForm />
            </div>
        </div>
    );
};

export default ShagunPage;
