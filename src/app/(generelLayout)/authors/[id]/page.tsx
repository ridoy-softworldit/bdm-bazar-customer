"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetSingleAuthorsQuery, useFollowAuthorMutation } from "@/redux/featured/author/authorApi";
import { useGetProductsByAuthorQuery } from "@/redux/featured/product/productApi";
import { Users, BookOpen, Calendar, ShoppingCart, Star, Check } from "lucide-react";
import { use } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { handleAddToCart } from "@/Component/Page/cart/useHandleAddtocart";
import Link from "next/link";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TProduct } from "@/types/product/product";

interface AuthorDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AuthorDetailsPage({ params }: AuthorDetailsPageProps) {
  const { id } = use(params);
  const { data: author, isLoading, error } = useGetSingleAuthorsQuery(id);
  const { data: authorBooksResponse } = useGetProductsByAuthorQuery(id);
  const [followAuthor] = useFollowAuthorMutation();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [addedItems, setAddedItems] = React.useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  const authorBooks = authorBooksResponse?.data || [];
  const bookCount = authorBooks.length;

  const handleFollow = async () => {
    if (isFollowing) return;
    setIsFollowing(true);
    try {
      await followAuthor(id).unwrap();
    } catch (err) {
      console.error("Follow failed", err);
    } finally {
      setIsFollowing(false);
    }
  };

  const handleAddToCartWithAnimation = (product: TProduct) => {
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
      <div className="flex justify-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Author Not Found</h1>
          <p className="text-gray-600">The author you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Author Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Author Image */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div className="relative w-48 h-48 mx-auto md:mx-0 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {author.name}
              </h1>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{author.followersCount.toLocaleString()}</span>
                  <span>Followers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">{bookCount}</span>
                  <span>Books</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Since 2010</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-justify">
                  {author.description}
                </p>
              </div>

              {/* Follow Button */}
              <Button
                onClick={handleFollow}
                disabled={isFollowing}
                size="lg"
                className={`px-8 py-3 font-semibold transition-all duration-200 ${
                  isFollowing
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isFollowing ? "Following..." : "Follow Author"}
              </Button>
            </div>
          </div>
        </div>

        {/* Author's Books Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Books by {author.name}</h2>
            <Link href={`/authors/${id}/books`}>
              <Button variant="outline" size="sm">
                View All Books ({bookCount})
              </Button>
            </Link>
          </div>
          
          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {authorBooks && authorBooks.length > 0 ? (
              authorBooks.slice(0, 12).map((book) => (
                <Card
                  key={book._id}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 rounded-lg border-none text-center"
                >
                  <CardContent className="p-3 flex flex-col items-center justify-center">
                    {/* Image Section */}
                    <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg">
                      <Image
                        src={book.featuredImg}
                        alt={book.description.name}
                        fill
                        className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Discount Badge */}
                      {book.productInfo.salePrice && (() => {
                        const discountPercent = Math.round(((book.productInfo.price - book.productInfo.salePrice) / book.productInfo.price) * 100);
                        const badgeColor = discountPercent > 30 ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black';
                        return (
                          <div className={`absolute top-1 left-1 w-10 h-10 rounded-full ${badgeColor} text-xs font-bold flex flex-col items-center justify-center leading-tight`}>
                            <span>{discountPercent}%</span>
                            <span>OFF</span>
                          </div>
                        );
                      })()}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-center space-y-2 items-center py-4 transition-all duration-500">
                        <Button
                          variant={addedItems.has(book._id) ? "default" : "secondary"}
                          size="sm"
                          className={`transition-all duration-500 cursor-pointer translate-y-[-10px] group-hover:translate-y-0 text-xs px-3 py-1 ${
                            addedItems.has(book._id) 
                              ? "bg-green-500 hover:bg-green-600 text-white scale-110" 
                              : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCartWithAnimation(book);
                          }}
                        >
                          {addedItems.has(book._id) ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </Button>

                        <Link href={`/product/${book._id}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="transition-all duration-500 cursor-pointer translate-y-[10px] group-hover:translate-y-0 text-xs px-3 py-1"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <CardTitle className="text-xs font-semibold line-clamp-2 text-center leading-tight">
                        {book.description.name}
                      </CardTitle>

                      <CardDescription className="text-xs text-gray-600">
                        {author.name}
                      </CardDescription>

                      {/* Rating Stars */}
                      <div>{renderStars(book.averageRating)}</div>

                      {/* Price Section */}
                      {book.productInfo.salePrice ? (
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-gray-500 line-through text-xs">
                            ৳ {book.productInfo.price}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            ৳ {book.productInfo.salePrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold">
                          ৳ {book.productInfo.price}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No books found by this author</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}