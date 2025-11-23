"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import BookInfoCard from "./BookInfoTable";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import Tabs from "./Tabs";
import ProductQA from "./ProductQA";
import AuthorProfilePage from "./AuthorProfilePage";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  isVerified: boolean;
  helpful: number;
  notHelpful: number;
}

export default function ProductReviewPage() {
  const reviews: Review[] = [
    {
      id: "1",
      author: "Nazim",
      rating: 5,
      date: "07 Nov 2019",
      content: "আশ্চর্যজনক অভিজ্ঞতা সংগ্রহ। নিজেকে খুবই ভাল পেয়েছি করতে।",
      isVerified: true,
      helpful: 2,
      notHelpful: 0,
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 1, percentage: 33.3 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 2, percentage: 66.7 },
  ];

  const averageRating = 3.33;
  const totalReviews = 3;

  const [activeTab, setActiveTab] = useState("summary");
  const [helpfulVotes, setHelpfulVotes] = useState<{
    [key: string]: { helpful: number; notHelpful: number };
  }>(
    reviews.reduce(
      (acc, r) => ({
        ...acc,
        [r.id]: { helpful: r.helpful, notHelpful: r.notHelpful },
      }),
      {}
    )
  );
  const [userVote, setUserVote] = useState<{
    [key: string]: "helpful" | "not-helpful" | null;
  }>(reviews.reduce((acc, r) => ({ ...acc, [r.id]: null }), {}));

  const handleVote = (reviewId: string, type: "helpful" | "not-helpful") => {
    if (userVote[reviewId] === type) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: {
        helpful:
          type === "helpful"
            ? prev[reviewId].helpful + 1
            : prev[reviewId].helpful -
              (userVote[reviewId] === "helpful" ? 1 : 0),
        notHelpful:
          type === "not-helpful"
            ? prev[reviewId].notHelpful + 1
            : prev[reviewId].notHelpful -
              (userVote[reviewId] === "not-helpful" ? 1 : 0),
      },
    }));
    setUserVote((prev) => ({ ...prev, [reviewId]: type }));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        {/* Product Header */}
        <div className="mb-6 p-6">
          <h1 className="text-2xl font-bold text-balance mb-4">
            বইটির বিস্তারিত দেখুন
          </h1>

          {/* Tabs with border-bottom */}
          <div className="relative border-b border-gray-300">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Active tab overlay to hide border */}
            <div
              className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-200`}
              style={{
                width:
                  activeTab === "summary"
                    ? "33.33%"
                    : activeTab === "specification"
                    ? "33.33%"
                    : "33.33%",
                transform:
                  activeTab === "summary"
                    ? "translateX(0%)"
                    : activeTab === "specification"
                    ? "translateX(100%)"
                    : "translateX(200%)",
              }}
            />
          </div>

          <div className="mt-6 w-full">
            {activeTab === "summary" && (
              <div className="space-y-4 w-full">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>আশ্চর্যজনক</strong> বইটির সংক্ষিপ্ত কথা:
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  যেই ও আমার সম্পর্কে জানেন। ইতিমধ্যে যেসব বেশকিছু বিষয় ভাব
                  চমৎকার আলোচনাগুলির এই বিষয় বলেছে। হিন্দু আমার জানেন এ বিষয়
                  ভাব চমৎকার তথ্য সবকিছু।
                </p>
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Report incorrect information</span>
                </div>
              </div>
            )}
            {activeTab === "specification" && <BookInfoCard />}
            {activeTab === "author" && (
              <div className="mt-6 space-y-4 w-full">
                <AuthorProfilePage name="Nazim" followers={1200} />
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2 md:gap-0">
            <h2 className="text-xl font-semibold">Reviews and Ratings</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Please login to write review
              </span>
              <button className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-blue-500 hover:text-white transition">
                Login
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Overall Rating */}
            <div className="flex flex-col items-start md:items-start justify-center space-y-1">
              <div className="text-4xl font-bold leading-none">
                {averageRating?.toFixed?.(1) ?? averageRating}
              </div>
              <StarRating rating={averageRating} size="md" />
              <p className="text-sm text-muted-foreground">
                {averageRating} Ratings and {totalReviews} Reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 flex flex-col justify-end space-y-1">
              {ratingDistribution
                .sort((a, b) => b.stars - a.stars)
                .map((item) => (
                  <div
                    key={item.stars}
                    className="flex items-center gap-1 text-sm w-[300px]"
                  >
                    <div className="w-13 text-[12px] leading-none">
                      <span className="text-amber-500">
                        {"★".repeat(item.stars)}
                      </span>
                      <span className="text-gray-300">
                        {"★".repeat(5 - item.stars)}
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Customer Reviews</h3>
              <select className="text-sm px-3 py-1 border rounded">
                <option>Default</option>
                <option>Most Recent</option>
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
              </select>
            </div>

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                helpfulVotes={helpfulVotes}
                userVote={userVote}
                handleVote={handleVote}
              />
            ))}
          </div>

          {/* Q/A Section */}
          <ProductQA />
        </div>
      </div>
    </div>
  );
}
