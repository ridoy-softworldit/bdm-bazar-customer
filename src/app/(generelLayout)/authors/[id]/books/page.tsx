"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetSingleAuthorsQuery } from "@/redux/featured/author/authorApi";
import { useGetProductsByAuthorQuery } from "@/redux/featured/product/productApi";
import { useGetAllReviewsQuery } from "@/redux/api/reviewApi";
import { ArrowLeft, ShoppingCart, Star, Check, BookOpen } from "lucide-react";
import { use } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { handleAddToCart } from "@/Component/Page/cart/useHandleAddtocart";
import Link from "next/link";
import { TProduct } from "@/types/product/product";
import { useMemo } from "react";

interface AuthorBooksPageProps {
  params: Promise<{ id: string }>;
}

export default function AuthorBooksPage({ params }: AuthorBooksPageProps) {
  const { id } = use(params);
  const { data: author } = useGetSingleAuthorsQuery(id);
  const { data: authorBooksResponse, isLoading } = useGetProductsByAuthorQuery(id);
  const { data: reviewsData } = useGetAllReviewsQuery("");
  const [addedItems, setAddedItems] = React.useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  const authorBooks = useMemo(() => {
    const books = authorBooksResponse?.data || [];
    if (!reviewsData?.data) return books;
    
    return books.map((book: TProduct) => {
      const productReviews = reviewsData.data.filter(
        (review: { product: string | { _id: string }; status: string; _id: string }) => {
          const reviewProductId = typeof review.product === 'string' ? review.product : review.product?._id;
          return reviewProductId === book._id && review.status === "approved";
        }
      );
      const avgRating = productReviews.length
        ? productReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / productReviews.length
        : 0;
      
      return { ...book, averageRating: avgRating };
    });
  }, [authorBooksResponse, reviewsData]);

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
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < Math.floor(rating)
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/authors/${id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {author && (
              <>
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
                  {author.image ? (
                    <Image
                      src={author.image}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    All Books by {author.name}
                  </h1>
                  <p className="text-gray-600">
                    {authorBooks.length} books available
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Books Grid */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {authorBooks && authorBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {authorBooks.map((book) => (
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
                        {author?.name}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500">No books found by this author</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}