import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";



const ProductShowcase03 = ({title , categories}) => {
  const showcaseRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    if (showcaseRef.current) {
      const { scrollLeft, clientWidth } = showcaseRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      showcaseRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    if (showcaseRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = showcaseRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = showcaseRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el && el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="relative p-4 bg-white shadow mt-6 ">
      <h2 className="text-2xl font-normal mb-4 ">{title}</h2>

      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-200 shadow hover:bg-gray-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-200 shadow hover:bg-gray-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Row */}
      <div
        ref={showcaseRef}
        className="flex  overflow-x-auto no-scrollbar scrollbar-hide scroll-smooth"
      >
        {categories.map((cat, index) => (
          <Link href={"/product/1"}
            key={index}
            className="hover:text-blue-600 flex flex-col items-center  min-w-[150px] cursor-pointer"
          >
            <div className="w-32 bg-[#F5F5F5] h-32 rounded-full border border-blue-300 flex items-center justify-center">
              <img src={cat.img} alt={cat.name} className="w-12 h-12 object-contain" />
            </div>
            <p className="text-base mt-2 text-center">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase03;
