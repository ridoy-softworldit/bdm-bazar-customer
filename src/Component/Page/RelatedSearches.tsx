export default function RelatedSearches() {
    const searches = [
        "কোরা",
        "আরিফ আজাদ",
        "রেনো সুরবার আগমণ",
        "সীরাহ",
        "ইসলামের ইতিহাস",
        "কোরআন শরীফ",
        "বুখারী শরীফ",
        "প্যারাডক্সিক্যাল সাজিদ",
        "তাফসীর",
        "প্রত্যাবর্তন",
        "আর রাহীকুল মাখতুম",
        "আবুবাহ জায়দীর",
        "কিতাবুল ফিতান",
        "রিয়াজুস সালেহীন",
        "আল বিদায়া ওয়ান নিহায়া",
        "প্রোথিত পুস্তক",
        "হাদিস",
    ];

    return (
        <div className="max-w-5xl mt-4 bg-[#FFFFFF] shadow-sm rounded mx-auto p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                People also searched for
            </h2>
            <div className="flex flex-wrap gap-3">
                {searches.map((item, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 text-sm rounded-full border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer transition"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
