"use client"

import { ThumbsUp, ThumbsDown } from "lucide-react"

interface Props {
    reviewId: string
    helpfulVotes: { helpful: number; notHelpful: number }
    userVote: "helpful" | "not-helpful" | null
    handleVote: (reviewId: string, type: "helpful" | "not-helpful") => void
}

export default function ReviewVoteButtons({ reviewId, helpfulVotes, userVote, handleVote }: Props) {
    return (
        <div className="flex items-center gap-2">
            <button
                className={`flex items-center gap-1 border px-2 py-1 rounded text-sm ${userVote === "helpful" ? "bg-primary/10" : ""}`}
                onClick={() => handleVote(reviewId, "helpful")}
            >
                <ThumbsUp className="h-3 w-3" />
                Helpful ({helpfulVotes.helpful})
            </button>
            <button
                className={`flex items-center gap-1 border px-2 py-1 rounded text-sm ${userVote === "not-helpful" ? "bg-red-100" : ""}`}
                onClick={() => handleVote(reviewId, "not-helpful")}
            >
                <ThumbsDown className="h-3 w-3" />
                Not Helpful
            </button>
        </div>
    )
}
