import { useState } from "react";
import { RelatedBook } from "@/types/boook";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface RelatedBooksProps {
  books: RelatedBook[];
  isBookCategory?: boolean;
}

export default function RelatedBooks({ books, isBookCategory = true }: RelatedBooksProps) {
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 5;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - pageSize, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + pageSize, books.length - pageSize)
    );
  };

  if (books.length === 0) {
    return (
      <div className="lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {isBookCategory ? "Related Books" : "Related Products"}
        </h2>
        <p className="text-gray-500 text-sm">
          {isBookCategory ? "No related books available at the moment." : "No related products available at the moment."}
        </p>
      </div>
    );
  }

  const visibleBooks = books.slice(startIndex, startIndex + pageSize);

  return (
    <div className="lg:col-span-1">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 pb-2 border-b border-gray-200">
        {isBookCategory ? "Related Books" : "Related Products"}
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {visibleBooks.map((book) => (
          <Link href={`/product/${book.id}`} key={book.id}>
            <div className="bg-white border border-gray-200 rounded-md p-3 hover:shadow-md transition-shadow duration-200 cursor-pointer h-[130px]">
              <div className="flex gap-3 h-full">
              {/* Book Cover */}
              <div className="flex-shrink-0 w-[80px]">
                <div className="relative w-full h-full bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {book.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 truncate mb-1">
                    By {book.author}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-orange-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < Math.floor(book.stars) ? '#f59e0b' : '#d1d5db' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({book.reviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-base font-semibold text-orange-600">
                    ৳{book.price}
                  </span>
                  {book.originalPrice > book.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ৳{book.originalPrice}
                      </span>
                      <span className="text-xs font-medium text-green-600">
                        {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Buttons */}
      {books.length > pageSize && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(startIndex + pageSize, books.length)} of {books.length}
          </span>
          
          <button
            onClick={handleNext}
            disabled={startIndex + pageSize >= books.length}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}