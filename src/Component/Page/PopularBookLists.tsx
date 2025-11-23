"use client"

import Image from "next/image"

// Arrow icons
const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)
const ChevronLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

// Hardcoded book lists
const bookLists = [
  {
    id: 1,
    title: "আমায়ের পথে দাঁড়িয়াত",
    subtitle: "১৫টি সেরা ইসলামী বই নাম",
    count: 12,
    images: ["/islamic-book-cover-yellow.jpg", "/islamic-book-cover-green.jpg", "/quran-hadith-book-cover-red.jpg"],
  },
  {
    id: 2,
    title: "হাসিল ও সুরাত",
    subtitle: "",
    count: 26,
    images: [
      "/islamic-book-cover-green.jpg",
      "/quran-tafsir-book-cover-blue.jpg",
      "/dua-zikr-book-cover-orange.jpg",
      "/children-islamic-books-colorful.jpg",
    ],
  },
  {
    id: 3,
    title: "১০০ আয়াত ১০০ হাদীস",
    subtitle: "",
    count: 45,
    images: ["/quran-hadith-book-cover-red.jpg", "/islamic-book-cover-yellow.jpg"],
  },
  {
    id: 4,
    title: "কুরআন ও তাফসীর",
    subtitle: "",
    count: 29,
    images: ["/quran-tafsir-book-cover-blue.jpg", "/islamic-book-cover-green.jpg", "/dua-zikr-book-cover-orange.jpg"],
  },
  {
    id: 5,
    title: "নির্বাচিত শিশু-কিশোর ইসলামী বই",
    subtitle: "",
    count: 18,
    images: [
      "/children-islamic-books-colorful.jpg",
      "/islamic-book-cover-yellow.jpg",
      "/quran-hadith-book-cover-red.jpg",
      "/islamic-book-cover-green.jpg",
    ],
  },
  {
    id: 6,
    title: "দোয়া ও যিকির",
    subtitle: "",
    count: 22,
    images: ["/dua-zikr-book-cover-orange.jpg", "/quran-tafsir-book-cover-blue.jpg"],
  },
]

// Book div component
function BookItem({ book }: { book: typeof bookLists[0] }) {
  return (
    <div className="flex-shrink-0 w-48 p-3 hover:shadow-lg transition-shadow cursor-pointer group bg-white rounded-md">
      <div className="relative mb-3">
        <div className="aspect-[3/4] relative overflow-hidden rounded-md">
          {book.images.length === 1 ? (
            <Image
              src={book.images[0] || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
              {book.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${book.title} ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {book.count > 0 && (
          <div
            className="absolute -top-2 -right-2 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2"
            style={{ backgroundColor: "#dc2626", color: "#ffffff", borderColor: "#ffffff" }}
          >
            +{book.count}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        {book.subtitle && <p className="text-xs text-muted-foreground line-clamp-1">{book.subtitle}</p>}
      </div>
    </div>
  )
}

// Main section component
export default function PopularBookListsSection() {
  return (
    <section className="w-full p-6 mt-8 relative bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Popular Book Lists</h2>
        <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="mr-1">View All</span>
          <ChevronRightIcon />
        </button>
      </div>

      {/* Static arrows - decorative only */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow z-10 pointer-events-none">
        <ChevronLeftIcon />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow z-10 pointer-events-none">
        <ChevronRightIcon />
      </div>

      {/* Horizontal row of books, no wrap */}
      <div className="flex gap-4 overflow-hidden whitespace-nowrap">
        {bookLists.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
