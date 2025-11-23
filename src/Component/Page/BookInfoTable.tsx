"use client"

import { Badge } from "@/components/ui/badge"

interface BookInfo {
  title: string
  author: string
  translator?: string
  publisher: string
  isbn: string
  edition: string
  pages: number
  country: string
  language: string
}

function BookInfoTable({ book }: { book: BookInfo }) {
  const tableRows = [
    { label: "Title", value: book.title },
    { label: "Author", value: book.author },
    ...(book.translator ? [{ label: "Translator", value: book.translator }] : []),
    { label: "Publisher", value: book.publisher },
    { label: "ISBN", value: book.isbn },
    { label: "Edition", value: book.edition },
    { label: "Number of Pages", value: book.pages.toString() },
    { label: "Country", value: book.country },
    { label: "Language", value: book.language },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto  rounded-md overflow-hidden">
      <div className="overflow-hidden p-6">
        <table className="w-full border-collapse border border-border">
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.label} className="border border-border">
                <td className="px-6 py-4 font-medium text-muted-foreground border border-border w-48">
                  {row.label}
                </td>
                <td className="px-6 py-4 text-foreground border border-border">
                  {row.label === "Language" || row.label === "Country" ? (
                    <Badge variant="secondary" className="font-normal">
                      {row.value}
                    </Badge>
                  ) : (
                    <span className="leading-relaxed">{row.value}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report incorrect information section */}
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 rounded-full border-2 border-destructive flex items-center justify-center">
            <span className="text-destructive text-xs font-bold">!</span>
          </div>
          <button className="text-destructive hover:text-destructive/80 transition-colors">
            Report incorrect information
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookInfoCard() {
  const sampleBook: BookInfo = {
    title: "ইসলাম ও আমাদের জীবন-৩ : চারিত্রিক ও আখলাকি",
    author: "শাইখুল ইসলাম মুফতী মুহাম্মাদ তাকী উসমানী (شيخ الإسلام مفتي محمد تقي عثماني)",
    translator: "মাওলানা মুহাম্মাদ কামালুদ্দীন",
    publisher: "মাকতাবাতুল আশরাফ",
    isbn: "9789848950586",
    edition: "4th Edition, 2020",
    pages: 384,
    country: "বাংলাদেশ",
    language: "বাংলা",
  }

  return (
    <main>
      <BookInfoTable book={sampleBook} />
    </main>
  )
}
