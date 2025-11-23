"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { removeFromWishlist } from "@/lib/slices/wishlistSlice";
import { addToCart } from "@/lib/slices/cartSlice";
import { RootState } from "@/redux/store";
import { WishlistItem } from "@/lib/slices/wishlistSlice";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
        selected: true,
        stock: undefined, // Not available in wishlist, can be fetched if needed
        superDeal: item.originalPrice && item.price < item.originalPrice,
      })
    );
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your wishlist to see them here.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            <div className="relative">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                width={300}
                height={400}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2 truncate">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold">TK. {item.price}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-gray-500 line-through">TK. {item.originalPrice}</span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}