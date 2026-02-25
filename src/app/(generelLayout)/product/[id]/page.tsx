/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(generelLayout)/product/[id]/page.tsx
"use client";

import BookCoverCard from "@/Component/Page/BookCoverCard";
import ProductDetails, { renderSpecifications } from "@/Component/Page/ProductDetails";
import RelatedBooks from "@/Component/Page/RelatedBooks";
import { useGetAllReviewsQuery } from "@/redux/api/reviewApi";
import { ApiBook, ApiResponse, Book, RelatedBook } from "@/types/boook";
import { useSession } from "next-auth/react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  useGetApprovedReviewsByProductQuery,
  useCreateReviewMutation,
} from "@/redux/api/reviewApi";
import { Star } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

interface BookProductPageProps {
  params: Promise<{ id: string }>;
}
export default function BookProductPage({ params }: BookProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [mainBook, setMainBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [isBookCategory, setIsBookCategory] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string>("");
  const { data: session } = useSession();
  const user = useAppSelector(selectCurrentUser);
  const { data: approvedReviews } = useGetApprovedReviewsByProductQuery(id);

  const [createReview] = useCreateReviewMutation();

  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'specifications'>('reviews');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isLoggedIn = session?.user || user;
    if (!isLoggedIn) return toast.error("Please log in first");

    const userId = (session?.user as any)?.id || (session?.user as any)?._id || user?._id || user?.id;
    if (!userId) return toast.error("User ID not found");

    const formData = new FormData();
    formData.append("user", userId);
    formData.append("product", id);
    formData.append("rating", rating.toString());
    formData.append("description", description);

    photos.forEach((photo) => formData.append("photos", photo));

    try {
      setIsSubmitting(true);
      const res = await createReview(formData).unwrap();
     
      toast.success("Review submitted successfully!");
      setDescription("");
      setPhotos([]);
      setRating(0);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // session
  // {name: 'Adnan Nahid', email: 'nahidhasan3.1416@gmail.com', id: '68f4ed7af4f8ff6b8adfdebb', role: 'customer', gender: 'male', …}
  // email: "nahidhasan3.1416@gmail.com"
  // gender: "male"
  // id: "68f4ed7af4f8ff6b8adfdebb"
  // name: "Adnan Nahid"
  // role: "customer"
  // walletPoint: 100

  const { data: reviews, isLoading } = useGetAllReviewsQuery("");
 

  useEffect(() => {
    if (!id) return;

    async function fetchMainBook() {
      try {
    const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/product/${id}`
        );
        const result: ApiResponse = await response.json();

        if (result.success && !Array.isArray(result.data)) {
          const productData: ApiBook = result.data;
          
          // Fetch brand if brand ID exists
          if (productData.productInfo?.brand) {
            try {
              const brandResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API}/brand/${productData.productInfo.brand}`
              );
              const brandResult = await brandResponse.json();
              if (brandResult.success && brandResult.data?.name) {
                setBrandName(brandResult.data.name);
              }
            } catch (err) {
              console.error("Failed to fetch brand:", err);
            }
          }
          
          const mappedBook: Book = {
            id: productData._id,
            title: productData.description.name,
            title_bn: productData.description.name_bn,
            author:
              productData.bookInfo?.specification?.authors?.[0]?.name ||
              productData.categoryAndTags?.publisher ||
              "Brand/Publisher",
            authorId: productData.bookInfo?.specification?.authors?.[0]?._id,
            authors: productData.bookInfo?.specification?.authors,
            image: productData.featuredImg,
            stars: productData.averageRating,
            reviews: productData.reviewCount,
            price: productData.productInfo.salePrice || productData.productInfo.price,
            originalPrice: productData.productInfo.price,
            totalDiscount: productData.productInfo.totalDiscount || 0,
            description: productData.description.description,
            description_bn: productData.description.description_bn,
            category: productData.categoryAndTags.categories,
            inStock: productData.productInfo.inStock,
            stockCount: productData.productInfo.quantity,
            isbn: productData.bookInfo?.specification?.isbn,
            binding: productData.bookInfo?.specification?.binding,
            numberOfPages: productData.bookInfo?.specification?.numberOfPages,
            edition: productData.bookInfo?.specification?.edition,
            editionYear: productData.bookInfo?.specification?.editionYear,
            publisher: productData.bookInfo?.specification?.publisher || productData.categoryAndTags?.publisher,
            language: productData.bookInfo?.specification?.language,
            country: productData.bookInfo?.specification?.country,
            genre: productData.bookInfo?.genre,
            translator: productData.bookInfo?.translator,
            previewImg: productData.previewImg,
            previewPdf: productData.previewPdf,
          };
          setMainBook(mappedBook);

          const categoryName = productData.categoryAndTags?.categories?.[0]?.name;
          // Check if it's a book category
          const bookCategories = ['book', 'books', 'বই', 'novel', 'story', 'literature', 'fiction', 'non-fiction'];
          const isBook = categoryName ? bookCategories.some(cat => 
            categoryName.toLowerCase().includes(cat.toLowerCase())
          ) : false;
          setIsBookCategory(isBook);
          
          if (categoryName) {
            await fetchRelatedBooks([categoryName]);
          }
        } else {
          setError("Failed to fetch book data");
        }
      } catch (err) {
        setError("An error occurred while fetching the book");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelatedBooks(categoryNames: string[]) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/product`
        );
        const result: ApiResponse = await response.json();

        if (result.success && Array.isArray(result.data) && reviews?.data) {
          const filteredBooks: RelatedBook[] = await Promise.all(
            result.data
              .filter((book: ApiBook) => {
                if (book._id === id) return false;
                const categoriesMatch = book.categoryAndTags?.categories?.some(
                  (c) =>
                    categoryNames.some(
                      (name) =>
                        c?.name?.trim().toLowerCase() === name.trim().toLowerCase()
                    )
                );
                return categoriesMatch;
              })
              .slice(0, 4)
              .map(async (bookData: ApiBook, index: number) => {
                const categoryName = bookData.categoryAndTags?.categories?.[0]?.name;
                const bookCategories = ['book', 'books', 'বই', 'novel', 'story', 'literature', 'fiction', 'non-fiction'];
                const isBook = categoryName ? bookCategories.some((cat: string) => 
                  categoryName.toLowerCase().includes(cat.toLowerCase())
                ) : false;

                let author = "Brand/Publisher";
                if (isBook) {
                  author = bookData.bookInfo?.specification?.authors?.[0]?.name ||
                    bookData.categoryAndTags?.publisher ||
                    "Unknown Author";
                } else if (bookData.productInfo?.brand && typeof bookData.productInfo.brand === 'string') {
                  try {
                    const brandRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/brand/${bookData.productInfo.brand}`);
                    const brandData = await brandRes.json();
                    if (brandData.success && brandData.data?.name) {
                      author = brandData.data.name;
                    }
                  } catch (err) {
                    console.error('Brand fetch error:', err);
                  }
                }

                const productReviews = reviews.data.filter(
                  (review: any) => {
                    const reviewProductId = typeof review.product === 'string' ? review.product : review.product?._id;
                    return reviewProductId === bookData._id && review.status === "approved";
                  }
                );
                const avgRating = productReviews.length
                  ? productReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / productReviews.length
                  : 0;

                return {
                  id: bookData._id,
                  title: bookData.description.name,
                  author,
                  cover: bookData.featuredImg,
                  bgColor: getBgColor(index),
                  stars: avgRating,
                  reviews: productReviews.length,
                  price: bookData.productInfo.salePrice || bookData.productInfo.price,
                  originalPrice: bookData.productInfo.price,
                  description: bookData.description.description,
                };
              })
          );

          setRelatedBooks(filteredBooks);
        }
      } catch (err) {
        console.error("Failed to fetch related books:", err);
      }
    }

    function getBgColor(index: number): string {
      const colors = [
        "bg-yellow-200",
        "bg-orange-200",
        "bg-red-200",
        "bg-gray-200",
      ];
      return colors[index % colors.length];
    }

    fetchMainBook();
  }, [id, reviews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || !mainBook) {
    return (
      <div className="min-h-screen bg-white p-6">
        {error || "Book not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm p-5">
            <BookCoverCard 
              book={mainBook} 
              onPreviewClick={() => setShowPreview(true)}
            />
            <div className="flex flex-col">
              <ProductDetails
                {...mainBook}
                title={mainBook.binding ? `${mainBook.title} (${mainBook.binding})` : mainBook.title}
                showPreview={showPreview}
                onPreviewClose={() => setShowPreview(false)}
                brandName={brandName}
                isBookCategory={isBookCategory}
                language={mainBook.language}
                country={mainBook.country}
                genre={mainBook.genre}
                translator={mainBook.translator}
                authors={mainBook.authors}
                stars={
                  approvedReviews?.data?.length
                    ? approvedReviews.data.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.data.length
                    : mainBook.stars
                }
                reviews={approvedReviews?.data?.length || mainBook.reviews}
              />
            </div>
          </div>
          <div className=" bg-gray-100 p-5">
            <RelatedBooks books={relatedBooks} isBookCategory={isBookCategory} />
          </div>
        </div>
        {/* Reviews & Specifications Section */}
        <div className="mt-16">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer Reviews
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'specifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Specifications
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'reviews' ? (
            <div>
            <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            {approvedReviews?.data?.length > 0 && (
              <span className="text-sm text-gray-500 font-medium">
                {approvedReviews.data.length} review
                {approvedReviews.data.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {approvedReviews?.data?.length ? (
              approvedReviews.data.map((review: any) => (
                <div
                  key={review._id}
                  className="p-4 sm:p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Avatar & User Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {review.user?.name}
                        </p>
                        <p className="text-gray-400">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-1 text-gray-600 text-sm">
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  {/* Review Description */}
                  <p className="text-gray-700 text-sm sm:text-base">
                    {review.description}
                  </p>

                  {/* Review Photos */}
                  {review.photos?.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {review.photos.filter((photo: string) => photo).map((photo: string, idx: number) => (
                        <Image
                          key={idx}
                          src={photo}
                          alt={`Review photo ${idx + 1}`}
                          width={500}
                          height={300}
                          className="w-full h-20 sm:h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Star className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>

          {/* Review Form */}
          {session?.user ? (
            <form
              onSubmit={handleReviewSubmit}
              className="mt-8 p-6 bg-white rounded-xl shadow border border-gray-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Write a Review
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 w-16">
                  Rating:
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition-transform duration-150 ${
                        rating >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos (Up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setPhotos(Array.from(e.target.files || []).slice(0, 5))
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {/* Photo previews */}
                {photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {photos.map((file: File, idx: number) => (
                      <div key={idx} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          width={500}
                          height={300}
                          className="w-full h-20 sm:h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotos(photos.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {photos.length >= 5 && (
                  <p className="text-sm text-teal-600 mt-1">
                    Maximum 5 photos reached.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !rating || !description.trim()}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="mt-8 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Star className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                Please{" "}
                <span
                  className="text-teal-600 hover:underline cursor-pointer"
                  onClick={() => router.push(`/auth/login?redirect=/product/${id}`)}
                >
                  log in
                </span>{" "}
                to write a review.
              </p>
            </div>
          )}
        </div>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-xl shadow border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h2>
              {renderSpecifications({
                publisher: mainBook.publisher,
                edition: mainBook.edition,
                editionYear: mainBook.editionYear,
                numberOfPages: mainBook.numberOfPages,
                language: mainBook.language,
                country: mainBook.country,
                binding: mainBook.binding,
                isbn: mainBook.isbn,
                genre: mainBook.genre,
                translator: mainBook.translator,
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
