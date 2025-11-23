"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  mainCategory: string;
}

interface Product {
  _id: string;
  featuredImg: string;
  description: { name_bn: string };
  categoryAndTags: {
    categories: Category[];
  };
}

export default function OtherCategoryCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/product/`);
        const data: Product[] = res.data.data;

        const grouped: Record<string, Product[]> = {};

        data.forEach((p) => {
          p.categoryAndTags.categories.forEach((cat) => {
            // Only include non-book categories
            if (cat.mainCategory?.toLowerCase() !== 'book') {
              const catName = cat.name;
              if (!grouped[catName]) grouped[catName] = [];
              grouped[catName].push(p);
            }
          });
        });

        setCategories(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [BASE_URL]);

  const scrollBy = (delta: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <main className="w-full max-w-7xl mx-auto my-24">
      <h2 className="mb-4 text-[18px] font-semibold text-gray-800">
        ক্যাটাগরিভিত্তিক অন্যান্য পণ্য
      </h2>
      <div className="relative">
        <button
          onClick={() => scrollBy(-320)}
          className="absolute top-1/2 -translate-y-1/2 left-1 z-10 h-20 w-8 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10094;</span>
        </button>

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar snap-x snap-mandatory"
        >
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 h-[420px] rounded-md border border-gray-100 bg-white shadow-sm flex flex-col snap-start"
              >
                <div className="px-4 pt-4 pb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 px-4 pb-3 flex-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-36 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="mt-1 h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 mt-auto">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : Object.keys(categories).length === 0 ? (
            // Empty state with same height
            <div className="flex-shrink-0 w-80 h-[420px] rounded-md border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center snap-start">
              <div className="text-gray-500 text-center">
                <p className="text-sm">No other categories found</p>
              </div>
            </div>
          ) : (
            Object.entries(categories).map(([catName, products]) => (
            <div
              key={catName}
              className="flex-shrink-0 w-80 h-[420px] rounded-md border border-gray-100 bg-white shadow-sm flex flex-col snap-start"
            >
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-[15px] font-semibold text-gray-800">
                  {catName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 px-4 pb-3 flex-1">
                {products.slice(0, 4).map((p) => (
                  <Link
                    href={`/product/${p._id}`}
                    key={p._id}
                    className="block"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative h-24 w-16 sm:h-28 sm:w-20 md:h-32 md:w-24 lg:h-36 lg:w-28 overflow-hidden bg-gray-100 rounded-md border border-blue-100">
                        <Image
                          src={p.featuredImg}
                          alt="Product Image"
                          fill
                          sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-gray-600 line-clamp-2 text-center leading-tight">
                        {p.description.name_bn}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="px-4 pb-4 mt-auto">
                <Link
                  href={`/category/subcategory/${products[0].categoryAndTags.categories[0].slug}`}
                  className="group inline-flex items-center text-[12px] font-medium text-sky-600 hover:text-sky-700"
                >
                  See More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="ms-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))
          )}
        </div>

        <button
          onClick={() => scrollBy(320)}
          className="absolute top-1/2 -translate-y-1/2 right-1 z-10 h-20 w-9 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10095;</span>
        </button>
      </div>
    </main>
  );
}