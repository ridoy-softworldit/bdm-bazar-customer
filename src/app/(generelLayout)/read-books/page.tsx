"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, X } from "lucide-react";
import { TProduct } from "@/types/product/product";

export default function ReadBooksPage() {
  const [selectedBook, setSelectedBook] = useState<TProduct | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/product`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        // Filter only book categories with valid PDF URLs
        const bookCategories = ['book', 'books', 'বই', 'novel', 'story', 'literature', 'fiction', 'non-fiction'];
        const bookProducts = result.data.filter((product: TProduct) => {
          const categoryNames = product.categoryAndTags?.categories?.map(cat => 
            typeof cat === 'string' ? cat : (cat as { name: string }).name
          ) || [];
          
          const isBookCategory = categoryNames.some(catName => 
            bookCategories.some(bookCat => 
              catName?.toLowerCase().includes(bookCat.toLowerCase())
            )
          );
          
          // Debug: log what's in the digital field
          if (product.productInfo.digital) {
            console.log('Digital URL:', product.productInfo.digital);
          }
          
          // Include books that have digital field OR preview images
          const hasDigital = product.productInfo.digital;
          const hasPreview = product.previewImg && product.previewImg.length > 0;
          
          return isBookCategory && (hasDigital || hasPreview);
        });
        
        setBooks(bookProducts);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const title = book.description.name || '';
    const author = book.bookInfo?.specification?.authors?.[0]?.name || 
                   book.categoryAndTags?.publisher || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           author.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openBook = (book: TProduct) => {
    const digitalUrl = book.productInfo.digital || '';
    
    // If it's a direct PDF, open it
    if (digitalUrl.includes('.pdf')) {
      window.open(digitalUrl, '_blank');
    } else if (book.previewImg && book.previewImg.length > 0) {
      // If preview images exist, show them as PDF pages
      setSelectedBook(book);
      setShowPreview(true);
    } else {
      alert('এই বইটির জন্য কোনো পূর্বরূপ উপলব্ধ নেই');
    }
  };

  const closePreview = () => {
    setSelectedBook(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            বই পড়ুন
          </h1>
          
          {/* Search */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="বই বা লেখকের নাম খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Books Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredBooks.map((book) => {
              const title = book.description.name;
              const author = book.bookInfo?.specification?.authors?.[0]?.name || 
                           book.categoryAndTags?.publisher || 'Unknown Author';
              const description = book.description.description;
              
              return (
                <Card key={book._id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-lg">
                      <Image
                        src={book.featuredImg}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <Button
                          onClick={() => openBook(book)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          পড়ুন
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-600">{author}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
                      
                      <Button
                        onClick={() => openBook(book)}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                      >
                        {book.previewImg && book.previewImg.length > 0 ? 'পূর্বরূপ দেখুন' : 'PDF পড়ুন'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">কোনো বই পাওয়া যায়নি</p>
          </div>
        )}
      </div>


      {/* Preview Modal */}
      {showPreview && selectedBook && selectedBook.previewImg && selectedBook.previewImg.length > 0 && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedBook.description.name}
              </h3>
              <button
                onClick={closePreview}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {selectedBook.previewImg.map((img, idx) => (
                  <div key={idx} className="flex justify-center">
                    <Image
                      src={img}
                      alt={`Page ${idx + 1}`}
                      width={600}
                      height={800}
                      className="max-w-full max-h-[70vh] object-contain shadow-lg rounded cursor-zoom-in hover:shadow-xl transition-shadow"
                      onClick={() => setZoomedImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-[95vw] max-h-[95vh] overflow-auto">
            <button
              onClick={() => setZoomedImage(null)}
              className="fixed top-4 right-4 z-[70] text-red-500 hover:text-red-700 bg-white hover:bg-red-50 p-2 rounded-full shadow-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={zoomedImage}
              alt="Zoomed preview"
              width={1200}
              height={1600}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}