"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Info, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Define TypeScript interfaces based on the provided data structure
interface TotalAmount {
  subTotal: number;
  tax: number;
  shipping: { name: string; type: string };
  discount: number;
  total: number;
}

interface OrderInfo {
  orderBy: string;
  productInfo: string;
  trackingNumber: string;
  status: string;
  isCancelled: boolean;
  quantity: number;
  totalAmount: TotalAmount;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderData {
  _id: string;
  orderInfo: OrderInfo[];
  customerInfo: CustomerInfo;
  paymentInfo: string;
  deliveryCharge?: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/order/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch order");

        const resJson = await response.json();
        setOrderData(resJson.data); // ✅ take only the "data"
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);
 
  const handleCopy = (trackingNumber: string) => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (!orderData || !orderData.orderInfo?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">No order data found</p>
      </div>
    );
  }

  const { orderInfo, customerInfo, paymentInfo, deliveryCharge, totalAmount } = orderData;

  // Calculate aggregate totals from all orderInfo items
  const aggregateTotals: TotalAmount = orderInfo.reduce(
    (acc, item) => ({
      subTotal: acc.subTotal + item.totalAmount.subTotal,
      tax: acc.tax + item.totalAmount.tax,
      discount: acc.discount + (item.totalAmount.discount || 0),
      total: acc.total + item.totalAmount.total,
      shipping: {
        name: item.totalAmount.shipping.name,
        type: item.totalAmount.shipping.type,
      },
    }),
    {
      subTotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      shipping: { name: "", type: "" },
    }
  );

  // Get delivery charge from order data
  const shippingCost = deliveryCharge || 0;

  const paymentMethod =
    paymentInfo === "cash-on" ? "Cash On Delivery" : paymentInfo || "N/A";
  const shippingAddress = `${customerInfo.address}, ${customerInfo.city},`;

  // Mask phone number (handle variable length)
  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 7) return phone;
    const firstThree = phone.slice(0, 3);
    const lastThree = phone.slice(-3);
    return `${firstThree}****${lastThree}`;
  };
  const maskedPhone = maskPhoneNumber(customerInfo.phone);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main Content - Left Side */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
              {/* Header Section */}
              <div className="flex items-start gap-3 sm:gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle
                      className="w-7 h-7 sm:w-10 sm:h-10 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Thank you for your order
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base text-gray-700">Order Number: </span>
                    {orderInfo.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-semibold text-sm sm:text-base text-gray-900 break-all">
                          {item.trackingNumber || "N/A"}
                        </span>
                        <button
                          onClick={() => handleCopy(item.trackingNumber)}
                          className="px-2 sm:px-3 py-1 border-2 border-cyan-500 text-cyan-500 rounded hover:bg-cyan-50 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
                <p className="text-sm sm:text-base text-gray-700">
                  Your order confirmation will be sent to you via email and SMS.
                </p>
              </div>

              {/* Contact, Shipping, Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Contact */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Contact</h2>
                  <div className="text-gray-700 text-sm sm:text-base">
                    <p>{maskedPhone}</p>
                    <p className="text-xs sm:text-sm mt-1 break-all">{customerInfo.email}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                    Shipping Address
                  </h2>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    {shippingAddress}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                    Payment Method
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base">{paymentMethod}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Status: {orderInfo[0]?.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-sm sm:text-base text-gray-700">Need Help?</span>
                <a
                  href="#"
                  className="text-cyan-500 hover:text-cyan-600 font-medium text-sm sm:text-base"
                >
                  Contact us
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link href="/">
                  <button className="w-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-cyan-500 text-cyan-500 rounded hover:bg-cyan-50 transition-colors font-medium text-sm sm:text-base">
                    Continue Shopping
                  </button>
                </Link>
                <Link href="/dashboard/orders">
                  <button className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm sm:text-base">
                    Track Order
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>৳ {aggregateTotals.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span className="text-xs sm:text-sm">Delivery and Website Service Charge</span>
                  <span>৳ {shippingCost}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Total</span>
                  <span>৳ {aggregateTotals.subTotal + shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-sm sm:text-base">
                  <span>Payable</span>
                  <span>৳ {totalAmount}</span>
                </div>
              </div>

              {/* Rewards Badge */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg p-3 sm:p-4 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl sm:text-2xl">🎁</span>
                </div>
                <p className="text-white text-sm font-medium mb-1">
                  অভিনন্দন {customerInfo.firstName}
                </p>
                <p className="text-white text-xs">
                  সফল অর্ডারে পাবেন {Math.floor(totalAmount / 10)} পয়েন্টস,
                </p>
                <p className="text-white text-xs">
                  আপনার সকল পয়েন্ট দেখতে{" "}
                  <a href="#" className="underline font-medium">
                    ক্লিক করুন
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
