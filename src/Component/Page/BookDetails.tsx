"use client";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Star } from "lucide-react";

export default function BookDetails() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          হযরত মা ফাতেমা (রাঃ) জীবনী (হার্ডকভার)
        </h1>
        <p className="text-blue-600 mb-3 text-sm">
          by{" "}
          <span className="underline hover:no-underline cursor-pointer">
            মাওলানা মোহাম্মদ আলী
          </span>
        </p>

        <div className="mb-3">
          <span className="text-sm text-gray-600">Category: </span>
          <span className="text-blue-600 text-sm">
            নবী-রাসূল, সাহাবা, তাহরীক ও জীবনী-আত্মজীবনী
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-orange-400 text-orange-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">9 Ratings | 5 Reviews</span>
        </div>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed mb-4">
        <p>
          হযরত মা ফাতেমা (রাঃ) জীবনী হযরত মা ফাতেমা (রাঃ) এর জীবনী সম্পর্কে
          বিস্তারিত তথ্য রয়েছে।
          <span className="text-blue-600 cursor-pointer hover:underline">
            See more
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg text-gray-500 line-through">TK. 200</span>
          <span className="text-2xl font-bold text-gray-900">TK. 100</span>
          <span className="text-green-600 text-sm">You Save TK. 100 (50%)</span>
        </div>

        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">In Stock</span>
          <span className="text-red-600 text-sm">(only 4 copies left)</span>
        </div>

        <p className="text-sm text-gray-600">
          • ঢাকা শহরে হোম ডেলিভারি আজকেই অর্ডার করুন
        </p>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
          <p className="text-sm text-orange-800">
            🔥 ৯০% গ্রন্থ ছাড় বাংলা-ইংরেজিতে স্টক শেষ হওয়ার আগেই অর্ডার করুন।
            <br />
            <span className="text-blue-600 cursor-pointer hover:underline">
              আরো দেখুন ↓
            </span>
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            একটু পড়ে দেখুন
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Go To Cart →
          </Button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 text-sm">
            <Heart className="w-4 h-4" />
            <span>গ্রন্থের তালিকায় রাখুন</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 text-sm">
            <Share2 className="w-4 h-4" />
            <span>বন্ধুদের সাথে শেয়ার করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
