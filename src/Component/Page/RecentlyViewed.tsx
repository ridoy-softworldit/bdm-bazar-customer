"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface RecentlyViewedItem {
    id: string
    title: string
    author?: string
    image: string
    type: "book" | "product"
}

const recentlyViewedItems: RecentlyViewedItem[] = [
    {
        id: "1",
        title: "গল্পের ঝুড়ি",
        author: "রবীন্দ্রনাথ ঠাকুর",
        image: "/bengali-book-cover-with-green-background-and-red-m.jpg",
        type: "book",
    },
    {
        id: "2",
        title: "LED Flashlight",
        image: "/black-led-flashlight-on-white-background.jpg",
        type: "product",
    },
    {
        id: "3",
        title: "কুরআনের নিতি",
        author: "ইসলামিক বই",
        image: "/islamic-book-cover-with-orange-background-and-arab.jpg",
        type: "book",
    },
    {
        id: "4",
        title: "ইসলামিক গাইড",
        author: "ধর্মীয় বই",
        image: "/green-islamic-book-cover-with-mosque-illustration.jpg",
        type: "book",
    },
    {
        id: "5",
        title: "আত্মজীবনী",
        author: "বিখ্যাত লেখক",
        image: "/white-book-cover-with-blue-architectural-design.jpg",
        type: "book",
    },
    {
        id: "6",
        title: "হযরত মা জীবনী",
        author: "ইসলামিক সাহিত্য",
        image: "/blue-islamic-book-cover-with-decorative-border-and.jpg",
        type: "book",
    },
    {
        id: "7",
        title: "Digital Clock",
        image: "/modern-digital-alarm-clock-with-led-display-showin.jpg",
        type: "product",
    },
]

export function RecentlyViewed() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const itemWidth = 160 // Width of each item including gap
    const visibleItems = 6 // Number of items visible at once
    const maxScroll = Math.max(0, (recentlyViewedItems.length - visibleItems) * itemWidth)

    const scrollLeft = () => {
        setScrollPosition((prev) => Math.max(0, prev - itemWidth * 2))
    }

    const scrollRight = () => {
        setScrollPosition((prev) => Math.min(maxScroll, prev + itemWidth * 2))
    }

    return (
        <div className="w-full bg-muted/30 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative">
                    {/* Header */}
                    <h2 className="text-xl font-semibold text-foreground mb-6">Recently Viewed</h2>

                    {/* Navigation Arrows */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={scrollLeft}
                        disabled={scrollPosition === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={scrollRight}
                        disabled={scrollPosition >= maxScroll}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Scrollable Container */}
                    <div className="overflow-hidden mx-12">
                        <div
                            className="flex gap-4 transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${scrollPosition}px)` }}
                        >
                            {recentlyViewedItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className="flex-shrink-0 w-36 bg-card hover:bg-accent/10 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border-border"
                                >
                                    <div className="p-3">
                                        {/* Image */}
                                        <div className="aspect-[3/4] mb-3 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-medium text-card-foreground line-clamp-2 leading-tight">
                                                {item.title}
                                            </h3>
                                            {item.author && <p className="text-xs text-muted-foreground line-clamp-1">{item.author}</p>}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
