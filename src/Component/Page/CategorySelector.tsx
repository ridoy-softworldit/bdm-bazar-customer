"use client";

import { useState } from "react";

const categories = [
    "কুরআন ও তাফসীর",
    "হাদিস ও সুন্নাহ",
    "সীরাতে রাসুল ﷺ",
    "নবি-রাসুল, সাহাবা, তাবেইন...",
    "সালাত/নামাজ",
    "রোযা/সিয়াম",
    "হজ্জ-উমরাহ ও কুরবানী",
    "যাকাত",
    "ইসলামি আচরণ, শিষ্টাচার",
    "আরবি ও উর্দু",
];

export default function CategorySelector() {
    const [visibleCount, setVisibleCount] = useState(8);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 4); // Show 4 more categories at a time
    };

    return (
        <div className="p-4 mt-4 bg-[#FFFFFF] shadow-sm rounded">
            <h3 className="mb-3 text-gray-800 font-semibold">পছন্দের ক্যাটাগরি থেকে কিনুন</h3>
            <div className="flex flex-wrap gap-2">
                {categories.slice(0, visibleCount).map((cat, i) => (
                    <button
                        key={i}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                    >
                        {cat}
                    </button>
                ))}

                {visibleCount < categories.length && (
                    <button
                        onClick={handleShowMore}
                        className="px-4 py-2 bg-blue-100 text-blue-600 text-sm rounded-md hover:bg-blue-200 transition"
                    >
                        আরও দেখুন ▼
                    </button>
                )}
            </div>
        </div>
    );
}
