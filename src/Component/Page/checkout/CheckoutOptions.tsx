"use client";

import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { User, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutOptionsProps {
  onGuestCheckout: () => void;
  onUserCheckout: () => void;
}

export default function CheckoutOptions({
  onGuestCheckout,
  onUserCheckout,
}: CheckoutOptionsProps) {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const handleUserCheckout = () => {
    if (user?.id) {
      onUserCheckout();
    } else {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Choose Checkout Option</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guest Checkout */}
        <div 
          onClick={onGuestCheckout}
          className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <User className="w-8 h-8 text-gray-600 group-hover:text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Checkout as Guest</h3>
            <p className="text-sm text-gray-600">
              Quick checkout without an account.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>✓ Fast & simple</div>
              <div>✓ No registration</div>
            </div>
          </div>
        </div>

        {/* User Checkout */}
        <div 
          onClick={handleUserCheckout}
          className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <UserCheck className="w-8 h-8 text-gray-600 group-hover:text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.id ? "Checkout as User" : "Login & Checkout"}
            </h3>
            <p className="text-sm text-gray-600">
              {user?.id 
                ? "Use saved info and track orders."
                : "Login or create account for better experience."
              }
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>✓ User Profile</div>
              <div>✓ Order History & tracking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}