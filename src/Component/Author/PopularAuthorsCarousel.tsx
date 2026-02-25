"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useGetAllAuthorsQuery } from "@/redux/featured/author/authorApi";
import { TAuthor } from "@/types/author/author";
const PopularAuthorsCarousel = () => {
  const { data: authors, isLoading } = useGetAllAuthorsQuery(undefined);

  if (isLoading) {
    return (
      <div className=" py-4 md:py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
          <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center min-w-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-200 rounded-full animate-pulse shadow-lg" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16 md:w-24 mt-2 sm:mt-4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authors || authors.length === 0) return null;

  // Sort by followersCount → Top 5
  const topAuthors = [...authors]
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 15);

  return (
    <div className="max-w-[1280px] mx-auto py-4 md:py-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1280px] mx-auto px-2 sm:px-4 ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            জনপ্রিয় লেখক
          </h2>
          <Link href="/authors">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold rounded-lg px-4 sm:px-6 text-sm"
            >
              সব দেখুন
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 sm:-ml-4 md:-ml-6 px-4 sm:px-8 md:px-12">
            {topAuthors.map((author: TAuthor) => (
              <CarouselItem
                key={author._id}
                className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 px-1"
              >
                <Link href={`/authors/${author._id}`}>
                  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
                    {/* Circular Image with Gradient Border */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-2 sm:mb-4 rounded-full overflow-hidden ring-2 sm:ring-4 ring-white shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-all duration-300 bg-white p-0.5 sm:p-1">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {author.image ? (
                            <Image
                              src={author.image}
                              alt={author.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <p
                      className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 w-full max-w-16 sm:max-w-20 md:max-w-32 leading-tight group-hover:text-blue-600 transition-colors duration-300"
                      title={author.name}
                    >
                      {author.name}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Stylish Arrows */}
          <CarouselPrevious className="-left-1 sm:-left-2 md:-left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white hover:bg-blue-600 hover:text-white shadow-md sm:shadow-lg border border-gray-200 sm:border-2 hover:border-blue-600 transition-all duration-300" />
          <CarouselNext className="-right-1 sm:-right-2 md:-right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white hover:bg-blue-600 hover:text-white shadow-md sm:shadow-lg border border-gray-200 sm:border-2 hover:border-blue-600 transition-all duration-300" />
        </Carousel>
      </div>
    </div>
  );
};
export default PopularAuthorsCarousel;
