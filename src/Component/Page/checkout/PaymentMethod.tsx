"use client";

import Image from "next/image";
import React from "react";

export type PaymentMethodType = "cod" | "bkash" | "nagad" | "rocket";

interface PaymentOptionProps {
  id: PaymentMethodType;
  label: React.ReactNode;
  checked: boolean;
  onChange: (id: PaymentMethodType) => void;
}

const CodLogo = () => (
  <div className="flex items-center space-x-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-blue-500 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <span className="text-gray-700 font-medium">ক্যাশ অন ডেলিভারি</span>
  </div>
);

const BkashLogo = () => (
  <Image
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtajRKYYWNo9AmUfZm77WCfOrh6RaMdMgT-w&s"
    alt="bKash"
    width={28}
    height={28}
    className="object-contain"
  />
);

const NagadLogo = () => (
  <Image
    src="https://vectorseek.com/wp-content/uploads/2022/02/vectorseek.com-Nagad-Logo-Vector.png"
    alt="Nagad"
    width={28}
    height={28}
    className="object-contain"
  />
);

const RocketLogo = () => (
  <Image
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXKRmNqo5LxwsQwMPJ7CNOSulcbqPxIFFsFg&s"
    alt="Rocket"
    width={28}
    height={28}
    className="object-contain"
  />
);

const PaymentOption: React.FC<PaymentOptionProps> = ({
  id,
  label,
  checked,
  onChange,
}) => (
  <label
    htmlFor={id}
    className={`flex items-center p-3 border rounded cursor-pointer transition-all duration-200 ${
      checked ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400"
    }`}
  >
    <input
      type="radio"
      name="paymentMethod"
      id={id}
      checked={checked}
      onChange={() => onChange(id)}
      className="hidden"
    />
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
        checked ? "border-blue-500" : "border-gray-400"
      }`}
    >
      {checked && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
    </div>
    <div className="flex-grow">{label}</div>
  </label>
);

interface PaymentMethodProps {
  selectedPayment: PaymentMethodType;
  handlePaymentChange: (id: PaymentMethodType) => void;
}

export default function PaymentMethod({
  selectedPayment,
  handlePaymentChange,
}: PaymentMethodProps) {
  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
          <p className="text-sm text-gray-500">(Please select a payment method)</p>
        </div>

        <div className="space-y-6">
          {/* Cash On Delivery */}
          <PaymentOption
            id="cod"
            label={<CodLogo />}
            checked={selectedPayment === "cod"}
            onChange={handlePaymentChange}
          />

          {/* Mobile Wallets */}
          <div className="grid grid-cols-3 gap-4">
            <PaymentOption
              id="bkash"
              label={<BkashLogo />}
              checked={selectedPayment === "bkash"}
              onChange={handlePaymentChange}
            />
            <PaymentOption
              id="nagad"
              label={<NagadLogo />}
              checked={selectedPayment === "nagad"}
              onChange={handlePaymentChange}
            />
            <PaymentOption
              id="rocket"
              label={<RocketLogo />}
              checked={selectedPayment === "rocket"}
              onChange={handlePaymentChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
