"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { TProduct } from "@/types/product/product";
import { handleAddToCart } from "./cart/useHandleAddtocart";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";

export default function ProductCarousel() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const dispatch = useDispatch();
  const carouselRef = useRef<HTMLDivElement>(null);

  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 2;
      if (width < 768) return 2;
      if (width < 1024) return 3;
      return 6;
    }
    return 6;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      setCurrentIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/product`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [BASE_URL]);

  // Calculate how many items we can scroll
  const totalSlides = Math.ceil(products.length / itemsPerView);
  const maxIndex = totalSlides - 1;
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= maxIndex;

  const handleNext = () => {
    if (!isAtEnd) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const handlePrev = () => {
    if (!isAtStart) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };


  return (
    <div className="mt-4 mx-auto rounded-lg max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">X</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Newly Released Products
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-500 hover:bg-blue-50 bg-transparent text-xs sm:text-sm"
        >
          See all
        </Button>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl border-0 rounded-full w-10 h-10 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={isAtStart}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl border-0 rounded-full w-10 h-10 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={isAtEnd}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Product track */}
        <div className="overflow-hidden">
          <div
            className="flex gap-2 px-2 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={`${product._id}`}
                className="
    flex-shrink-0
    basis-[calc(50%-0.5rem)]    /* Mobile: 2 cards */
    sm:basis-[calc(33.333%-0.66rem)]  /* Tablet: 3 cards */
    lg:basis-[calc(20%-0.8rem)]       /* Desktop: 5 cards */
    max-w-[calc(50%-0.5rem)]
    sm:max-w-[calc(33.333%-0.66rem)]
    lg:max-w-[calc(20%-0.8rem)]
  "
              >
                <Card className=" py-0 relative flex flex-col h-full md:min-h-[345px] md:max-h-[345px] overflow-hidden transition-all duration-300 group bg-gradient-to-b from-white to-gray-50 rounded-md pb-2">
                  {/* Discount badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
                    {product.productInfo?.totalDiscount ? (
                      <div className="bg-red-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xs font-bold shadow-md transform rotate-12">
                        <div className="text-center">
                          <div>{product.productInfo.totalDiscount}%</div>
                          <div className="text-[8px] sm:text-[10px]">OFF</div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12"></div>
                    )}
                  </div>

                  {/* Mobile icons */}
                  <div className="absolute top-2 right-2 sm:hidden z-20 flex flex-col gap-2">
                    <Link href={`/product/${product._id}`}>
                      <Button
                        size="sm"
                        className="bg-white/90 text-gray-800 hover:bg-white shadow-md w-8 h-8 p-0 rounded-full"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product, dispatch)}
                      disabled={
                        !product.productInfo?.inStock ||
                        product.productInfo?.quantity <= 0
                      }
                      className={`w-8 h-8 p-0 rounded-full shadow-md ${
                        !product.productInfo?.inStock ||
                        product.productInfo?.quantity <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 hidden sm:flex flex-col items-center justify-center gap-3 transition-opacity duration-300 z-20">
                    <Link href={`/product/${product._id}`}>
                      <Button
                        size="sm"
                        className="bg-white text-gray-800 hover:bg-gray-100 w-28 shadow-md"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product, dispatch)}
                      disabled={
                        !product.productInfo?.inStock ||
                        product.productInfo?.quantity <= 0
                      }
                      className={`w-28 flex items-center justify-center gap-1 shadow-md ${
                        !product.productInfo?.inStock ||
                        product.productInfo?.quantity <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </Button>
                  </div>

                  {/* Product image */}
                  <div className="h-[170px] w-full overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={product?.featuredImg || "/placeholder.svg"}
                      alt={product.description?.name || "product"}
                      fill
                      className="w-fit h-full mx-auto"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex flex-col flex-grow justify-between p-2 sm:p-4 md:text-left text-center">
                    {/* Book name */}
                    <h3
                      className="text-sm font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
                      title={
                        product.description?.name_bn ||
                        product.description?.name
                      }
                    >
                      {product.description?.name_bn ||
                        product.description?.name}
                    </h3>

                    {/* Author name */}
                    {product.bookInfo?.specification?.authors?.[0]?.name && (
                      <p
                        className="text-xs text-gray-500 mt-1 overflow-hidden text-ellipsis whitespace-nowrap"
                        title={product.bookInfo.specification.authors[0].name}
                      >
                        {(() => {
                          const authors =
                            product.bookInfo.specification.authors[0].name
                              .split(",")
                              .map((a) => a.trim());
                          return authors.length > 1
                            ? `${authors[0]} এবং অন্যান্য`
                            : authors[0];
                        })()}
                      </p>
                    )}

                    {/* Stock and price */}
                    <div className="mt-1">
                      {product.productInfo?.inStock &&
                      product.productInfo?.quantity > 0 ? (
                        <span className="text-xs text-green-600 font-medium">
                          In Stock ({product.productInfo.quantity})
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">
                          Out of Stock
                        </span>
                      )}

                      <div className="flex gap-2 items-center text-center md:justify-start justify-center mt-1">
                        <div className="text-sm font-bold text-gray-900">
                          ৳
                          {product.productInfo?.salePrice ||
                            product.productInfo?.price}
                        </div>
                        {product.productInfo?.salePrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ৳{product.productInfo.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
