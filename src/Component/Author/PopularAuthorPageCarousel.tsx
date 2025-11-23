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
import {
  useGetAllAuthorsQuery,
  useFollowAuthorMutation,
} from "@/redux/featured/author/authorApi";
import { TAuthor } from "@/types/author/author";

const PopularAuthorPageCarousel = () => {
  const { data: authors, isLoading } = useGetAllAuthorsQuery(undefined);
  const [followAuthor] = useFollowAuthorMutation();
  const [followingId, setFollowingId] = React.useState<string | null>(null);

  const handleFollow = async (id: string) => {
    if (followingId === id) return;
    setFollowingId(id);
    try {
      await followAuthor(id).unwrap();
    } catch (err) {
      console.error("Follow failed", err);
    } finally {
      setFollowingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-0 bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-3" />
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-16 mb-3 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authors || authors.length === 0) return null;

  return (
    <div className="py-6 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            জনপ্রিয় লেখকগণ
          </h2>
        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4 px-8">
            {authors.map((author: TAuthor) => (
              <CarouselItem
                key={author._id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Author Image */}
                    <Link href={`/authors/${author._id}`}>
                      <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-blue-200 transition-all duration-300 cursor-pointer">
                        <Image
                          src={author.image}
                          alt={author.name}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    {/* Author Name */}
                    <Link href={`/authors/${author._id}`}>
                      <h3
                        className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 hover:text-blue-600 transition-colors cursor-pointer min-h-[2.5rem]"
                        title={author.name}
                      >
                        {author.name}
                      </h3>
                    </Link>

                    {/* Followers Count */}
                    <p className="text-xs text-gray-500 mb-3">
                      {author.followersCount.toLocaleString()} followers
                    </p>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow" />

                    {/* Follow Button */}
                    <Button
                      onClick={() => handleFollow(author._id)}
                      disabled={followingId === author._id}
                      variant="outline"
                      size="sm"
                      className={`w-full text-xs transition-all duration-200 mt-auto ${
                        followingId === author._id
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {followingId === author._id ? "Following..." : "Follow"}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows */}
          <CarouselPrevious className="-left-4 w-10 h-10 bg-white hover:bg-gray-50 shadow-md border" />
          <CarouselNext className="-right-4 w-10 h-10 bg-white hover:bg-gray-50 shadow-md border" />
        </Carousel>
      </div>
    </div>
  );
};

export default PopularAuthorPageCarousel;
