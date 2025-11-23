import Image from "next/image";

// --- TYPE DEFINITION ---
interface Product {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  originalPrice: number;
  discountedPrice: number;
  tagText?: string;
}

// --- MOCK DATA ---
const products: Product[] = [
  {
    id: 1,
    title: "একনজরে কুরআন",
    author: "ড. মিজানুর রহমান আযহারী",
    imageUrl:
      "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Eak_Nozore_quran-Dr_Mizanur_Rahman_Azhari-2d298-449989.png",
    discount: 15,
    rating: 5,
    reviews: 738,
    inStock: true,
    originalPrice: 1870,
    discountedPrice: 1590,
    tagText: "স্টক আউট",
  },
  {
    id: 2,
    title: "Odvut Maqlokh",
    author: "OnnoRokom BigganBaksho",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 0,
    rating: 4,
    reviews: 53,
    inStock: true,
    originalPrice: 980,
    discountedPrice: 980,
  },
  {
    id: 3,
    title: "প্লেইন বায়োলজির ইশকুল গ্রাফিক্স বান্ডেল",
    author: "সুহাস সাদিক তন্ময়, কায়েস কাওসার (কোচ)",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 14,
    rating: 5,
    reviews: 104,
    inStock: true,
    originalPrice: 580,
    discountedPrice: 499,
    tagText: "স্টক আউট",
  },
  {
    id: 4,
    title: "$100M অফার",
    author: "এলেক্স হরமோজি",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 14,
    rating: 5,
    reviews: 2,
    inStock: true,
    originalPrice: 480,
    discountedPrice: 413,
  },
  {
    id: 5,
    title: "রিসেন্ট ভিউ",
    author: "মোঃ শাহিন হোসেন",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 19,
    rating: 3,
    reviews: 2,
    inStock: true,
    originalPrice: 160,
    discountedPrice: 130,
  },
  {
    id: 6,
    title: "রাসূলুল্লাহ (সা.) এর সকাল সন্ধ্যার দুআ ও যিকর এবং দোআর কার্ড",
    author: "শায়খ আহমাদুল্লাহ",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 9,
    rating: 5,
    reviews: 816,
    inStock: true,
    originalPrice: 0,
    discountedPrice: 32,
    tagText: "স্টক আউট",
  },
  {
    id: 7,
    title: "ইলিশ কিনবো গল্পের ঝুলি নিয়ে (বুক-১-৩)",
    author: "সাইফুর রহমান খান",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 30,
    rating: 5,
    reviews: 5,
    inStock: true,
    originalPrice: 360,
    discountedPrice: 252,
    tagText: "স্টক আউট",
  },
  {
    id: 8,
    title: "না বলার কৌশল",
    author: "আশরাফি তুশহার",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 20,
    rating: 5,
    reviews: 1,
    inStock: true,
    originalPrice: 400,
    discountedPrice: 320,
    tagText: "স্টক আউট",
  },
  {
    id: 9,
    title: "$100 M অফার",
    author: "এলেক্স হরমোজি",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 14,
    rating: 0,
    reviews: 0,
    inStock: true,
    originalPrice: 340,
    discountedPrice: 292,
  },
  {
    id: 10,
    title: "একা থাকতে শিখুন",
    author: "আশরাফি তুশহার",
    imageUrl: "https://placehold.co/300x450/EAE9E5/333333?text=Book+Cover",
    discount: 20,
    rating: 5,
    reviews: 3,
    inStock: true,
    originalPrice: 400,
    discountedPrice: 320,
    tagText: "স্টক আউট",
  },
];

// --- SVG ICONS ---
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#FBBF24" : "none"}
    stroke={filled ? "#FBBF24" : "#D1D5DB"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// --- DISCOUNT BADGE COMPONENT ---
const DiscountBadge = ({ discount }: { discount: number }) => {
  if (discount <= 0) return null;

  return (
    <div className="absolute top-[-5px] left-[-5px] z-10 w-16 h-16">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50,0 L 65,15 L 85,15 L 85,35 L 100,50 L 85,65 L 85,85 L 65,85 L 50,100 L 35,85 L 15,85 L 15,65 L 0,50 L 15,35 L 15,15 L 35,15 Z"
          fill="#EF4444"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold leading-tight">
        <span className="text-xl">{discount}%</span>
        <span className="text-sm">OFF</span>
      </div>
    </div>
  );
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group w-full max-w-sm mx-auto font-sans  border border-transparent hover:border-gray-200 transition-all duration-300">
      <div className="relative overflow-hidden  p-4">
        <DiscountBadge discount={product.discount} />
        <Image
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-auto aspect-[2/3] object-cover"
          height={372}
          width={260}
        />
        {product.tagText && (
          <div className="absolute bottom-5 -right-10 transform rotate-[-45deg] bg-[#16a34a] text-white text-xs px-10 py-1 font-semibold">
            {product.tagText}
          </div>
        )}
        <div className="absolute inset-0 hover:bg-[#00000044] bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button className="bg-[#009FDA] text-white px-8 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-md text-[#333333]">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.author}</p>
        <div className="flex justify-center items-center mt-2 space-x-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < product.rating} />
          ))}
          <span className="text-sm text-gray-400">({product.reviews})</span>
        </div>
        {product.inStock && (
          <p className="text-sm text-[#16a34a] font-semibold mt-2">
            Product in Stock
          </p>
        )}
        <div className="mt-2 flex justify-center items-baseline space-x-2">
          {product.originalPrice > 0 &&
            product.originalPrice !== product.discountedPrice && (
              <p className="text-md text-gray-400 line-through">
                TK. {product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          <p className="text-lg font-bold text-[#f57224]">
            TK. {product.discountedPrice.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function MoreProducts() {
  return (
    <div className="bg-[#F8F8F8] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-[#FFFFEB] p-6 rounded-md shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          কার্টে আরও যা যুক্ত করতে পারেন
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
