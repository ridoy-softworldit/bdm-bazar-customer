"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// Types
interface BookItem { id: string; title: string; cover: string }
interface Category { id: string; title: string; books: BookItem[]; seeMoreHref?: string }

// Demo data
const demoCategories: Category[] = [
    {
        id: "academic",
        title: "একাডেমিক বই",
        seeMoreHref: "#academic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/category/5f230d84cbeb4_image.png" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
        ],
    },
    {
        id: "academic",
        title: "বাংলা বই",
        seeMoreHref: "#academic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/category/921c2e06dd5c4_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/category/5f230d84cbeb4_image.png" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
        ],
    },
    {
        id: "academic",
        title: "আরবি বই",
        seeMoreHref: "#academic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
        ],
    },
    {
        id: "academic",
        title: "জেনারেল বই",
        seeMoreHref: "#academic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
        ],
    },
    {
        id: "academic",
        title: "একাডেমিক বই",
        seeMoreHref: "#academic",
        books: [
        { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/category/921c2e06dd5c4_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/category/5f230d84cbeb4_image.png" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
        ],
    },
    {
        id: "academic",
        title: "বইমেলা",
        seeMoreHref: "#academic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/category/921c2e06dd5c4_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/category/5f230d84cbeb4_image.png" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
        ],
    },
    {
        id: "islamic",
        title: "ইসলামি বই",
        seeMoreHref: "#islamic",
        books: [
            { id: "a1", title: "বিজ্ঞান প্রথম খন্ড", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Foyjul_Kalam-Mufti_Azam_Faizullah_Rah-77538-325210.jpg" },
            { id: "a2", title: "ব্যাকরণ প্রথম খন্ড", cover: "http://ds.rokomari.store/rokomari110/category/17926f5fe9f84_image.jpg" },
            { id: "a3", title: "গণিত", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a4", title: "বঙ্গবন্ধু শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
            { id: "a5", title: "অধ্যয়ন সহায়িকা", cover: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Salat_Duya_o_Zikor-Dr_Khandaker_Abdullah_Jahangir-7f09e-166080.jpg" },
            { id: "a6", title: "ধর্মীয় শিক্ষা", cover: "https://ds.rokomari.store/rokomari110/category/a0f1059ebb594_image.png" },
        ],
    },
];

// Utils
const cx = (...cls: Array<string | false | undefined>) => cls.filter(Boolean).join(" ");

// UI Components
const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 pt-4 pb-2">
        <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>
    </div>
);

const BookGrid = ({ books }: { books: BookItem[] }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 pb-3">
        {books.slice(0, 4).map((b) => (
            <div key={b.id} className="flex flex-col items-center">
                <div className="relative h-24 w-16 sm:h-28 sm:w-20 md:h-32 md:w-24 lg:h-36 lg:w-24 rounded shadow-sm overflow-hidden bg-gray-100">
                    <Image
                        src={b.cover}
                        alt={b.title}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 96px, 120px"
                        className="object-cover"
                    />
                </div>
                <p className="mt-2 text-[11px] text-gray-600 line-clamp-2 text-center leading-tight">{b.title}</p>
            </div>
        ))}
    </div>
);

const SeeMore = ({ href = "#" }: { href?: string }) => (
    <div className="px-4 pb-4">
        <a href={href} className="group inline-flex items-center text-[12px] font-medium text-sky-600 hover:text-sky-700">
            See More
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="ms-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
            </svg>
        </a>
    </div>
);

const CategoryCard = ({ cat }: { cat: Category }) => (
    <div className="min-w-[260px] max-w-[320px] flex-1 rounded-md border border-gray-100 bg-white shadow-sm">
        <SectionHeader title={cat.title} />
        <BookGrid books={cat.books} />
         <SeeMore href={`/gridCard/${cat.id}`} />
    </div>
);

const ArrowButton = ({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) => (
    <button
        aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
        onClick={onClick}
        className={cx(
            "flex absolute top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow hover:shadow-md active:scale-95",
            dir === "left" ? "left-2" : "right-2"
        )}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            {dir === "left" ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
        </svg>
    </button>
);

export default function RokomariStyleGrid({ categories = demoCategories }: { categories?: Category[] }) {
    const railRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false); // প্রথমে hide

    useEffect(() => {
        const el = railRef.current;
        if (!el) return;
        // প্রথমে right arrow show করতে চাইলেও scrollLeft=0 হলে hide
        setCanScrollRight(el.scrollWidth > el.clientWidth);
    }, []);

    const checkArrows = () => {
        const el = railRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scrollBy = (delta: number) => {
        const el = railRef.current;
        if (!el) return;
        el.scrollBy({ left: delta, behavior: "smooth" });
        setTimeout(checkArrows, 300); // scroll update
    };

    return (
        <main className="min-h-screen w-full bg-gray-50">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 lg:px-6 py-6">
                <h2 className="mb-4 text-[18px] font-semibold text-gray-800">ক্যাটাগরিভিত্তিক বই</h2>
                <div className="relative">
                    {canScrollLeft && <ArrowButton dir="left" onClick={() => scrollBy(-360)} />}
                    {canScrollRight && <ArrowButton dir="right" onClick={() => scrollBy(360)} />}
                    <div ref={railRef} className="flex gap-4 overflow-x-auto scroll-smooth pr-1 scrollbar-none">
                        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                        {categories.map((cat) => <CategoryCard key={cat.id + Math.random()} cat={cat} />)}
                    </div>
                </div>
            </div>
        </main>
    );
}
