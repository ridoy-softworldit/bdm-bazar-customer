import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ProductShowcase01 = ({ title, products }) => {
  const [animate, setAnimate] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const showcaseRef = useRef(null);

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
    const showcase = showcaseRef.current;

    if (showcase) {
      handleScroll();
      showcase.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (showcase) {
        showcase.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-md py-6 mt-6">
      <div className="flex justify-between items-center px-10">
        <h2 className="text-2xl font-normal mb-4 ">{title}</h2>
        <button className="mb-2 px-5 py-2 border cursor-pointer hover:bg-[#0097D7] hover:text-white font-semibold hover:border-white border-blue-600 rounded-sm text-blue-600 ">
          See more
        </button>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white p-2 py-5 px-1 [box-shadow:5px_0_15px_rgba(0,0,0,0.3)] z-10
            ${!canScrollLeft ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronLeft size={35} />
        </button>

        {/* Products List */}
        <div
          ref={showcaseRef}
          id="product-showcase"
          className="flex  overflow-x-auto no-scrollbar h-[325px] scroll-smooth px-10"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[176px]  cursor-pointer max-w-[220px] bg-white  transition duration-200 relative group rounded"
            >
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}
                </div>
              )}

              {/* Image & Hover */}
              <div className=" flex items-center justify-center h-36 mt-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="h-40 object-contain"
                />
                <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition duration-500 ease-in-out transform">
                  <button className="bg-[#1a8fc2] text-white px-5 py-2 rounded text-sm mb-2 transform transition duration-300 ease-in-out hover:scale-105 hover:bg-[#21B4F3]">
                    Add to Cart
                  </button>
                  <Link
                    href={"/product/1"}
                    onClick={handleClick}
                    className={`absolute bottom-0 w-full py-2 text-center font-semibold cursor-pointer
    ${
      animate
        ? "bg-[#1a8fc2] text-white shadow-[0_8px_15px_-5px_rgba(26,143,194,0.7)] animate-pulse-glow"
        : "bg-[#F5F5F5] text-[#1a8fc2] shadow-[0_4px_6px_-2px_rgba(0,0,0,0.2)]"
    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 text-center">
                <p className="text-sm font-medium line-clamp-2">
                  {product.name}
                </p>
                <p className="text-gray-500 text-xs mt-1">{product.brand}</p>

                {/* Price Section */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 line-through">
                    {product.price}
                  </p>
                  <p className="text-green-700 font-bold">
                    {product.discountPrice}
                  </p>
                </div>

                {/* Rating */}
                <p className="text-yellow-500 text-sm mt-1">
                  {"★".repeat(product.rating)}
                  {"☆".repeat(5 - product.rating)}
                </p>

                {/* EMI Available */}
                {product.emi && (
                  <p className="text-xs text-green-600 mt-1">{product.emi}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-[#FFFFFF] p-2 py-5 px-1  [box-shadow:-5px_0_15px_rgba(0,0,0,0.3)]  z-10
            ${!canScrollRight ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronRight size={35} />
        </button>
      </div>
    </div>
  );
};

export default ProductShowcase01;
