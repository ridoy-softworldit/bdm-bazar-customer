"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

type BundleItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  checked?: boolean;
};

const initialItems: BundleItem[] = [
  {
    id: "b1",
    title: "ইসলাম ও আমাদের জীবন…",
    image: "/books/b1.jpg", // replace with real path
    price: 275,
    oldPrice: 550,
    checked: true,
  },
  {
    id: "b2",
    title: "যাকাত কিভাবে দিবেন…",
    image: "/books/b2.jpg",
    price: 31,
    oldPrice: 50,
    checked: true,
  },
  {
    id: "b3",
    title: "রামাদান প্রিপারেশন…",
    image: "/books/b3.jpg",
    price: 85,
    oldPrice: 170,
    checked: true,
  },
];

export default function FrequentlyBoughtTogether() {
  const [items, setItems] = useState<BundleItem[]>(initialItems);

  const { total, save } = useMemo(() => {
    const selected = items.filter((i) => i.checked);
    const total = selected.reduce((s, i) => s + i.price, 0);
    const save = selected.reduce(
      (s, i) => s + Math.max((i.oldPrice ?? i.price) - i.price, 0),
      0
    );
    return { total, save };
  }, [items]);

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );

  return (
    <div className="max-w-6xl bg-[#FFFFFF] mx-auto">
      <h3 className="text-[17px] font-medium mb-3">পাঠকেরা একত্রে কিনে থাকেন</h3>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Product strip + total */}
        <div className="flex items-start gap-6 flex-1 flex-wrap">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-10">
              {/* Card */}
              <div className="relative w-[60px]">
                <label className="absolute -top-1 -left-1 z-10">
                  <input
                    type="checkbox"
                    checked={!!item.checked}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 accent-blue-500 cursor-pointer"
                  />
                </label>

                <div className="w-[80px] h-[100px] bg-gray-100 rounded-sm overflow-hidden ring-1 ring-gray-200">
                  <Image
                    alt={item.title}
                    src={item.image}
                    width={80}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div
                  className="mt-2 text-[13px] leading-tight text-gray-700 truncate"
                  title={item.title}
                >
                  {item.title}
                </div>

                <div className="mt-1 flex text-[12px]">
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through mr-1">
                      TK. {item.oldPrice}
                    </span>
                  )}
                  <span className="text-gray-700">TK. {item.price}</span>
                </div>
              </div>

              {/* + separator except after last */}
              {idx < items.length - 1 && (
                <div className="self-center text-3xl -mt-6 text-gray-300 select-none">
                  +
                </div>
              )}
            </div>
          ))}

          {/* = separator */}
          <div className="self-center text-3xl ml-6 -mt-6 text-gray-400 select-none">
            =
          </div>

          {/* Total & Save */}
          <div className="self-center ml-4 min-w-[220px]">
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-gray-800">TK. {total}</span>
            </div>
            <div className="text-xs text-green-600 font-medium">
              Save TK. {save}
            </div>
          </div>
        </div>

        {/* Add to Cart button - RIGHT SIDE (smaller size) */}
        <div className="md:self-center w-[220px] ">
          <button
            disabled={items.every((i) => !i.checked)}
            className="inline-flex items-center gap-1 border border-blue-400 text-blue-600 px-4 py-1.5 text-sm rounded-md hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              const selected = items.filter((i) => i.checked);
              
            }}
          >
            <ShoppingCart className="h-4 w-4" />
           <p className="text-[15px] font-semibold m-0">Add All To Cart</p>
          </button>
        </div>
      </div>
    </div>
  );
}
