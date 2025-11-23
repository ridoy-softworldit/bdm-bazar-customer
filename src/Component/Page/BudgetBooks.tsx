"use client"

import Image from "next/image"

export default function BudgetBooks() {
    const budgets = [
        { id: 1, image: "/books/book1.jpg" },
        { id: 2, image: "/books/book2.jpg" },
        { id: 3, image: "/books/book3.jpg" },
        { id: 4, image: "/books/book4.jpg" },
    ];

    return (
        <div className="flex mt-4 flex-col h-[400px] items-center justify-start bg-[#FFFFFF] shadow-sm rounded px-4 pt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 w-full text-left">
                Books in Your Budget
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[300px] w-full max-w-5xl">
                {budgets.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-lg shadow-md w-full h-full overflow-hidden"
                    >
                        <Image
                            src={item.image}
                            alt={`Book ${item.id}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
