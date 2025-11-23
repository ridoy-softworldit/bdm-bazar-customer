"use client"

import StarRating from "./StarRating"
import ReviewVoteButtons from "./ReviewVoteButtons"

interface Review {
    id: string
    author: string
    rating: number
    date: string
    content: string
    isVerified: boolean
    helpful: number
    notHelpful: number
}

interface Props {
    review: Review
    helpfulVotes: { [key: string]: { helpful: number; notHelpful: number } }
    userVote: { [key: string]: "helpful" | "not-helpful" | null }
    handleVote: (reviewId: string, type: "helpful" | "not-helpful") => void
}

export default function ReviewCard({ review, helpfulVotes, userVote, handleVote }: Props) {
    return (
        <div className="text-start border-b last:border-b-0">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                    {review.author[0]}
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author}</span>
                        <span className="text-muted-foreground text-sm">{review.date}</span>
                        {review.isVerified && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                ✓ Verified Purchase
                            </span>
                        )}
                    </div>

                    <StarRating rating={review.rating} size="sm" />

                    <div className="space-y-2">
                        <p className="text-[15px]">আশ্চর্যজনক</p>
                        <p className="text-[13px]">{review.content}</p>
                        <button className="text-primary text-sm p-0">Read More</button>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">Was this review helpful to you?</span>
                        <ReviewVoteButtons
                            reviewId={review.id}
                            helpfulVotes={helpfulVotes[review.id]}
                            userVote={userVote[review.id]}
                            handleVote={handleVote}
                        />
                    </div>

                    <button className="w-full border-t border-b border-gray-300 px-3 py-4 rounded-md text-blue-500 text-sm font-medium hover:bg-gray-100 transition">
                        Show More Review
                    </button>
                </div>
            </div>
        </div>
    )
}
