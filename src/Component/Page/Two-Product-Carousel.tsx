/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

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
    image:
      "https://ds.rokomari.store/rokomari110/category/921c2e06dd5c4_image.jpg",
    inStock: true,
  },
  {
    id: 2,
    title: "সূর্য খাদক সূর্য উৎপাদ",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    price: 180,
    originalPrice: 290,
    discount: 37,
    image:
      "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg",
    inStock: true,
  },
  {
    id: 3,
    title: "নীল পাহাড় নীলিমা",
    author: "বঙ্কিম চন্দ্র চট্টোপাধ্যায়",
    price: 346,
    originalPrice: 560,
    discount: 37,
    image:
      "https://ds.rokomari.store/rokomari110/category/921c2e06dd5c4_image.jpg",
    inStock: true,
  },
  {
    id: 4,
    title: "প্রতিমার প্রতিশোধ",
    author: "হুমায়ূন আহমেদ",
    price: 391,
    originalPrice: 630,
    discount: 38,
    image:
      "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg",
    inStock: true,
  },
  {
    id: 5,
    title: "Faber Castell Textliner",
    author: "Faber Castell",
    price: 307,
    originalPrice: 495,
    discount: 38,
    image:
      "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png",
    inStock: true,
  },
  {
    id: 6,
    title: "শা খোশ কে",
    author: "রাহাত খান",
    price: 221,
    originalPrice: 340,
    discount: 35,
    image:
      "https://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg",
    inStock: true,
  },
  {
    id: 7,
    title: "কুরআন মজিদ কুরআন মজিদ",
    author: "মাওলানা আকরামুল্লাহ",
    price: 392,
    originalPrice: 600,
    discount: 34,
    image:
      "https://ds.rokomari.store/rokomari110/category/5f230d84cbeb4_image.png",
    inStock: true,
  },
];

export default function TwoProductCarousel({ title }: { title: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className=" rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">X</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-500 hover:bg-blue-50 bg-transparent"
        >
          See all
        </Button>
      </div>

      {/* Horizontal Scroll Row */}
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-md hover:bg-gray-50"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-md hover:bg-gray-50"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar scrollbar-none py-2"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="relative flex-shrink-0 w-[180px] h-[320px] group"
            >
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
                  <div className="text-center">
                    <div>{product.discount}%</div>
                    <div className="text-[10px]">OFF</div>
                  </div>
                </div>
              </div>

              {/* Hover Buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity z-0">
                <Link
                  href={``}
                  className="bg-white text-gray-800 hover:bg-gray-100 w-28"
                >
                  View Details
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
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  width={180}
                  height={180}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col mt-2 px-2 justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  {product.author && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {product.author}
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.inStock ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Price */}
                <div className="flex gap-2 mt-1">
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
