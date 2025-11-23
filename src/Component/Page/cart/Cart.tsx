/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  toggleSelectAll,
  toggleSelectItem,
  updateQuantity,
} from "@/lib/slices/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  // --- Derived values ---
  const selectedItems = items.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const originalTotal = selectedItems.reduce(
    (acc, item) => acc + (item.originalPrice ?? 0) * item.quantity,
    0
  );
  const deliveryCharge = 60;
  const payableTotal = subtotal + deliveryCharge;

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  // --- Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleSelectAll(e.target.checked));
  };

  const handleSelectItem = (id: number) => {
    dispatch(toggleSelectItem(id.toString()));
  };
  const handleQuantityChange = (id: number, amount: number) => {
    dispatch(updateQuantity({ id: id.toString(), quantity: amount }));
  };
  return (
    <div className="bg-[#F8F8F8] font-sans p-4 max-[640px]:p-2 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <LeftSide
          items={items}
          allSelected={allSelected}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          handleQuantityChange={handleQuantityChange}
          originalTotal={originalTotal}
        />

        {/* Right Column: Checkout Summary */}
        <RightSide subtotal={subtotal} deliveryCharge={deliveryCharge} />
      </div>
    </div>
  );
};

export default CartPage;
