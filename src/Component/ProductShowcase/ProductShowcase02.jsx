import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ProductShowcase02 = ({ title, products }) => {
  const showcaseRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleScroll = () => {
    const el = showcaseRef.current;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollLeft = () => {
    showcaseRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    showcaseRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1500);
  };

  useEffect(() => {
    handleScroll();
    const el = showcaseRef.current;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="py-4 bg-white mt-6 shadow-xl">
      <h2 className="text-2xl font-normal mb-4 pl-10">{title}</h2>
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white p-2 py-5 px-1 [box-shadow:5px_0_15px_rgba(0,0,0,0.3)] z-10"
          >
            <ChevronLeft size={35} />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={showcaseRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth px-8"
        >
          {products.map((product, index) => (
            <Link href={"/product/1"}
              key={index}
              className="flex-shrink-0  cursor-pointer w-40  overflow-hidden  bg-white relative group"
            >
              <div className="flex bg-[#F5F5F5] justify-center p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={112}
                  height={112}
                  className="h-28 object-contain"
                />
              </div>
              <div className="bg-orange-100 text-center py-2 bottom-0 text-sm font-medium">
                <p>{product.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-[#FFFFFF] p-2 py-5 px-1  [box-shadow:-5px_0_15px_rgba(0,0,0,0.3)]  z-10"
          >
            <ChevronRight size={35} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductShowcase02;
