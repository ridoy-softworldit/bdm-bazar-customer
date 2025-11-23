"use client"

import { Star as StarIcon } from "lucide-react"

interface StarRatingProps {
    rating: number
    size?: "sm" | "md" | "lg"
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
    const sizeClasses = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" }
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`${sizeClasses[size]} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    )
}
