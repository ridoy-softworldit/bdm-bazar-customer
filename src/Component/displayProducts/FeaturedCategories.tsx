/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetFeaturedCategoriesQuery } from "@/redux/featured/category/categoryApi";

const FeaturedCategories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: featuredData, isLoading } = useGetFeaturedCategoriesQuery("");
  const featuredCategories = featuredData?.data || [];

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto shadow-sm p-6 m-6 rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-6 overflow-hidden pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[180px] text-center">
              <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!featuredCategories.length) return <p>No featured categories available.</p>;

  return (
    <div className="max-w-[1280px] mx-auto shadow-sm p-6 m-6 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-medium text-[22px] leading-[27px] text-[rgb(51,51,51)]" style={{ fontFamily: 'Lato, sans-serif, SiyamRupali', fontWeight: 500 }}>Featured Categories</h1>
      </div>
      
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy(-500)}
          className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 h-20 w-8 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10094;</span>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
        >
          {featuredCategories.map((category: any) => (
            <Link href={`/category/subcategory/${category.slug}`} key={category._id}>
              <div className="flex-shrink-0 w-[180px] text-center hover:scale-105 transition-transform">
                {/* Circular Image */}
                <div 
                  className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${category.bannerImg})` }}
                ></div>
                
                {/* Category Name */}
                <h3 className="text-sm font-medium text-gray-800">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollBy(500)}
          className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 h-20 w-9 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10095;</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedCategories;