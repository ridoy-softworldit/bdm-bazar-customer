"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetAllCategoriesQuery } from "@/redux/featured/category/categoryApi";
import { TCategory } from "@/types/category/category";
import { Filter, ArrowUpDown } from "lucide-react";

import CategorySidebar from "@/Component/Category/CategorySidebar";
import ProductGrid from "@/Component/Category/ProductGrid";

interface FilterState {
  selectedSubCategories: string[];
  sortBy: string;
  inStock: boolean;
  selectedPublishers: string[];
  selectedLanguages: string[];
  selectedRatings: number[];
  priceRange: [number, number];
  discountRange: [number, number];
}

export default function MainCategoryPage() {
  const params = useParams();
  const mainCategory = params.mainCategory as string;
  const [filters, setFilters] = useState<FilterState>({
    selectedSubCategories: [],
    sortBy: 'best-seller',
    inStock: false,
    selectedPublishers: [],
    selectedLanguages: [],
    selectedRatings: [],
    priceRange: [0, 10000],
    discountRange: [0, 100]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const categories = (Array.isArray(categoriesResponse) ? categoriesResponse : ((categoriesResponse as unknown) as Record<string, unknown>)?.data || []) as TCategory[];
  
  // Filter categories by main category
  const categoryList = categories.filter(cat => cat.mainCategory === mainCategory);

  // Don't block rendering if no categories found - we can still show products
 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <CategorySidebar 
              categoryList={categoryList.length > 0 ? categoryList : undefined}
              mainCategory={mainCategory}
              categories={categories}
              onFiltersChange={setFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Sort/Filter Buttons */}
            <div className="lg:hidden flex gap-2 mb-4">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Mobile Filter Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/10 z-50 flex items-end">
                <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Filter</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Filter Content */}
                  <div className="overflow-y-auto max-h-[60vh] p-4">
                    <CategorySidebar 
                      categoryList={categoryList.length > 0 ? categoryList : undefined}
                      mainCategory={mainCategory}
                      categories={categories}
                      onFiltersChange={setFilters}
                    />
                  </div>
                  
                  {/* Filter Actions */}
                  <div className="flex gap-3 p-4 border-t bg-white">
                    <button 
                      onClick={() => {
                        setFilters({
                          selectedSubCategories: [],
                          sortBy: 'best-seller',
                          inStock: false,
                          selectedPublishers: [],
                          selectedLanguages: [],
                          selectedRatings: [],
                          priceRange: [0, 10000],
                          discountRange: [0, 100]
                        });
                      }}
                      className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Sort Modal */}
            {showSort && (
              <div className="lg:hidden fixed inset-0 bg-black/10 z-50 flex items-end">
                <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
                  {/* Sort Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Sort</h3>
                    <button 
                      onClick={() => setShowSort(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Sort Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {[
                        { value: "best-seller", label: "Best Seller" },
                        { value: "new-released", label: "New Released" },
                        { value: "price-low-high", label: "Price - Low to High" },
                        { value: "price-high-low", label: "Price - High to Low" },
                        { value: "discount-low-high", label: "Discount - Low to High" },
                        { value: "discount-high-low", label: "Discount - High to Low" }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            value={option.value}
                            checked={filters.sortBy === option.value}
                            onChange={(e) => {
                              setFilters({...filters, sortBy: e.target.value});
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sort Actions */}
                  <div className="flex gap-3 p-4 border-t bg-white">
                    <button 
                      onClick={() => {
                        setFilters({...filters, sortBy: 'best-seller'});
                      }}
                      className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setShowSort(false)}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <ProductGrid mainCategory={mainCategory} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}