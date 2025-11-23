"use client";

import Link from "next/link";
import { TCategory } from "@/types/category/category";

interface CategoryNavigationProps {
  categories: TCategory[];
  mainCategory?: string;
  categoryList?: TCategory[];
  currentCategory?: TCategory;
}

export default function CategoryNavigation({ categories, mainCategory, categoryList, currentCategory }: CategoryNavigationProps) {
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

  // Group categories by mainCategory
  const groupedCategories = categories.reduce((acc: Record<string, TCategory[]>, category) => {
    const mainCat = category.mainCategory || 'other';
    if (!acc[mainCat]) acc[mainCat] = [];
    acc[mainCat].push(category);
    return acc;
  }, {});
  
  const mainCategories = Object.keys(groupedCategories);

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* First Layer - Home + Main Categories */}
        <div className="flex justify-center items-center py-3 text-sm text-gray-700 border-b border-gray-100">
          <div className="flex space-x-6">
            <Link
              href="/"
              className="px-4 py-2 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
              style={{color: '#0397D3'}}
            >
              হোম
            </Link>
            
            {mainCategories.map((mainCat) => (
              <Link
                key={mainCat}
                href={`/category/${mainCat}`}
                className={`px-4 py-2 capitalize font-medium rounded-lg transition-colors ${
                  (mainCategory === mainCat) || (currentCategory?.mainCategory === mainCat)
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
                style={{
                  color: (mainCategory === mainCat) || (currentCategory?.mainCategory === mainCat) ? '#0397D3' : '#374151'
                }}
              >
                {getBengaliName(mainCat)}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Second Layer - Category Names */}
        {(categoryList && categoryList.length > 0) && (
          <div className="py-3">
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap gap-4 justify-center">
                {categoryList.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/subcategory/${category.slug}`}
                    className="px-3 py-1 text-sm hover:bg-blue-50 rounded-md transition-colors duration-200"
                    style={{color: '#6b7280'}}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Show related categories for individual category pages */}
        {currentCategory && currentCategory.mainCategory && (
          <div className="py-3">
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap gap-4 justify-center">
                {categories
                  .filter(cat => cat.mainCategory === currentCategory.mainCategory)
                  .map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/subcategory/${category.slug}`}
                      className={`px-3 py-1 text-sm transition-colors duration-200 rounded-md ${
                        category._id === currentCategory._id
                          ? "bg-blue-50"
                          : "hover:bg-blue-50"
                      }`}
                      style={{
                        color: category._id === currentCategory._id ? '#0397D3' : '#6b7280'
                      }}
                    >
                      {category.name}
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}