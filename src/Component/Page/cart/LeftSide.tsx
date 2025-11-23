"use client";

import { useDispatch } from "react-redux";
import {
  CartItem,
  removeItem,
  updateQuantity,
  toggleSelectItem,
} from "@/lib/slices/cartSlice";
import Image from "next/image";
import { Trash2, ClockIcon, Heart } from "lucide-react";
interface LeftSideProps {
  items: CartItem[];
  allSelected: boolean; // <--- must be boolean
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectItem: (id: number) => void;
  handleQuantityChange: (id: number, amount: number) => void;
  originalTotal: number;
}

const EmiIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2 text-green-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export default function LeftSide({ items }: LeftSideProps) {
  const dispatch = useDispatch();

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Your Cart ({items.length} items)
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-start space-x-4 relative"
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                checked={item.selected}
                onChange={() => dispatch(toggleSelectItem(item.id))}
              />

              <div className="relative flex-shrink-0">
                <Image
                  src={item?.image || "/placeholder.jpg"}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {item.name || "Unnamed Product"}
                </h3>

                <p className="text-xs text-gray-600 mb-2">
                  {item.brand || "Unknown Brand"}
                </p>

                <div className="flex items-center space-x-2 mb-2">
                  {item.originalPrice && (
                    <span className="text-sm text-red-500 line-through">
                      {item.originalPrice.toLocaleString()} Tk.
                    </span>
                  )}
                  <span className="text-base font-bold text-gray-900">
                    {item.price.toLocaleString()} Tk.
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                  >
                    <span>
                      <Heart className=" h-4 w-4 hover:text-red-700" />
                    </span>
                    <span className="text-sm">Wishlist</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                <button
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: 1 }))
                  }
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                >
                  +
                </button>

                <span className="text-base font-semibold">{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: -1 }))
                  }
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                >
                  −
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
          <ClockIcon />
          <span className="ml-2">এখনি রিটার্ন সুবিধা</span>
        </div>
        <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
          <EmiIcon />
          <span>EMI তে কেনাকাটার সুবিধা</span>
        </div>
      </div>
    </div>
  );
}
