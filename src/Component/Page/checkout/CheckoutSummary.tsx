"use client";

import { Gift } from "lucide-react";
import Link from "next/link";

interface CheckoutSummaryProps {
  mode?: "cart" | "confirm"; // default: cart
  subtotal: number;
  deliveryCharge: number;
  onConfirm?: () => void; // for confirm page
}

export default function CheckoutSummary({
  mode = "cart",
  subtotal,
  deliveryCharge,
  onConfirm,
}: CheckoutSummaryProps) {
  const payableTotal = subtotal + deliveryCharge;
  const rewardPoints = Math.floor(subtotal / 10);

  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h2 className="text-lg font-semibold border-b border-dashed pb-4">
        Checkout Summary
      </h2>

      <div className="space-y-3 mt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{subtotal.toLocaleString()} TK.</span>
        </div>

        <div className="flex justify-between border-t border-dashed pt-3">
          <span className="text-gray-600">
            Delivery & Website Service Charge
          </span>
          <span>{deliveryCharge.toLocaleString()} TK.</span>
        </div>

        <div className="flex justify-between border-t border-dashed pt-3">
          <span className="text-gray-600">Total</span>
          <span>{payableTotal.toLocaleString()} TK.</span>
        </div>

        <div className="border-t border-dashed pt-3 mt-3 flex justify-between font-bold">
          <span>Payable Total</span>
          <span>{payableTotal.toLocaleString()} TK.</span>
        </div>
      </div>

      {/* Reward Points (only in cart page) */}
      {mode === "cart" && (
        <div className="mt-6 p-3 flex items-center justify-between border-2 border-orange-100 rounded-md bg-orange-50">
          <span className="text-sm text-gray-700">
            আপনি অর্জন করবেন {rewardPoints} পয়েন্ট
          </span>
          <Gift />
        </div>
      )}

      {/* Dynamic Button */}
      {mode === "cart" ? (
        <Link
          href={"/checkout"} // ✅ now goes to checkout page, not confirm
          className="mt-6 w-full bg-[#4A90E2] text-white py-3 rounded-md flex items-center justify-center font-semibold hover:bg-blue-600 transition-colors"
        >
          অর্ডার করতে এগিয়ে যান
        </Link>
      ) : (
        <button
          onClick={onConfirm}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
        >
          অর্ডার নিশ্চিত করুন ৳{payableTotal.toLocaleString()}
        </button>
      )}

      {/* Gift Order (only in cart page) */}
      {mode === "cart" && (
        <>
          <button className="mt-4 w-full border-2 border-[#6F42C1] text-[#6F42C1] py-3 rounded-md font-semibold hover:bg-purple-50 transition-colors">
            উপহার হিসেবে অর্ডার করুন
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Apply Promo Code or Voucher Code on the Shipping Page
          </p>
        </>
      )}
    </div>
  );
}
