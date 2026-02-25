import { Package, Truck, Shield, HeadphonesIcon } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0692cb] to-[#0582b8] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">আমাদের সম্পর্কে</h1>
          <p className="text-xl md:text-2xl">
            বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">BDM Bazar কে?</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              BDM Bazar হলো বাংলাদেশের একটি আধুনিক ই-কমার্স প্ল্যাটফর্ম যা ২০২৬ সালে প্রতিষ্ঠিত হয়েছে। 
              আমরা আমাদের গ্রাহকদের জন্য বই, ইলেকট্রনিক্স, ফ্যাশন এবং আরও অনেক ধরনের পণ্য সরবরাহ করি।
            </p>
            <p>
              আমাদের লক্ষ্য হলো বাংলাদেশের মানুষের কাছে সহজ, নিরাপদ এবং সাশ্রয়ী মূল্যে অনলাইন শপিংয়ের 
              সুবিধা পৌঁছে দেওয়া। আমরা বিশ্বাস করি যে প্রতিটি গ্রাহক সেরা পণ্য এবং সেবা পাওয়ার যোগ্য।
            </p>
            <p>
              আমাদের দক্ষ টিম সর্বদা গ্রাহক সন্তুষ্টি নিশ্চিত করতে কাজ করে যাচ্ছে। আমরা শুধু পণ্য বিক্রি করি না, 
              বরং একটি বিশ্বস্ত সম্পর্ক তৈরি করি।
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">আমাদের লক্ষ্য</h3>
            <p className="text-gray-700 leading-relaxed">
              বাংলাদেশের প্রতিটি মানুষের কাছে মানসম্পন্ন পণ্য সহজলভ্য করা এবং অনলাইন শপিংকে 
              আরও সহজ, নিরাপদ ও আনন্দদায়ক করে তোলা। আমরা চাই প্রতিটি গ্রাহক আমাদের সেবায় সন্তুষ্ট থাকুক।
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">আমাদের দৃষ্টিভঙ্গি</h3>
            <p className="text-gray-700 leading-relaxed">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং জনপ্রিয় অনলাইন শপিং প্ল্যাটফর্ম হিসেবে নিজেদের 
              প্রতিষ্ঠিত করা এবং ডিজিটাল বাংলাদেশ গড়ার ক্ষেত্রে গুরুত্বপূর্ণ ভূমিকা পালন করা।
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">কেন BDM Bazar?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-[#0692cb]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">বিশাল সংগ্রহ</h4>
              <p className="text-gray-600 text-sm">
                হাজারো পণ্যের বিশাল সংগ্রহ থেকে আপনার পছন্দের পণ্য খুঁজে নিন
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">দ্রুত ডেলিভারি</h4>
              <p className="text-gray-600 text-sm">
                সারাদেশে দ্রুত এবং নিরাপদ ডেলিভারি সেবা
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">নিরাপদ পেমেন্ট</h4>
              <p className="text-gray-600 text-sm">
                সম্পূর্ণ নিরাপদ এবং সুরক্ষিত পেমেন্ট সিস্টেম
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <HeadphonesIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">২৪/৭ সাপোর্ট</h4>
              <p className="text-gray-600 text-sm">
                যেকোনো সমস্যায় আমাদের কাস্টমার সাপোর্ট টিম সবসময় আপনার পাশে
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">আমাদের মূল্যবোধ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">গ্রাহক সন্তুষ্টি</h4>
              <p className="text-gray-700">
                গ্রাহকের সন্তুষ্টিই আমাদের প্রথম অগ্রাধিকার। আমরা সর্বদা গ্রাহকদের চাহিদা পূরণে প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">বিশ্বস্ততা</h4>
              <p className="text-gray-700">
                আমরা আমাদের প্রতিটি প্রতিশ্রুতি রক্ষা করি এবং গ্রাহকদের সাথে স্বচ্ছ ও সৎ থাকি।
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">উৎকর্ষতা</h4>
              <p className="text-gray-700">
                আমরা সর্বদা সেরা মানের পণ্য এবং সেবা প্রদানে বিশ্বাসী এবং ক্রমাগত উন্নতির চেষ্টা করি।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
