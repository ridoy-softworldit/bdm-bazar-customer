"use client";

import CheckoutSummary from "../checkout/CheckoutSummary";
interface RightSideProps {
  subtotal: number;
  deliveryCharge: number;
}
export default function RightSide({
  subtotal,
  deliveryCharge,
}: RightSideProps) {
  return (
    <div>
      <CheckoutSummary
        mode="cart"
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
      />
    </div>
  );
}
