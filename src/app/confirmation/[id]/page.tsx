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

  const { orderInfo, customerInfo, paymentInfo, totalAmount } = orderData;

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

  // Calculate shipping cost: total = subTotal + tax + shipping - discount
  const shippingCost = 60;

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Left Side */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle
                      className="w-10 h-10 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Thank you for your order
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-700">Order Number: </span>
                    {orderInfo.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {item.trackingNumber || "N/A"}
                        </span>
                        <button
                          onClick={() => handleCopy(item.trackingNumber)}
                          className="px-3 py-1 border-2 border-cyan-500 text-cyan-500 rounded hover:bg-cyan-50 transition-colors text-sm font-medium"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-gray-700">
                  Your order confirmation will be sent to you via email and SMS.
                </p>
              </div>

              {/* Contact, Shipping, Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Contact */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">Contact</h2>
                  <div className="text-gray-700">
                    <p>{maskedPhone}</p>
                    <p className="text-sm mt-1">{customerInfo.email}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">
                    Shipping Address
                  </h2>
                  <p className="text-gray-700 text-sm mt-1">
                    {shippingAddress}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">
                    Payment Method
                  </h2>
                  <p className="text-gray-700">{paymentMethod}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: {orderInfo[0]?.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Need Help?</span>
                <a
                  href="#"
                  className="text-cyan-500 hover:text-cyan-600 font-medium"
                >
                  Contact us
                </a>
              </div>
              <div className="flex gap-3">
                <Link href="/">
                  <button className="px-6 py-3 border-2 border-cyan-500 text-cyan-500 rounded hover:bg-cyan-50 transition-colors font-medium">
                    Continue Shopping
                  </button>
                </Link>
                <button className="px-6 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium">
                  Track Order
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>৳ {aggregateTotals.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery and Website Service Charge</span>
                  <span>৳ {shippingCost}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between  text-gray-700">
                  <span>Total</span>
                  <span>৳ {aggregateTotals.total}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Payable</span>
                  <span>৳ {totalAmount}</span>
                </div>
              </div>

              {/* Rewards Badge */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎁</span>
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
