/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const AUTOPLAY_MS = 5000;

const LaptopSaleBanner = () => {
  const [settings, setSettings] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Fetch settings from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data?.data);
      })
      .catch((err) => console.error("Settings fetch error:", err));
  }, []);

  const slides = settings?.sliderImages || [];
  const len = slides.length;

  // ✅ Next & Prev slide functions
  const next = () => len > 0 && setIndex((i) => (i + 1) % len);
  const prev = () => len > 0 && setIndex((i) => (i - 1 + len) % len);

  // ✅ Auto slide
  const start = () => {
    stop();
    if (len > 1) timerRef.current = setInterval(next, AUTOPLAY_MS);
  };
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    start();
    return stop;
  }, [len]);

  // ✅ Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [len]);

  const goTo = (i: number) => setIndex(i);

  if (!len) {
    return (
      <div className="relative w-full h-[150px] sm:h-[300px] md:h-[400px] lg:h-[300px] bg-gray-100 animate-pulse rounded-md mt-5"></div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden md:max-w-7xl mx-auto"
      onMouseEnter={stop}
      onMouseLeave={start}
      role="region"
      aria-roledescription="carousel"
      aria-label="Laptop promotions"
    >
      {/* Slides */}
      <div className="relative w-full h-[150px] sm:h-[300px] md:h-[400px] lg:h-[300px] mt-5">
        {slides.map((img: string, i: number) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index
                ? "opacity-100 z-20"
                : "opacity-0 z-10 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={img}
              alt={`Banner Slide ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw,
                     (max-width: 768px) 100vw,
                     (max-width: 1024px) 100vw,
                     100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {len > 1 && (
        <>
          <button
            className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center shadow-lg"
            onClick={prev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center shadow-lg"
            onClick={next}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {len > 1 && (
        <div className="flex justify-center mt-2 md:my-2 my-2 gap-2">
          {slides.map((_: string, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`md:w-2.5 md:h-2.5 w-1.5 h-1.5 rounded-full transition-all ${
                i === index
                  ? "bg-yellow-400 scale-125"
                  : "bg-gray-400 hover:scale-110"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LaptopSaleBanner;
