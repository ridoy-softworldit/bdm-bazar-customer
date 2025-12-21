/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handleAddToCart } from "./useHandleAddtocart";
import { useState, useMemo } from "react";

const ProductCard = ({ product }: { product: any }) => {
  const dispatch = useAppDispatch();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

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

  const discount = product.productInfo.salePrice 
    ? Math.round(((product.productInfo.price - product.productInfo.salePrice) / product.productInfo.price) * 100)
    : 0;

  return (
    <div className="group w-full max-w-sm mx-auto font-sans border border-transparent hover:border-gray-200 transition-all duration-300">
      <div className="relative overflow-hidden p-4">
        {discount > 0 && (
          <div className="absolute top-[-5px] left-[-5px] z-10 w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 50,0 L 65,15 L 85,15 L 85,35 L 100,50 L 85,65 L 85,85 L 65,85 L 50,100 L 35,85 L 15,85 L 15,65 L 0,50 L 15,35 L 15,15 L 35,15 Z" fill="#EF4444" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold leading-tight">
              <span className="text-xl">{discount}%</span>
              <span className="text-sm">OFF</span>
            </div>
          </div>
        )}
        <Image
          src={product.featuredImg}
          alt={product.description.name}
          className="w-full h-auto aspect-[2/3] object-cover"
          height={372}
          width={260}
        />
        {!product.productInfo.inStock && (
          <div className="absolute bottom-5 -right-10 transform rotate-[-45deg] bg-[#16a34a] text-white text-xs px-10 py-1 font-semibold">
            স্টক আউট
          </div>
        )}
        <div className="absolute inset-0 hover:bg-[#00000044] bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Button
            variant={addedItems.has(product._id) ? "default" : "secondary"}
            className={`px-8 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold cursor-pointer ${
              addedItems.has(product._id) ? "bg-green-500 hover:bg-green-600 text-white" : "bg-[#009FDA] text-white"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleAddToCartWithAnimation(product);
            }}
          >
            {addedItems.has(product._id) ? (
              <><Check className="w-4 h-4 mr-1 inline" />Added!</>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
      <div className="p-4 text-center">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-md text-[#333333] hover:text-[#009FDA] cursor-pointer">
            {product.description.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {product?.bookInfo?.specification?.authors?.[0]?.name || product?.categoryAndTags?.publisher || "Brand/Publisher"}
        </p>
        <div className="flex justify-center items-center mt-2 space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < Math.round(product.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
          ))}
          <span className="text-sm text-gray-400">({product.reviewCount})</span>
        </div>
        {product.productInfo.inStock && (
          <p className="text-sm text-[#16a34a] font-semibold mt-2">
            Product in Stock
          </p>
        )}
        <div className="mt-2 flex justify-center items-baseline space-x-2">
          {product.productInfo.salePrice && (
            <p className="text-md text-gray-400 line-through">
              TK. {product.productInfo.price.toLocaleString("en-IN")}
            </p>
          )}
          <p className="text-lg font-bold text-[#f57224]">
            TK. {(product.productInfo.salePrice || product.productInfo.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function MoreProducts() {
  const { data: allProductsData, isLoading } = useGetAllProductsQuery("");
  const cartItems = useAppSelector((state) => state.cart.items);

  const relevantProducts = useMemo(() => {
    if (!allProductsData?.data) return [];
    
    const cartProductIds = new Set(cartItems.map(item => item.productId));
    
    return allProductsData.data
      .filter((product: any) => !cartProductIds.has(product._id))
      .sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 10);
  }, [allProductsData, cartItems]);

  if (isLoading) {
    return (
      <div className="bg-[#F8F8F8] p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto bg-[#FFFFEB] p-6 rounded-md shadow-2xl">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relevantProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#F8F8F8] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-[#FFFFEB] p-6 rounded-md shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          কার্টে আরও যা যুক্ত করতে পারেন
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relevantProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
