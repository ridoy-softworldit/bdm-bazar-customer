"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

export default function OfferNotices({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(true);

  const visible = expanded ? items : items.slice(0, 1);

  return (
    <div className="mt-3">
      <div className="space-y-2">
        {visible.map((text, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 rounded border border-orange-200 bg-orange-50 px-3 py-2"
          >
            <Tag className="h-4 w-4 text-orange-500 shrink-0 mt-[2px]" />
            <p className="text-[13px] leading-snug text-gray-700">{text}</p>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[13px] text-blue-600"
        >
          {expanded ? "কমিয়ে দেখুন ︿" : "আরও দেখুন ﹀"}
        </button>
      )}
    </div>
  );
}
