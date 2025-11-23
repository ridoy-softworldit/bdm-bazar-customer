"use client";

import { Coins, PlayCircle, Truck } from "lucide-react";
import { useState } from "react";
import FrequentlyBoughtTogether from "./FrequentlyBoughtTogether";

export default function InfoButtons() {
  const [activeTab, setActiveTab] = useState("delivery");

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Tab Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex items-center gap-2 px-14 border border-blue-400 py-2 rounded-md transition w-full md:w-auto 
                        ${
                          activeTab === "delivery"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
        >
          <Truck className="h-5 w-5 text-gray-600" />
          <span className="text-sm">সকল বাংলাদেশে হোম ডেলিভারি</span>
        </button>

        <button
          onClick={() => setActiveTab("order")}
          className={`flex items-center gap-2  border border-blue-400 px-8 py-2 rounded-md transition w-full md:w-auto 
                        ${
                          activeTab === "order"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
        >
          <PlayCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm">কিভাবে রকমারিতে অর্ডার করবেন</span>
        </button>

        <button
          onClick={() => setActiveTab("points")}
          className={`flex items-center gap-2 border border-blue-400 px-8 py-2 rounded-md transition w-full md:w-auto 
                        ${
                          activeTab === "points"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
        >
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">পণ্য কিনে পয়েন্টস জিতুন</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6 p-4 bg-[#FFFFFF] shadow-md shadow-gray-200 rounded-md">
        {activeTab === "delivery" && (
          <div className="text-sm">
            <FrequentlyBoughtTogether />
          </div>
        )}
        {activeTab === "order" && (
          <p className="text-sm">
            🎥 কিভাবে অর্ডার করবেন তা দেখতে ভিডিও টিউটোরিয়াল বা গাইড অনুসরণ
            করুন।
          </p>
        )}
        {activeTab === "points" && (
          <p className="text-sm">
            🏆 পণ্য কিনলে পয়েন্ট সংগ্রহ করুন এবং দারুণ অফার ও পুরস্কার জিতুন।
          </p>
        )}
      </div>
    </div>
  );
}
