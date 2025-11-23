/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const packages = [
    {
        id: 1,
        title: "ভালোবাসার রোগ - ১ম ও ২য় খণ্ড",
        image: "/bengali-love-story-book-cover-with-heart-symbol.jpg",
        price: "৳২৫০",
    },
    {
        id: 2,
        title: "শতভাগ কুরআনের ভোজ্যতালিকা (জেনেসিস ১ ও ২)",
        image: "/islamic-book-cover-with-quran-verses-in-bengali.jpg",
        price: "৳৩৫০",
    },
    {
        id: 3,
        title: "উপবাসে শেষ হয়নি তুমি শুধু কালোবরণ",
        image: "/bengali-poetry-book-cover-with-minimalist-design.jpg",
        price: "৳২০০",
    },
    {
        id: 4,
        title: "সুনানে ইবনে মাজাহ (১ম - ৩য় খণ্ড এক সেট)",
        image: "/islamic-hadith-book-collection-with-ornate-border-.jpg",
        price: "৳৮৫০",
    },
    {
        id: 5,
        title: "মৃত্যু ও তার পরিণতি + দি ইউনিভার্স কালেকশন",
        image: "/islamic-book-about-death-and-afterlife-with-cosmic.jpg",
        price: "৳৪৫০",
    },
]

export function PopularPackages() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerView = 4

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + itemsPerView >= packages.length ? 0 : prevIndex + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, packages.length - itemsPerView) : prevIndex - 1))
    }

    const visiblePackages = packages.slice(currentIndex, currentIndex + itemsPerView)

    return (
        <div className="max-w-5xl p-4  mt-4 bg-[#FFFFFF] shadow-sm rounded">
            <h2 className="text-2xl font-bold text-foreground mb-6">Popular Packages</h2>

            <div className="relative">
                {/* Navigation Buttons */}
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                    onClick={nextSlide}
                    disabled={currentIndex + itemsPerView >= packages.length}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Package Cards */}
                <div className="mx-12 overflow-hidden">
                    <div
                        className="flex gap-4 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {packages.map((pkg) => (
                            <Card key={pkg.id} className="flex-shrink-0 w-1/4 p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="aspect-[3/4] mb-3 overflow-hidden rounded-full bg-muted">
                                    <Image
                                        src={pkg.image || "/placeholder.svg"}
                                        alt={pkg.title}
                                        width={240}   // example width
                                        height={320}  // example height (3:4 aspect ratio)
                                        className="object-cover rounded-full w-full h-full"
                                    />

                                </div>
                                <h3 className="text-sm font-medium text-foreground leading-tight mb-2 line-clamp-2">{pkg.title}</h3>
                                <p className="text-lg font-bold text-primary">{pkg.price}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: Math.ceil(packages.length / itemsPerView) }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${Math.floor(currentIndex / itemsPerView) === index ? "bg-primary" : "bg-muted-foreground/30"
                                }`}
                            onClick={() => setCurrentIndex(index * itemsPerView)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
