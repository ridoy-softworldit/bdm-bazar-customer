/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { handleAddToCart } from "../Page/cart/useHandleAddtocart";

const NewReleasedProducts: React.FC = () => {
  const { data: allProducts } = useGetAllProductsQuery("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAddToCartWithAnimation = (product: any) => {
    handleAddToCart(product, dispatch);
    setAddedItems(prev => new Set(prev).add(product._id));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }, 2000);
  };

  // Get newest products by sorting createdAt
  const newProducts = useMemo(() => {
    if (!allProducts?.data) return [];

    return [...allProducts.data]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Sort descending (newest first)
      })
      .slice(0, 12); // Show first 12 newest products
  }, [allProducts]);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const renderStars = (rating = 0) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < Math.round(rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  const { isLoading } = useGetAllProductsQuery("");

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto shadow-sm p-4 m-4 rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 overflow-hidden pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[200px]">
              <div className="p-2">
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!newProducts.length) return <p>No new products available.</p>;

  return (
    <div className="max-w-[1280px] mx-auto p-4 m-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-medium text-[22px] leading-[27px] text-[rgb(51,51,51)]" style={{ fontFamily: 'Lato, sans-serif, SiyamRupali', fontWeight: 500 }}>New Released Products</h1>
        <button 
          onClick={() => router.push('/category/subcategory/book?sort=new-released')}
          className="px-4 py-2 border border-[#0692cb] text-[#0692cb] hover:bg-[#0692cb] hover:text-white rounded-md font-medium transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy(-500)}
          className="absolute top-1/2 -translate-y-1/2 -left-3 z-10 h-20 w-8 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10094;</span>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
        >
          {newProducts.map((product: any) => (
            <Card
              key={product._id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 rounded-lg border-none text-center flex-shrink-0 w-[200px] snap-start"
            >
            <CardContent className="p-2 flex flex-col items-center justify-center">
              {/* Image Section */}
              <div className="relative w-full h-48 mb-2 overflow-hidden rounded-lg">
                <Image
                  src={product.featuredImg}
                  alt={product.description.name}
                  fill
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-center space-y-4 items-center py-6 transition-all duration-500">
                  <Button
                    variant={addedItems.has(product._id) ? "default" : "secondary"}
                    size="sm"
                    className={`transition-all duration-500 cursor-pointer translate-y-[-10px] group-hover:translate-y-0 ${
                      addedItems.has(product._id) 
                        ? "bg-green-500 hover:bg-green-600 text-white scale-110" 
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCartWithAnimation(product);
                    }}
                  >
                    {addedItems.has(product._id) ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Added!
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>

                  <Link href={`/product/${product._id}`}>
                    <Button
                      variant="default"
                      size="sm"
                      className="transition-all duration-500 cursor-pointer translate-y-[10px] group-hover:translate-y-0"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <CardTitle className="font-bold text-sm line-clamp-2">
                  {product.description.name}
                </CardTitle>

                <CardDescription className="text-xs text-gray-600 line-clamp-1">
                  {product?.bookInfo?.specification?.authors?.[0]?.name ||
                    product?.categoryAndTags?.publisher ||
                    "Brand/Publisher"}
                </CardDescription>

                {/* Discount Badge */}
                {product.productInfo.salePrice && (() => {
                  const discountPercent = Math.round(((product.productInfo.price - product.productInfo.salePrice) / product.productInfo.price) * 100);
                  const badgeColor = discountPercent > 30 ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black';
                  return (
                    <div className={`absolute top-1 left-1 w-12 h-12 rounded-full ${badgeColor} text-xs font-bold flex flex-col items-center justify-center leading-tight`}>
                      <span>{discountPercent}%</span>
                      <span>OFF</span>
                    </div>
                  );
                })()}

                {/* Price Section */}
                {product.productInfo.salePrice ? (
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-gray-500 line-through text-xs">
                      ৳ {product.productInfo.price}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ৳ {product.productInfo.salePrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold">
                    ৳ {product.productInfo.price}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollBy(500)}
          className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 h-20 w-9 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10095;</span>
        </button>
      </div>
    </div>
  );
};

export default NewReleasedProducts;
