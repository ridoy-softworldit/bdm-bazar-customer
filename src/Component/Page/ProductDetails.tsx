"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Image from "next/image";
import OfferNotices from "./OfferNotices";
import { Book } from "@/types/boook";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/slices/cartSlice";
import { addToWishlist } from "@/lib/slices/wishlistSlice";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ProductDetailsProps extends Book {
  title: string;
  showPreview?: boolean;
  onPreviewClose?: () => void;
}

export default function ProductDetails({
  title,
  author,
  category,
  price,
  originalPrice,
  discount,
  stars: ratings,
  reviews,
  inStock,
  stockCount,
  description,
  id,
  image,
  previewImg,
  showPreview: externalShowPreview,
  onPreviewClose,
}: ProductDetailsProps) {
  const router = useRouter(); // ✅ initialize router
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const [internalShowPreview, setInternalShowPreview] = useState<boolean>(false);
  const showPreview = externalShowPreview !== undefined ? externalShowPreview : internalShowPreview;
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === id);

  const increment = () => {
    if (!stockCount || quantity < stockCount) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    dispatch(
      addToCart({
        id,
        name: title,
        brand: author,
        image: image || "/placeholder.jpg",
        price,
        originalPrice,
        stock: stockCount,
        superDeal: discount !== undefined && discount > 0,
        selected: true,
        quantity,
      })
    );
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    handleAddToCart();
    setTimeout(() => router.push("/checkout"), 200); // small delay (200ms)
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) return;
    dispatch(
      addToWishlist({
        id,
        name: title,
        brand: author,
        image: image || "/placeholder.jpg",
        price,
        originalPrice,
      })
    );
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const shouldShowReadMore = description && description.length > 150;

  return (
    <>
      <div className="space-y-4">
        {/* Product Info */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-blue-600 mb-2 text-sm">
            by <span className="cursor-pointer hover:underline">{author}</span>
          </p>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(ratings)
                      ? "fill-orange-400 text-orange-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviews} reviews)</span>
          </div>

          <div className="mb-3">
            <span className="text-sm text-gray-600">Category: </span>
            <span className="text-blue-600 text-sm">
              {Array.isArray(category)
                ? category
                    .map((cat) => (typeof cat === "string" ? cat : cat.name))
                    .join(", ")
                : category}
            </span>
          </div>

          {description && (
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>
                {showFullDescription ? description : truncateText(description)}
              </p>
              {shouldShowReadMore && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:underline text-sm mt-1 flex items-center gap-1"
                >
                  {showFullDescription ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Price & Stock */}
        <div className="space-y-3 py-3 border-y">
          <div className="flex items-center gap-3">
            {originalPrice > price && (
              <span className="text-lg text-gray-500 line-through">
                TK. {originalPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              TK. {price}
            </span>
            {discount && discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white">
                {discount}% OFF
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                inStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
            {inStock && stockCount !== undefined && (
              <span className="text-red-600 text-sm">
                (only {stockCount} left)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrement}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={increment}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Offer Notices */}
        <OfferNotices
          items={[
            "৬০% পর্যন্ত ছাড় বাংলা-ইংরেজিশ স্টকে থাকা বিদেশি বইয়ে!",
            "৫% এক্সট্রা ছাড় (SUPER5 কোডে) ও ন্যূনতম ৩০০৳ গিফট ভাউচার ৫০০৳+ অর্ডারে!",
          ]}
        />

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              variant="outline"
              className="flex-1 gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <ShoppingCart className="w-4 h-4" />
              Add To Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buy Now
            </Button>
          </div>

          {/* Wishlist & Share */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={handleAddToWishlist}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isInWishlist
                  ? "text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isInWishlist ? "fill-red-500" : ""}`}
              />
              Add to Wishlist
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewImg && previewImg.length > 0 && (
        <div className="fixed inset-0 backdrop-blur-xs bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Look Inside: {title}</h3>
              <button
                onClick={() => {
                  if (onPreviewClose) {
                    onPreviewClose();
                  } else {
                    setInternalShowPreview(false);
                  }
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {previewImg.map((img, idx) => (
                  <div key={idx} className="flex justify-center">
                    <Image
                      src={img}
                      alt={`Preview page ${idx + 1}`}
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
          <button
            onClick={() => setZoomedImage(null)}
            className="fixed top-4 right-4 z-[70] text-red-500 hover:text-red-700 bg-white hover:bg-red-50 p-2 rounded-full shadow-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-[95vw] max-h-[95vh] overflow-auto">
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
    </>
  );
}
