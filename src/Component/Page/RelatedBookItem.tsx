"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface RelatedBookItemProps {
    book: {
        id: number
        title: string
        author: string
        cover: string
        bgColor: string
        stars: number
        reviews: number
        price: number
        originalPrice?: number
    }
}

export default function RelatedBookItem({ book }: RelatedBookItemProps) {
    return (
        <div className="overflow-hidden rounded-md">
            <div className="p-1.5 flex gap-1.5"> {/* padding & gap komano */}
                <div className={`w-14 h-20 ${book.bgColor} rounded flex-shrink-0 flex items-center justify-center`}>
                    <Image
                        src={book.cover}
                        alt={book.title}
                        width={56}
                        height={80}
                        className="rounded object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-medium text-gray-900 mb-0.5 truncate">{book.title}</h4> 
                        <p className="text-[10px] text-gray-600 mb-0.5 truncate">{book.author}</p> {/* font size & mb komano */}
                        <div className="flex items-center gap-0.5 mb-0.5">
                            {[...Array(book.stars)].map((_, index) => (
                                <Star key={index} className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                            ))}
                            <span className="text-[10px] text-gray-500">({book.reviews})</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {book.originalPrice && <span className="text-[10px] text-gray-500 line-through">TK. {book.originalPrice}</span>}
                        <span className="text-xs font-bold text-gray-900">TK. {book.price}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
