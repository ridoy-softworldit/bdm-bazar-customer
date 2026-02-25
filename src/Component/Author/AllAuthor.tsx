"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useGetAllAuthorsQuery,
  useFollowAuthorMutation,
} from "@/redux/featured/author/authorApi";
import { TAuthor } from "@/types/author/author";

const AllAuthor = () => {
  const {
    data: authors,
    isLoading,
    isError,
  } = useGetAllAuthorsQuery(undefined);
  const [followAuthor] = useFollowAuthorMutation();

  // Track which author is currently being followed
  const [followingId, setFollowingId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  // Filter authors based on search term
  const filteredAuthors = React.useMemo(() => {
    if (!authors) return [];
    if (!searchTerm.trim()) return authors;

    return authors.filter((author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [authors, searchTerm]);

  const handleFollow = async (id: string) => {
    if (followingId === id) return;
    setFollowingId(id);
    try {
      await followAuthor(id).unwrap();
      toast.success("Successfully followed author!");
    } catch (err) {
      toast.error("Failed to follow author");
    } finally {
      setFollowingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !authors || authors.length === 0) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>কোনো লেখক পাওয়া যায়নি!</p>
      </div>
    );
  }

  return (
    <div className=" flex min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl my-10 bg-white rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              সকল লেখক
            </h1>

            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search by author name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-2/3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {filteredAuthors.map((author: TAuthor) => (
            <div
              key={author._id}
              className="flex flex-col items-center text-center group"
            >
              <Link href={`/authors/${author._id}`}>
                <div className="relative w-28 h-28 md:w-32 md:h-32 mb-3 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all duration-300 cursor-pointer">
                  {author.image ? (
                    <Image
                      src={author.image}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 112px, 128px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNMQXFzpwXDmR//Z"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl">
                      {author.name.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>

              <h3 className="text-sm  font-semibold text-gray-900 line-clamp-2 px-2 leading-tight">
                {author.name.length > 20
                  ? `${author.name.substring(0, 20)}...`
                  : author.name}
              </h3>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {author.followersCount.toLocaleString()} followers
              </p>

              {/* Follow Button */}
              <button
                onClick={() => handleFollow(author._id)}
                disabled={followingId === author._id}
                className={`mt-3 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm ${
                  followingId === author._id
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-0 shadow-md hover:shadow-lg"
                }`}
              >
                <span className="flex items-center gap-2">
                  {followingId === author._id ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Following...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Follow
                    </>
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllAuthor;
