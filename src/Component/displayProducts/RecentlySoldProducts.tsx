/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { handleAddToCart } from "../Page/cart/useHandleAddtocart";
import { useGetRecentlySoldProductsQuery } from "@/redux/featured/product/productApi";

const RecentlySoldProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: recentlySoldData, isLoading } = useGetRecentlySoldProductsQuery("");
  const recentlySoldProducts = recentlySoldData?.data || [];

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

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto shadow-sm p-6 m-6 rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 overflow-hidden pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[200px]">
              <div className="p-4">
                <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!recentlySoldProducts.length) return <p>No recently sold products available.</p>;

  return (
    <div className="max-w-[1280px] mx-auto shadow-sm p-6 m-6 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-medium text-[22px] leading-[27px] text-[rgb(51,51,51)]" style={{ fontFamily: 'Lato, sans-serif, SiyamRupali', fontWeight: 500 }}>Recently Sold Products</h1>
        {/* <button className="text-blue-600 hover:text-blue-800 font-medium">
          See All
        </button> */}
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
          className="flex gap-3 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
        >
          {recentlySoldProducts.map((product: any) => (
            <Card
              key={product._id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 rounded-lg border-none text-center flex-shrink-0 w-[200px] snap-start"
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                {/* Image Section */}
                <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.featuredImg}
                    alt={product.description.name}
                    fill
                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                  />
                  
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
                <div className="flex flex-col items-center justify-center space-y-2">
                  <CardTitle className="font-bold">
                    {product.description.name}
                  </CardTitle>

                  <CardDescription className="text-sm text-gray-600">
                    {product?.bookInfo?.specification?.authors?.[0]?.name ||
                      product?.categoryAndTags?.publisher ||
                      "Brand/Publisher"}
                  </CardDescription>

                  {/* Rating Stars */}
                  <div>{renderStars(product.averageRating)}</div>

                  {/* Price Section */}
                  {product.productInfo.salePrice ? (
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-gray-500 line-through text-sm">
                        ৳ {product.productInfo.price}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ৳ {product.productInfo.salePrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">
                      ৳ {product.productInfo.price}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        }
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

export default RecentlySoldProducts;