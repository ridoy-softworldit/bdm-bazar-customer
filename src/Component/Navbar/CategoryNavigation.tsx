"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetAllCategoriesQuery } from "@/redux/featured/category/categoryApi";
import { TCategory } from "@/types/category/category";
import { X } from "lucide-react";

interface CategoryNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function CategoryNavigation({ isMobileMenuOpen, setIsMobileMenuOpen }: CategoryNavigationProps) {
  const pathname = usePathname();
  
  // Bengali translation function
  const getBengaliName = (englishName: string) => {
    const translations: Record<string, string> = {
      'book': 'বই',
      'electronics': 'ইলেক্ট্রনিক্স',
      'superstore': 'সুপার স্টোর',
      'kids-zone': 'কিডস জোন'
    };
    return translations[englishName.toLowerCase()] || englishName;
  };
  
  // Fetch categories from API
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const categories = (Array.isArray(categoriesResponse) ? categoriesResponse : ((categoriesResponse as unknown) as Record<string, unknown>)?.data || []) as TCategory[];
  
  // Group categories by mainCategory
  const groupedCategories = categories.reduce((acc: Record<string, TCategory[]>, category) => {
    const mainCat = category.mainCategory || 'other';
    if (!acc[mainCat]) acc[mainCat] = [];
    acc[mainCat].push(category);
    return acc;
  }, {});
  
  const mainCategories = Object.keys(groupedCategories);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                হোম
              </Link>
              
              {mainCategories.map((mainCat) => (
                <div key={mainCat} className="space-y-2">
                  <Link
                    href={`/category/${mainCat}`}
                    className="block py-2 text-gray-800 hover:text-blue-600 font-medium capitalize"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getBengaliName(mainCat)}
                  </Link>
                  
                  {groupedCategories[mainCat]?.slice(0, 5).map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/subcategory/${category.slug}`}
                      className="block py-1 pl-4 text-sm text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="bg-white border-t border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* First Layer - Home + Main Categories */}
        <div className="flex justify-center items-center py-0 text-sm bg-white">
          <div className="flex">
            {/* Home Tab */}
            <Link
              href="/"
              className={`px-6 py-3 font-medium border-b-2 transition-colors duration-200 ${
                pathname === "/" 
                  ? "border-blue-600" 
                  : "text-gray-700 border-transparent"
              }`}
              style={{
                color: pathname === "/" ? '#0397D3' : '#374151',
                borderBottomColor: pathname === "/" ? '#0397D3' : 'transparent'
              }}
            >
              হোম
            </Link>
            
            {/* Main Category Tabs */}
            {mainCategories.map((mainCat) => {
              // Check if current page belongs to this main category
              const isActive = pathname === `/category/${mainCat}` || 
                (pathname?.startsWith('/category/subcategory/') && (() => {
                  const rawSlug = pathname.split('/').pop();
                  const slug = decodeURIComponent(rawSlug || '');
                  const currentCategory = categories.find(cat => cat.slug === slug);
                  return currentCategory?.mainCategory === mainCat;
                })());
              
              return (
                <Link
                  key={mainCat}
                  href={`/category/${mainCat}`}
                  className={`px-6 py-3 capitalize font-medium border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "border-blue-600" 
                      : "text-gray-700 border-transparent"
                  }`}
                  style={{
                    color: isActive ? '#0397D3' : '#374151',
                    borderBottomColor: isActive ? '#0397D3' : 'transparent'
                  }}
                >
                  {getBengaliName(mainCat)}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Second Layer - Category Names (Show on home, category, and product pages) */}
        {(pathname === "/" || pathname?.startsWith('/category/') || pathname?.startsWith('/product/')) && (
          <div className="bg-white border-t border-gray-200 py-3">
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap gap-6 justify-center">
                {(() => {
                  // Determine which main category to show
                  let targetMainCategory = null;
                  let currentCategory = null;

                  // Show book categories for home page and product pages
                  if (pathname === "/" || pathname?.startsWith('/product/')) {
                    targetMainCategory = "book";
                  }
                  // Check if it's a main category page
                  else {
                    const currentMainCat = mainCategories.find(mainCat => pathname === `/category/${mainCat}`);
                    if (currentMainCat) {
                      targetMainCategory = currentMainCat;
                    }
                    
                    // Check if it's a subcategory page
                    if (pathname?.startsWith('/category/subcategory/')) {
                      const rawSlug = pathname.split('/').pop();
                      const slug = decodeURIComponent(rawSlug || '');
                      currentCategory = categories.find(cat => cat.slug === slug);
                      if (currentCategory?.mainCategory) {
                        targetMainCategory = currentCategory.mainCategory;
                      }
                    }
                    
                    // Check if it's an individual category page
                    if (!targetMainCategory) {
                      currentCategory = categories.find(cat => pathname === `/category/${cat.slug}`);
                      if (currentCategory?.mainCategory) {
                        targetMainCategory = currentCategory.mainCategory;
                      }
                    }
                  }

                  // Show categories for the determined main category (max 9)
                  if (targetMainCategory && groupedCategories[targetMainCategory]) {
                    return groupedCategories[targetMainCategory].slice(0, 9).map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/subcategory/${category.slug}`}
                        className="text-sm transition-colors duration-200"
                        style={{
                          color: currentCategory && category._id === currentCategory._id ? '#0397D3' : '#374151'
                        }}
                      >
                        {category.name}
                      </Link>
                    ));
                  }
                  
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}