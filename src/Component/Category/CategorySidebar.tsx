"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TCategory } from "@/types/category/category";
import { TProduct } from "@/types/product/product";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";

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

interface CategorySidebarProps {
  categoryList?: TCategory[];
  mainCategory?: string;
  categories?: TCategory[];
  currentCategory?: TCategory;
  onFiltersChange?: (filters: FilterState) => void;
  initialSortBy?: string;
}

export default function CategorySidebar({ categoryList, mainCategory, categories = [], currentCategory, onFiltersChange, initialSortBy = "best-seller" }: CategorySidebarProps) {
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [inStock, setInStock] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [discountRange, setDiscountRange] = useState<[number, number]>([0, 100]);
  const [publisherSearch, setPublisherSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");

  // Update sortBy when initialSortBy changes
  useEffect(() => {
    setSortBy(initialSortBy);
  }, [initialSortBy]);

  // Update filters whenever any filter changes
  useEffect(() => {
    const filters: FilterState = {
      selectedSubCategories,
      sortBy,
      inStock,
      selectedPublishers,
      selectedLanguages,
      selectedRatings,
      priceRange,
      discountRange
    };
    onFiltersChange?.(filters);
  }, [selectedSubCategories, sortBy, inStock, selectedPublishers, selectedLanguages, selectedRatings, priceRange, discountRange, onFiltersChange]);

  const { data: allProductsData } = useGetAllProductsQuery(undefined);

  const handleSubCategoryToggle = (subCategory: string) => {
    const newSubCategories = selectedSubCategories.includes(subCategory) 
      ? selectedSubCategories.filter(item => item !== subCategory)
      : [...selectedSubCategories, subCategory];
    
    setSelectedSubCategories(newSubCategories);
  };
  
  // Only show categories from the current main category
  const displayCategories = useMemo(() => {
    if (categoryList) return categoryList;
    if (currentCategory?.mainCategory) {
      return categories.filter(cat => cat.mainCategory === currentCategory.mainCategory);
    }
    if (mainCategory) {
      return categories.filter(cat => cat.mainCategory === mainCategory);
    }
    return [];
  }, [categoryList, currentCategory, mainCategory, categories]);

  const { publishers, languages, maxPrice, maxDiscount } = useMemo(() => {
    const publishersMap = new Map<string, string>();
    const languagesMap = new Map<string, string>();
    let maxPrice = 0;
    let maxDiscount = 0;
    
    const products = Array.isArray(allProductsData) ? allProductsData : ((allProductsData as unknown) as Record<string, unknown>)?.data as TProduct[] || [];

    products.forEach((product: TProduct) => {
      if (product.categoryAndTags?.publisher) {
        const original = product.categoryAndTags.publisher.trim();
        const normalized = original.toLowerCase();
        if (normalized && !publishersMap.has(normalized)) {
          publishersMap.set(normalized, original);
        }
      }
      if (product.bookInfo?.specification?.publisher) {
        const original = product.bookInfo.specification.publisher.trim();
        const normalized = original.toLowerCase();
        if (normalized && !publishersMap.has(normalized)) {
          publishersMap.set(normalized, original);
        }
      }
      if (product.bookInfo?.specification?.language) {
        const original = product.bookInfo.specification.language.trim();
        const normalized = original.toLowerCase();
        if (normalized && !languagesMap.has(normalized)) {
          languagesMap.set(normalized, original);
        }
      }
      if (product.productInfo?.price > maxPrice) {
        maxPrice = product.productInfo.price;
      }
      if (product.productInfo?.discount && product.productInfo.discount > maxDiscount) {
        maxDiscount = product.productInfo.discount;
      }
    });

    return {
      publishers: Array.from(publishersMap.values()),
      languages: Array.from(languagesMap.values()),
      maxPrice: Math.ceil(maxPrice / 100) * 100,
      maxDiscount: Math.ceil(maxDiscount)
    };
  }, [allProductsData]);

  return (
    <div className="space-y-4">
      {/* Shop by Categories or Subcategories */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentCategory?.subCategories && currentCategory.subCategories.length > 0 
            ? "Shop by Subcategories" 
            : "Shop by Categories"}
        </h3>
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <div className="space-y-1 pr-2">
            {/* Show subcategories if current category has them */}
            {currentCategory?.subCategories && currentCategory.subCategories.length > 0 ? (
              currentCategory.subCategories.map((subCategory, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer py-1.5 hover:bg-gray-50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={selectedSubCategories.includes(subCategory)}
                    onChange={() => handleSubCategoryToggle(subCategory)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {subCategory}
                  </span>
                </label>
              ))
            ) : (
              /* Show categories as links only (no checkboxes) */
              displayCategories.length > 0 ? displayCategories.map((category) => (
                <div key={category._id}>
                  <Link 
                    href={`/category/subcategory/${category.slug}`}
                    className="group flex items-center text-sm text-gray-700 py-1.5 hover:bg-gray-50 rounded px-2 transition-colors"
                  >
                    <div className="w-2 h-2 border border-gray-400 rounded-full mr-3 flex-shrink-0 group-hover:border-blue-500 group-hover:bg-blue-500 transition-colors"></div>
                    <span className="group-hover:text-blue-600">{category.name}</span>
                  </Link>
                </div>
              )) : (
                <p className="text-sm text-gray-500 px-2">No categories available</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* In Stock */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-800">In Stock</span>
        </label>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sort</h3>
          <button 
            onClick={() => {
              setSortBy("best-seller");
              setSelectedSubCategories([]);
              setInStock(false);
              setSelectedPublishers([]);
              setSelectedLanguages([]);
              setSelectedRatings([]);
              setPriceRange([0, 10000]);
              setDiscountRange([0, 100]);
            }}
            className="text-sm hover:underline"
            style={{color: '#0397D3'}}
          >
            Reset All
          </button>
        </div>
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
                checked={sortBy === option.value}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
          <button className="text-sm hover:underline" style={{color: '#0397D3'}}>
            Reset Filter
          </button>
        </div>

        {/* By Publishers - Only show for book categories */}
        {(mainCategory?.toLowerCase() === 'book' || currentCategory?.mainCategory?.toLowerCase() === 'book') && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-800 mb-3">By Publishers</h4>
          {/* Search Box */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search publishers..."
              value={publisherSearch}
              onChange={(e) => setPublisherSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div className="space-y-1 pr-2">
              {publishers
                .filter(publisher => publisher.toLowerCase().includes(publisherSearch.toLowerCase()))
                .map((publisher, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={selectedPublishers.includes(publisher)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPublishers([...selectedPublishers, publisher]);
                      } else {
                        setSelectedPublishers(selectedPublishers.filter(p => p !== publisher));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{publisher}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Price</h4>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">৳{priceRange[0]}</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">৳{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Languages - Only show for book categories */}
        {(mainCategory?.toLowerCase() === 'book' || currentCategory?.mainCategory?.toLowerCase() === 'book') && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Languages</h4>
          {/* Search Box */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search languages..."
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div className="space-y-1 pr-2">
              {languages
                .filter(language => language.toLowerCase().includes(languageSearch.toLowerCase()))
                .map((language, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLanguages([...selectedLanguages, language]);
                      } else {
                        setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Discount Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Discount</h4>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{discountRange[0]}%</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{discountRange[1]}%</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxDiscount}
            value={discountRange[1]}
            onChange={(e) => setDiscountRange([discountRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Ratings */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-3">Ratings</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRatings([...selectedRatings, rating]);
                    } else {
                      setSelectedRatings(selectedRatings.filter(r => r !== rating));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}