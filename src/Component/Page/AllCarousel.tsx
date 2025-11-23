/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    title: "উদয়ন গোপালকৃষ্ণ",
    author: "রবীন্দ্র নাথ",
    price: 157,
    originalPrice: 250,
    discount: 37,
    image: "/bengali-book-cover-with-earth-globe.jpg",
    inStock: true,
  },
  {
    id: 2,
    title: "সূর্য খাদক সূর্য উৎপাদ",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    price: 180,
    originalPrice: 290,
    discount: 37,
    image: "/bengali-book-cover-with-food-illustration.jpg",
    inStock: true,
  },
  {
    id: 3,
    title: "নীল পাহাড় নীলিমা",
    author: "বঙ্কিম চন্দ্র চট্টোপাধ্যায়",
    price: 346,
    originalPrice: 560,
    discount: 37,
    image: "/bengali-book-cover-green-and-red-design.jpg",
    inStock: true,
  },
  {
    id: 4,
    title: "প্রতিমার প্রতিশোধ",
    author: "হুমায়ূন আহমেদ",
    price: 391,
    originalPrice: 630,
    discount: 38,
    image: "/bengali-book-cover-with-classical-figure.jpg",
    inStock: true,
  },
  {
    id: 5,
    title: "Faber Castell Textliner",
    author: "Faber Castell",
    price: 307,
    originalPrice: 495,
    discount: 38,
    image: "/green-highlighter-marker-pen.jpg",
    inStock: true,
  },
  {
    id: 6,
    title: "শা খোশ কে",
    author: "রাহাত খান",
    price: 221,
    originalPrice: 340,
    discount: 35,
    image: "/bengali-book-cover-dark-design.jpg",
    inStock: true,
  },
  {
    id: 7,
    title: "কুরআন মজিদ কুরআন মজিদ",
    author: "মাওলানা আকরামুল্লাহ",
    price: 392,
    originalPrice: 600,
    discount: 34,
    image: "/bengali-islamic-book-cover.jpg",
    inStock: true,
  },
];

export default function AllCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    );
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <div className="max-w-5xl mt-4 h-[500px] mx-auto bg-[#FFFFFF] shadow-sm rounded  p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Reviewed Products
          </h2>
        </div>
        <Link href="/products">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 border-blue-500 hover:bg-blue-50 bg-transparent"
          >
            See all
          </Button>
        </Link>
      </div>

      {/* Product Grid with Navigation */}
      <div className="relative">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-md hover:bg-gray-50"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Right Arrow */}
        {currentIndex + itemsPerView < products.length && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-md hover:bg-gray-50"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Product Grid */}
        <div className="relative">
          {/* Left/Right static arrows */}

          {/* Horizontal row, only 5 visible */}
          <div className="flex gap-4 overflow-hidden">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc(100%/5)] h-[320px] relative group bg-white rounded-md shadow"
              >
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-red-500 text-white rounded-full w-12 h-17 flex items-center justify-center text-xs font-bold">
                    <div className="text-center">
                      <div>{product.discount}%</div>
                      <div className="text-[10px]">OFF</div>
                    </div>
                  </div>
                </div>

                {/* Hover Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity z-20">
                  <Link href={`/product/${product.id}`}>
                    <Button
                      size="sm"
                      className="bg-white text-gray-800 hover:bg-gray-100 w-28"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700 w-28"
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* Product Image */}
                <div className="h-[180px] w-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col ml-2 justify-between p-2">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  {product.author && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {product.author}
                    </p>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">
                      In Stock
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-sm font-bold text-gray-900">
                      ৳{product.price}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        ৳{product.originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
