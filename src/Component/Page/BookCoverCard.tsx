"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Book } from "@/types/boook";
import { Eye } from "lucide-react";

interface BookCoverCardProps {
  book: Book;
  onPreviewClick?: () => void;
}

export default function BookCoverCard({ book, onPreviewClick }: BookCoverCardProps) {
  const [selectedImage, setSelectedImage] = useState<string>(book.image);

  return (
    <div className="space-y-4">
      {/* Main image card */}
      <Card className="py-0 relative overflow-hidden border-2 border-gray-200 transition-shadow duration-300 rounded-md">
        <CardContent className="p-3">
          <div className="relative">
            {/* Discount Badge */}
            {book.discount && book.discount > 0 && (
              <Badge className="absolute -top-3 -left-3 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-base font-bold shadow-lg">
                -{book.discount}%
              </Badge>
            )}
            
            {/* Featured Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={selectedImage}
                alt={book.title}
                width={400}
                height={533}
                className="object-cover h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Look Inside Button */}
      {book.previewImg && book.previewImg.length > 0 && (
        <Button
          onClick={onPreviewClick}
          variant="outline"
          className="w-full gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Eye className="w-4 h-4" />
          Look Inside
        </Button>
      )}

      {/* Thumbnail Previews */}
      {book.previewImg && book.previewImg.length > 0 && (
        <div className="flex justify-center gap-3 flex-wrap">
          {/* Main image thumbnail */}
          <div
            onClick={() => setSelectedImage(book.image)}
            className={`w-18 h-18 border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedImage === book.image
                ? " ring-2 ring-blue-300 ring-offset-1 shadow-md"
                : " hover:border-blue-400 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={book.image}
              alt="Main cover"
              width={80}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Preview thumbnails */}
          {book.previewImg.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-18 h-18 border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedImage === img
                  ? "ring-2 ring-blue-300 ring-offset-1 shadow-md"
                  : " hover:border-blue-400  opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Preview ${idx + 1}`}
                width={80}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}