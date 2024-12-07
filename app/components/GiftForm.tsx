"use client";
import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Check,
    AlertTriangle,
    Upload,
    Link,
    X,
} from "lucide-react";

interface FormData {
    totalAmount: number;
    recipientCount: number;
    recipientBaseName: string;
}

const GiftForm: React.FC = () => {
    const [currentField, setCurrentField] =
        useState<keyof FormData>("totalAmount");
    const [formData, setFormData] = useState<FormData>({
        totalAmount: 0,
        recipientCount: 0,
        recipientBaseName: "",
    });
    const [errors, setErrors] = useState<
        Partial<Record<keyof FormData, string>>
    >({});
    const [imageUrl, setImageUrl] = useState(
        "https://communitycoach.me/wp-content/uploads/2022/06/noun.png"
    );
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (newImageUrl.trim()) {
            setImageUrl(newImageUrl);
            setIsUrlInputOpen(false);
        }
    };

    const validateField = useCallback(
        (field: keyof FormData, value: string) => {
            switch (field) {
                case "totalAmount":
                    const amount = parseFloat(value);
                    if (isNaN(amount) || amount <= 0) {
                        return "Enter a valid ETH amount";
                    }
                    if (amount > 100) {
                        return "Maximum 100 ETH allowed";
                    }
                    return "";
                case "recipientCount":
                    const count = parseInt(value);
                    if (isNaN(count) || count <= 0) {
                        return "Enter a valid recipient count";
                    }
                    if (count > 50) {
                        return "Maximum 50 recipients";
                    }
                    return "";
                case "recipientBaseName":
                    if (!value.trim()) {
                        return "Recipient name is required";
                    }
                    if (value.length > 50) {
                        return "Name too long (max 50 characters)";
                    }
                    return "";
            }
        },
        []
    );

    const handleInputChange = useCallback(
        (value: string) => {
            const currentError = validateField(currentField, value);
            setErrors((prev) => ({
                ...prev,
                [currentField]: currentError,
            }));

            setFormData((prevData) => {
                switch (currentField) {
                    case "totalAmount":
                        return {
                            ...prevData,
                            totalAmount: currentError ? 0 : parseFloat(value),
                        };
                    case "recipientCount":
                        return {
                            ...prevData,
                            recipientCount: currentError ? 0 : parseInt(value),
                        };
                    case "recipientBaseName":
                        return {
                            ...prevData,
                            recipientBaseName: value,
                        };
                }
            });
        },
        [currentField, validateField]
    );

    const handleFieldChange = useCallback((field: keyof FormData) => {
        setCurrentField(field);
    }, []);

    const handleFormSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formErrors: Partial<Record<keyof FormData, string>> = {};
            (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
                const error = validateField(key, formData[key].toString());
                if (error) formErrors[key] = error;
            });

            if (Object.keys(formErrors).length > 0) {
                setErrors(formErrors);
                return;
            }

            console.log("Form submitted:", formData);
            router.push("/confirmation");
        },
        [formData, validateField, router]
    );

    const isFormValid = useMemo(() => {
        return (
            formData.totalAmount > 0 &&
            formData.recipientCount > 0 &&
            formData.recipientBaseName.trim() !== ""
        );
    }, [formData]);

    const fieldConfig = useMemo(
        () => ({
            totalAmount: {
                label: "Total Amount",
                placeholder: "How much ETH to distribute?",
                icon: (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                ),
            },
            recipientCount: {
                label: "Number of Recipients",
                placeholder: "How many people will receive?",
                icon: (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                ),
            },
            recipientBaseName: {
                label: "Recipient BaseName",
                placeholder: "Name for this gift group",
                icon: (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                ),
            },
        }),
        []
    );

    return (
        <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md"
            initial={{ opacity: 0, y: -20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div
                className="flex items-center justify-center mb-6 relative group"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <img
                    src={imageUrl}
                    alt="NFT Artwork"
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
                {isImageHovered && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <Upload className="text-white" />
                        </button>
                        <button
                            onClick={() => setIsUrlInputOpen(true)}
                            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <Link className="text-white" />
                        </button>
                    </div>
                )}
            </div>

            {isUrlInputOpen && (
                <div className="mb-4 flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Enter image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-grow border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleUrlSubmit}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        <Check />
                    </button>
                    <button
                        onClick={() => setIsUrlInputOpen(false)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                        <X />
                    </button>
                </div>
            )}

            {/* Pill Navigation */}
            <div className="mb-4">
                <div className="border-2 border-white/20 rounded-full py-[2px] p-[2px] flex">
                    {(Object.keys(fieldConfig) as Array<keyof FormData>).map(
                        (field) => (
                            <button
                                key={field}
                                type="button"
                                onClick={() => handleFieldChange(field)}
                                className={`
                                px-4 py-2 text-sm rounded-full transition-colors
                                ${
                                    currentField === field
                                        ? "bg-blue-900 font-semibold text-white"
                                        : "text-white/70 font-semibold hover:bg-white/10 hover:text-white"
                                }
                            `}
                            >
                                {fieldConfig[field].label}
                            </button>
                        )
                    )}
                </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={fieldConfig[currentField].placeholder}
                        className={`w-full border rounded-lg p-3 pr-10 focus:outline-none text-black 
                            ${
                                errors[currentField]
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                            }`}
                        value={
                            currentField === "totalAmount"
                                ? formData.totalAmount.toString()
                                : currentField === "recipientCount"
                                ? formData.recipientCount.toString()
                                : formData.recipientBaseName
                        }
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    {errors[currentField] ? (
                        <AlertTriangle
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                            size={20}
                        />
                    ) : (
                        fieldConfig[currentField].icon
                    )}
                </div>

                {errors[currentField] && (
                    <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {errors[currentField]}
                    </motion.p>
                )}

                <div className="flex justify-end items-center mt-4">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`
                            flex items-center space-x-2 px-6 py-3 rounded-lg transition-all 
                            group
                            ${
                                isFormValid
                                    ? "bg-blue-900 text-white hover:bg-blue-950 hover:shadow-md"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <span className="transition-transform group-hover:translate-x-1">
                            Next
                        </span>
                        <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default GiftForm;
