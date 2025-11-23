"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  mainCategory?: string;
}

interface ApiCategory {
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

export default function ProdCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API; // .env থেকে আসছে
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch both categories and products
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${BASE_URL}/category/`),
          axios.get(`${BASE_URL}/product/`)
        ]);
        
        const allCategories = categoriesRes.data.data;
        const allProducts: Product[] = productsRes.data.data;
        
        // Filter book categories
        const bookCategories = (allCategories as ApiCategory[]).filter((cat) => 
          cat.mainCategory?.toLowerCase() === 'book'
        );
        
        const grouped: Record<string, Product[]> = {};
        
        // For each book category, find products that belong to it
        bookCategories.forEach((bookCat) => {
          const categoryProducts = allProducts.filter((product) => 
            product.categoryAndTags.categories.some((prodCat) => 
              prodCat.slug === bookCat.slug || prodCat.name === bookCat.name
            )
          );
          
          if (categoryProducts.length > 0) {
            grouped[bookCat.name] = categoryProducts;
          }
        });
        
        console.log('Book categories found:', Object.keys(grouped));
        setCategories(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [BASE_URL]);

  const scrollBy = (delta: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <main className="w-full max-w-7xl mx-auto my-24">
      <h2 className="mb-4 text-[18px] font-semibold text-gray-800">
        ক্যাটাগরিভিত্তিক বই
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy(-320)}
          className="absolute top-1/2 -translate-y-1/2 left-1 z-10 h-20 w-8 rounded-md border bg-white shadow hover:shadow-md flex items-center justify-center"
        >
          <span className="text-xs font-medium">&#10094;</span>
        </button>

        {/* --- MODIFIED SECTION START --- */}

        {/* Scrollable rail */}
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
                <p className="text-sm">No categories found</p>
              </div>
            </div>
          ) : (
            Object.entries(categories).map(([catName, books]) => (
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
                {books.slice(0, 4).map((b) => (
                  <Link
                    href={`/product/${b._id}`}
                    key={b._id}
                    className="block"
                  >
                    <div key={b._id} className="flex flex-col items-center">
                      <div className="relative h-24 w-16 sm:h-28 sm:w-20 md:h-32 md:w-24 lg:h-36 lg:w-28 overflow-hidden bg-gray-100 rounded-md border border-blue-100">
                        <Image
                          src={b.featuredImg}
                          alt="Product Image"
                          fill
                          sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                          className=" object-cover"
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-gray-600 line-clamp-2 text-center leading-tight">
                        {b.description.name_bn}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* `mt-auto` pushes this container to the bottom of the flex card */}
              <div className="px-4 pb-4 mt-auto">
                <Link
                  href={`/category/subcategory/${books[0].categoryAndTags.categories.find(cat => cat.mainCategory?.toLowerCase() === 'book')?.slug || books[0].categoryAndTags.categories[0]?.slug}`}
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

        {/* --- MODIFIED SECTION END --- */}

        {/* Right Arrow */}
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
