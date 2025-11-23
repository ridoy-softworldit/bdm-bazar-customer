"use client"

import { useState } from "react"
import { format } from "date-fns"

interface Question {
    id: string
    author: string
    content: string
    date: string
    reply?: string
}

export default function ProductQA() {
    // Hard-coded questions
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: "1",
            author: "Nazim",
            content: "এই বইটির মধ্যে practical উদাহরণ আছে কি?",
            date: "2025-09-14",
            reply: "হ্যাঁ, কিছু উদাহরণ দেওয়া আছে।",
        },
        {
            id: "2",
            author: "Sakib",
            content: "কত পৃষ্ঠা আছে এই বইটিতে?",
            date: "2025-09-13",
        },
        {
            id: "3",
            author: "Rahim",
            content: "এই বইটি কোন ভাষায় লেখা হয়েছে?",
            date: "2025-09-12",
        },
    ])

    const [showAskArea, setShowAskArea] = useState(false)
    const [newQuestion, setNewQuestion] = useState("")
    const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({})
    const [replyOpen, setReplyOpen] = useState<{ [key: string]: boolean }>({})

    const handleAskQuestion = () => {
        if (!newQuestion.trim()) return
        const today = format(new Date(), "yyyy-MM-dd")
        setQuestions([
            ...questions,
            {
                id: (questions.length + 1).toString(),
                author: "You",
                content: newQuestion,
                date: today,
            },
        ])
        setNewQuestion("")
        setShowAskArea(false)
    }

    const handleReply = (questionId: string) => {
        const reply = replyTexts[questionId]?.trim()
        if (!reply) return

        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId ? { ...q, reply } : q
            )
        )
        setReplyTexts((prev) => ({ ...prev, [questionId]: "" }))
        setReplyOpen((prev) => ({ ...prev, [questionId]: false }))
    }

    return (
        <div className="p-6  space-y-4 ">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 ">
                {/* Left side */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Product Q/A</h3>
                    <p className="text-sm text-gray-500">
                        Have a question regarding the product? Ask Us
                    </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 text-sm">
                    <p className="text-gray-600">Please login to write question</p>
                    <button className="px-4 py-1.5 border border-gray-400 rounded-md hover:bg-blue-500 hover:text-white transition">
                        Login
                    </button>
                </div>
            </div>


            {/* Questions List */}
            <div className="space-y-4 mt-4">
                {questions.map((q) => (
                    <div key={q.id} className=" p-3  space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{q.author}</span>
                            <span>{q.date}</span>
                        </div>
                        <p className="text-gray-700">{q.content}</p>

                        {/* Existing Reply */}
                        {q.reply && (
                            <div className="mt-2 p-2 bg-gray-50 border-l-4 border-blue-400 rounded">
                                <p className="text-sm text-gray-600">Reply: {q.reply}</p>
                            </div>
                        )}

                        {/* Reply button */}
                        {!q.reply && (
                            <button
                                onClick={() =>
                                    setReplyOpen((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                                }
                                className="text-sm text-green-500 hover:text-green-700 transition"
                            >
                                {replyOpen[q.id] ? "Cancel Reply" : "Reply"}
                            </button>
                        )}

                        {/* Reply Input */}
                        {replyOpen[q.id] && (
                            <div className="flex flex-col gap-2 mt-2">
                                <textarea
                                    value={replyTexts[q.id] || ""}
                                    onChange={(e) =>
                                        setReplyTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
                                    }
                                    placeholder="Write your reply here..."
                                    className="w-full border rounded p-2 resize-none"
                                    rows={2}
                                />
                                <button
                                    onClick={() => handleReply(q.id)}
                                    className="self-end px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                                >
                                    Reply
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Show/Hide Ask Question Area */}
            <div className="flex mt-4">
                <button
                    onClick={() => setShowAskArea((prev) => !prev)}
                    className="text-blue-500"
                >
                    {showAskArea ? "Cancel" : "Show more Question(s)"}
                </button>
            </div>

            {/* Ask Question Textarea */}
            {showAskArea && (
                <div className="flex flex-col gap-2 mt-2">
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Write your question here..."
                        className="w-full border rounded p-2 resize-none"
                        rows={3}
                    />
                    <button
                        onClick={handleAskQuestion}
                        className="self-end px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Ask Question
                    </button>
                </div>
            )}
        </div>
    )
}
