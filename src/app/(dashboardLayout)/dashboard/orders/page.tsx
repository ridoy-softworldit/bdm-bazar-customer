/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Eye, Search, Copy } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "at-local-facility":
      return "bg-purple-100 text-purple-800";
    case "out-for-delivery":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MyOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackingError, setTrackingError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [productDetails, setProductDetails] = useState<{[key: string]: any}>({});
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const user: any = useAppSelector(selectCurrentUser);

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTrackingId(trackingNumber);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  // Fetch logged-in user orders
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order/my-order/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setOrders(data.data);
          setFilteredOrders(data.data);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // 🔍 Handle search for logged-in users
  useEffect(() => {
    if (!user?.id) return;

    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order: any) =>
        String(order.orderInfo[0]?.trackingNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders, user?.id]);

  // 🔍 Handle tracking for non-logged-in users
  const handleTrackOrder = async () => {
    if (!searchTerm.trim()) {
      setTrackingError("Please enter a tracking number");
      return;
    }

    setIsSearching(true);
    setTrackingError("");
    setTrackedOrder(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/order/track/${searchTerm.trim()}`
      );
      const data = await response.json();

      if (data?.success && data?.data) {
        setTrackedOrder(data.data);
      } else {
        setTrackingError("No order found with this tracking number");
      }
    } catch (err) {
      setTrackingError("Error tracking order. Please try again.");
      console.error("Error tracking order:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    // No need to fetch product details as they're already in the order
  };

  // Non-logged-in user view (Track order)
  if (!user?.id) {
    return (
      <div className="w-full px-4 md:px-6">
        <div className="bg-white w-full max-w-4xl mx-auto rounded-md overflow-hidden border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-gray-600">
              Enter your tracking number to see your order details
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-5 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter Tracking Number (e.g., 1234567890)"
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTrackingError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTrackOrder();
                }}
              />

              <Button
                onClick={handleTrackOrder}
                disabled={isSearching || !searchTerm.trim()}
                className=" h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                {isSearching ? "Searching..." : "Track Order"}
              </Button>
            </div>

            {trackingError && (
              <p className="text-red-600 text-sm text-center">
                {trackingError}
              </p>
            )}
          </div>

          {/* Display tracked order details */}
          {trackedOrder && (
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">
                  Order Details - {trackedOrder.orderInfo[0]?.trackingNumber}
                </h2>
                <Badge
                  className={`rounded-full px-3 py-1 ${getStatusVariant(
                    trackedOrder.orderInfo[0]?.status
                  )}`}
                >
                  {trackedOrder.orderInfo[0]?.status}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Shipping Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-medium text-gray-900">
                      {trackedOrder.customerInfo?.firstName}{" "}
                      {trackedOrder.customerInfo?.lastName}
                    </div>
                    <div>{trackedOrder.customerInfo?.phone}</div>
                    <div>{trackedOrder.customerInfo?.address}</div>
                    <div>
                      {trackedOrder.customerInfo?.area},{" "}
                      {trackedOrder.customerInfo?.city}
                    </div>
                    <div>
                      {trackedOrder.customerInfo?.country} -{" "}
                      {trackedOrder.customerInfo?.postalCode}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Order Summary
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Payment Method:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {trackedOrder.paymentInfo}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Order Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(trackedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                      <span>Total Amount:</span>
                      <span>৳{trackedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {trackedOrder.orderInfo.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4"
                    >
                      {item.productInfo?.featuredImg && (
                        <Image
                          src={item.productInfo.featuredImg}
                          alt="Product"
                          width={60}
                          height={20}
                          className="object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.productInfo?.description?.name || "Product"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.productInfo?.description?.description}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-600 mt-2">
                          <span>Qty: {item.quantity}</span>
                          <span>
                            Price: ৳{item.productInfo?.productInfo?.price}
                          </span>
                          <span className="font-medium">
                            Subtotal: ৳{item.totalAmount.subTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!trackedOrder && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>Tip:</strong> Your tracking number was sent to your
                email after placing the order
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Logged-in user view (My Orders)
  return (
    <div className="w-full px-4 md:px-6">
      <div className="bg-white w-full max-w-6xl mx-auto rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by Tracking ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No orders found.</p>
          ) : (
            <>
              {/* Desktop Table */}
              <table className="hidden md:table w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-500 uppercase text-sm tracking-wider">
                    <th className="text-left py-3 px-6">Tracking ID</th>
                    <th className="text-left py-3 px-6">Date</th>
                    <th className="text-left py-3 px-6">Status</th>
                    <th className="text-left py-3 px-6">Total</th>
                    <th className="text-left py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <td className="py-4 px-6 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{order.orderInfo[0]?.trackingNumber}</span>
                          <button
                            onClick={() => handleCopyTracking(order.orderInfo[0]?.trackingNumber)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy tracking number"
                          >
                            <Copy className="h-3 w-3 text-gray-500" />
                          </button>
                          {copiedTrackingId === order.orderInfo[0]?.trackingNumber && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-3 py-1 text-sm ${getStatusVariant(
                            order.orderInfo[0]?.status
                          )}`}
                        >
                          {order.orderInfo[0]?.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        ৳{order.totalAmount}
                      </td>
                      <td className="py-4 px-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 p-4">
                {filteredOrders.map((order: any) => (
                  <div key={order._id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Tracking ID</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{order.orderInfo[0]?.trackingNumber}</p>
                          <button
                            onClick={() => handleCopyTracking(order.orderInfo[0]?.trackingNumber)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy tracking number"
                          >
                            <Copy className="h-3 w-3 text-gray-500" />
                          </button>
                          {copiedTrackingId === order.orderInfo[0]?.trackingNumber && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </div>
                      <Badge className={`rounded-full px-2 py-1 text-xs ${getStatusVariant(order.orderInfo[0]?.status)}`}>
                        {order.orderInfo[0]?.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-medium">৳{order.totalAmount}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg bg-orange-50 border-orange-200 text-orange-700"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal for logged-in user */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl">
          <DialogTitle className="sr-only">Order Details</DialogTitle>
          {selectedOrder && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between gap-2">
                <h1 className="font-semibold">
                  Order Details - {selectedOrder.orderInfo[0]?.trackingNumber}
                </h1>
                <span className="text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-gray-50 md:w-[60%] p-4 rounded-lg shadow-inner">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Shipping Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-medium text-gray-900">
                      {selectedOrder.customerInfo.firstName}{" "}
                      {selectedOrder.customerInfo.lastName}
                    </div>
                    <div>{selectedOrder.customerInfo.address}</div>
                    <div>{selectedOrder.customerInfo.city}</div>
                    <div>{selectedOrder.customerInfo.country}</div>
                    <div>{selectedOrder.customerInfo.postalCode}</div>
                  </div>
                </div>

                <div className="bg-gray-50 md:w-[40%] p-4 rounded-lg shadow-inner">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Payment Information
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="font-medium text-gray-900">
                      {selectedOrder.paymentInfo}
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total:</span>
                      <span>৳{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="font-medium text-gray-900 mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Product Name</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderInfo.map((item: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{item.productInfo?.description?.name}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">৳{item.totalAmount.subTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
