"use client";

import { CartItem } from "@/lib/slices/cartSlice";
import { CustomerInfo } from "./ShippingAddress";
import { X, Edit2, Package, User, MapPin, Phone, Mail } from "lucide-react";

interface OrderPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  items: CartItem[];
  customerInfo: CustomerInfo;
  subtotal: number;
  deliveryCharge: number;
}

export default function OrderPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  items,
  customerInfo,
  subtotal,
  deliveryCharge,
}: OrderPreviewModalProps) {
  if (!isOpen) return null;

  const total = subtotal + deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Preview
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="font-medium">{customerInfo.phone}</p>
                </div>
              </div>
              {customerInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium">{customerInfo.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Delivery Address</p>
                  <p className="font-medium">
                    {customerInfo.address}, {customerInfo.zone}, {customerInfo.area}, {customerInfo.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                <Package className="w-4 h-4" />
                Order Items ({items.length})
              </h3>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="p-3 flex gap-3 hover:bg-gray-50">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-semibold text-sm">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-medium">৳{deliveryCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300 text-base font-bold">
              <span>Total</span>
              <span className="text-blue-600">৳{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Confirm Order ৳{total.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
