"use client";

import Image from "next/image";
import { PenTool, AlertCircle } from "lucide-react";

type AuthorProfileProps = {
    name: string;
    followers: number;
    avatarUrl?: string; 
};

export default function AuthorProfilePage({
    name = "আদহাম শরফউদ্দিন",
    followers = 90,
    avatarUrl,
}: AuthorProfileProps) {
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            {/* Header */}
            <div className="flex items-start gap-6">
                {/* Left: Avatar + followers + follow button */}
                <div className="w-[120px]">
                    {/* Avatar */}
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={name}
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <PenTool className="h-10 w-10 text-gray-400" />
                        </div>
                    )}

                    {/* Followers */}
                    <div className="mt-4 text-sm text-gray-700">
                        <span className="font-semibold">{followers}</span> followers
                    </div>

                    {/* Follow button */}
                    <button
                        type="button"
                        className="mt-2 inline-block px-5 py-2 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                    >
                        Follow
                    </button>
                </div>

                {/* Right: Author name */}
                <div className="flex-1 pt-2">
                    <h1 className="text-2xl font-medium text-gray-800">{name}</h1>
                </div>
            </div>

            {/* Divider + Report incorrect information */}
            <div className="my-5 border-t border-gray-200" />
            <div className="flex justify-center">
                <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-red-600 hover:underline"
                    onClick={() => console.log("Report incorrect information clicked")}
                >
                    <AlertCircle className="h-4 w-4" />
                    <span>Report incorrect information</span>
                </button>
            </div>
            <div className="mt-5 border-t border-gray-200" />
        </div>
    );
}
