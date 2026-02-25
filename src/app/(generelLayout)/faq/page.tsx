"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "BDM Bazar ডট কম!!! এটা আবার কী?",
    answer: "BDM Bazar হলো বাংলাদেশের একটি অনলাইন শপিং প্ল্যাটফর্ম যেখানে আপনি বই, ইলেকট্রনিক্স এবং অন্যান্য পণ্য কিনতে পারবেন।"
  },
  {
    question: "BDM Bazar-এ একাউন্ট খুলবো কীভাবে বা লগ ইন করবো কীভাবে?",
    answer: "সাইটের উপরের ডান কোণে 'Sign In' বাটনে ক্লিক করুন। তারপর 'Create Account' অপশনে ক্লিক করে আপনার নাম, ইমেইল এবং পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন করুন অথবা Google বা Facebook দিয়ে সরাসরি লগইন করতে পারবেন।"
  },
  {
    question: "অনলাইনে BDM Bazar-এ  অর্ডার করবো কীভাবে?",
    answer: "পছন্দের পণ্য সিলেক্ট করুন, 'Add to Cart' বাটনে ক্লিক করুন। তারপর কার্টে গিয়ে 'Checkout' করুন এবং ডেলিভারি ও পেমেন্ট তথ্য দিয়ে অর্ডার সম্পন্ন করুন।"
  },
   {
    question: "আচ্ছা, BDM Bazar-এ  ডেলিভারি চার্জ কত?",
    answer: "ঢাকার ভিতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা ডেলিভারি চার্জ। নির্দিষ্ট পরিমাণের উপরে অর্ডারে ফ্রি ডেলিভারি পাবেন।"
  },
  {
    question: "আচ্ছা BDM Bazar-এ  ধরেন অর্ডার করলাম, কিন্তু পণ্য হাতে পাব কবে?",
    answer: "ঢাকার ভিতরে ২-৩ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে পণ্য ডেলিভারি করা হয়।"
  },
  {
    question: "কিভাবে আমার অর্ডারটি ট্র্যাকিং করবো?",
    answer: "আপনার একাউন্টে লগইন করে 'My Orders' সেকশনে গিয়ে অর্ডার ট্র্যাক করতে পারবেন।"
  },
  
  {
    question: "আচ্ছা, হাতে পেয়ে দেখলাম সঠিক পণ্য আসে না বা খারাপ পণ্য পেয়েছি। তখন কী করবো?",
    answer: "অবিলম্বে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন। আমরা পণ্য রিপ্লেস বা রিফান্ড করে দেব।"
  },
  {
    question: "BDM Bazar-এর মাধ্যমে কি আমার প্রিয়জনকে কোন কিছু গিফট করতে পারবো?",
    answer: "হ্যাঁ, চেকআউটের সময় ডেলিভারি অ্যাড্রেসে আপনার প্রিয়জনের ঠিকানা দিয়ে গিফট পাঠাতে পারবেন।"
  },
  {
    question: "পণ্য কেনার সময়ে প্রোমোকোড দেওয়ার অপশন আছে। এই প্রোমোকোডটা কী?",
    answer: "প্রোমোকোড হলো বিশেষ ডিসকাউন্ট কোড যা ব্যবহার করে আপনি অতিরিক্ত ছাড় পাবেন।"
  },
  {
    question: "প্রোডাক্ট রিভিউ ও রেটিং কি? কিভাবে রিভিউ ও রেটিং দিতে পারবো?",
    answer: "পণ্য কেনার পর প্রোডাক্ট পেজে গিয়ে আপনার অভিজ্ঞতা শেয়ার করতে পারবেন এবং ১-৫ স্টার রেটিং দিতে পারবেন।"
  },
   {
    question: "সামাজিক মিডিয়ায় আমি কীভাবে কোনও বই/পণ্য লিঙ্কটি Share করতে পারি?",
    answer: "প্রোডাক্ট পেজে শেয়ার বাটনে ক্লিক করে ফেসবুক, টুইটার বা অন্যান্য সোশ্যাল মিডিয়ায় শেয়ার করতে পারবেন।"
  },
  {
    question: "BDM Bazar একাউন্ট এর পাসওয়ার্ড রিকভার করবো কীভাবে?",
    answer: "লগইন পেজে 'Forgot Password' লিংকে ক্লিক করুন। আপনার রেজিস্টার্ড ইমেইল দিন এবং পাসওয়ার্ড রিসেট লিংক পাবেন।"
  },
  {
    question: "উইশ লিস্ট কী?",
    answer: "উইশ লিস্ট হলো আপনার পছন্দের পণ্যের একটি তালিকা যা পরে কিনতে চান। হার্ট আইকনে ক্লিক করে যোগ করুন।"
  }
 
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQ</h1>
          <p className="text-lg text-gray-600">
            আপনাদের মনে হুট হাট করে প্রায়শই কিছু প্রশ্ন উকি দেয়। দেখেন তো নিচের প্রশ্নগুলোর মধ্যে কমন পড়েছে কিনা?
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="flex-shrink-0 w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="flex-shrink-0 w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            আপনার প্রশ্নের উত্তর খুঁজে পাননি?
          </p>
          <Link
            href="/contact-us"
            className="inline-block px-6 py-3 bg-[#0692cb] text-white font-medium rounded-md hover:bg-[#0582b8] transition-colors"
          >
            আমাদের সাথে যোগাযোগ করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
