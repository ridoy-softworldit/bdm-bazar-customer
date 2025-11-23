"use client";

import { Tag } from "lucide-react"; // আপনি চাইলে আইকন পরিবর্তন করতে পারেন
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// আপনার API অনুযায়ী Interface
interface CategoryObject {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  categoryAndTags: {
    // ✅ এখানে tags এর পরিবর্তে categories ব্যবহার করা হচ্ছে
    categories: CategoryObject[];
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export default function CategoryListPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ পরিবর্তন: 'tags' এর পরিবর্তে 'categories' state ব্যবহার করা হয়েছে
  const [categories, setCategories] = useState<CategoryObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/product/`);
        const responseData: ApiResponse = await res.json();
        const products = Array.isArray(responseData.data)
          ? responseData.data
          : [];

        // ✅ এখানে product.categoryAndTags.categories থেকে ডাটা নেওয়া হচ্ছে
        const allCategoryObjects = products.flatMap(
          (p) => p.categoryAndTags.categories || []
        );

        // ডুপ্লিকেট ক্যাটাগরি অবজেক্ট বাদ দেওয়ার জন্য ID দিয়ে Map করা হয়েছে
        const uniqueCategories = [
          ...new Map(
            allCategoryObjects.map((category) => [category._id, category])
          ).values(),
        ];

        // state-এ ইউনিক ক্যাটাগরি অবজেক্টগুলো সেভ করা হচ্ছে
        setCategories(
          uniqueCategories.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("API থেকে ডাটা আনতে সমস্যা হয়েছে:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ পরিবর্তন: ফাংশনের নাম এবং প্যারামিটার পরিবর্তন করা হয়েছে
  const handleCategoryClick = (categorySlug: string) => {
    // URL should match CategoryNavigation structure: /category/subcategory/{slug}
    router.push(`/category/subcategory/${categorySlug}`);
  };

  // --- স্ক্রল করার লজিক অপরিবর্তিত ---
  // ... (আপনার দেওয়া স্ক্রলিং কোড এখানে থাকবে)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-100">
      <div className="flex items-center gap-2 md:gap-3 relative">
        {/* ...অ্যারো বাটন... */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide py-3 md:py-4 px-1 no-scrollbar flex-nowrap"
        >
          {isLoading ? (
            <div className="flex items-center justify-center ...">লোডিং...</div>
          ) : (
            // ✅ পরিবর্তন: এখন categories (অবজেক্টের অ্যারে) এর উপর ম্যাপ করা হচ্ছে
            categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)} // স্লাগ পাস করা হচ্ছে
                className="flex items-center flex-shrink-0 gap-2 bg-white border border-blue-400 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-blue-50 hover:border-blue-500 text-gray-700"
              >
                <Tag className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{category.name}</span> {/* এখানে নাম দেখানো হচ্ছে */}
              </div>
            ))
          )}
        </div>
        {/* ...অ্যারো বাটন... */}
      </div>
    </div>
  );
}
