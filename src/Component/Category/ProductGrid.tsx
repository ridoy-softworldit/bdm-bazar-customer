"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/lib/slices/cartSlice";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/featured/category/categoryApi";
import { TCategory } from "@/types/category/category";
import { TProduct } from "@/types/product/product";



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

interface ProductGridProps {
  mainCategory?: string;
  categoryId?: string;
  categoryName?: string;
  filters?: FilterState;
  currentCategory?: TCategory;
  onFiltersChange?: (filters: FilterState) => void;
}

export default function ProductGrid({ mainCategory, categoryId, filters, currentCategory, onFiltersChange }: ProductGridProps) {
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const dispatch = useAppDispatch();
  
  const { data: allProductsData, isLoading: loading } = useGetAllProductsQuery(undefined);
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  
  // Get all categories for the main category
  const allCategories = (Array.isArray(categoriesResponse) ? categoriesResponse : ((categoriesResponse as unknown) as Record<string, unknown>)?.data || []) as TCategory[];
  
  // Get products first for debugging
  const allProducts = Array.isArray(allProductsData) ? allProductsData : ((allProductsData as unknown) as Record<string, unknown>)?.data as TProduct[] || [];
  
  // Apply all filters to products
  const filteredProducts = Array.isArray(allProducts) ? allProducts.filter((product: TProduct) => {
    // If no filters, show all products
    if (!mainCategory && !categoryId) return true;
    
    // Filter by specific categoryId (individual category page)
    if (categoryId) {
      const productCategories = product.categoryAndTags?.categories || [];
      
      // Check if product belongs to this specific category
      const belongsToCategory = productCategories.some((cat: string | { _id: string }) => 
        typeof cat === 'string' ? cat === categoryId : cat._id === categoryId
      );
      
      // Only show products that belong to this specific category
      if (!belongsToCategory) {
        return false;
      }
      
      // If subcategories are selected, filter by them
      if (filters?.selectedSubCategories && filters.selectedSubCategories.length > 0) {
        const productSubCategories = product.categoryAndTags?.subCategories || [];
        
        // Check if product matches any selected subcategory
        return filters.selectedSubCategories.some(subCat => 
          productSubCategories.includes(subCat)
        );
      }
      
      // Show all products from this specific category
      return true;
    }
    
    // If we have subcategory filters but no specific categoryId, filter by subcategories globally
    if (filters?.selectedSubCategories && filters.selectedSubCategories.length > 0) {
      const productSubCategories = product.categoryAndTags?.subCategories || [];
      return filters.selectedSubCategories.some(subCat => 
        productSubCategories.includes(subCat)
      );
    }
    
    // Filter by mainCategory (main category page like /category/book)
    if (mainCategory) {
      // Check if product belongs to this main category via populated categories
      const productCategories = product.categoryAndTags?.categories || [];
      const belongsToMainCategory = productCategories.some((cat: string | { mainCategory?: string }) => 
        typeof cat === 'object' && cat.mainCategory === mainCategory
      );
      
      return belongsToMainCategory;
    }
    
    return false;
  }).filter((product: TProduct) => {
    // Apply additional filters
    if (!filters) return true;
    
    // In Stock filter
    if (filters.inStock && !product.productInfo.inStock) {
      return false;
    }
    
    // Publisher filter
    if (filters.selectedPublishers.length > 0) {
      const productPublisher = product.categoryAndTags?.publisher || 
        product.bookInfo?.specification?.publisher;
      if (!productPublisher || !filters.selectedPublishers.includes(productPublisher)) {
        return false;
      }
    }
    
    // Language filter
    if (filters.selectedLanguages.length > 0) {
      const productLanguage = product.bookInfo?.specification?.language;
      if (!productLanguage || !filters.selectedLanguages.includes(productLanguage)) {
        return false;
      }
    }
    
    // Price range filter
    const productPrice = product.productInfo.salePrice || product.productInfo.price;
    if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
      return false;
    }
    
    // Discount range filter
    if (product.productInfo.salePrice) {
      const discount = Math.round(((product.productInfo.price - product.productInfo.salePrice) / product.productInfo.price) * 100);
      if (discount < filters.discountRange[0] || discount > filters.discountRange[1]) {
        return false;
      }
    } else if (filters.discountRange[0] > 0) {
      return false; // No discount but minimum discount required
    }
    
    // Rating filter
    if (filters.selectedRatings.length > 0) {
      const productRating = Math.floor(product.averageRating || 0);
      if (!filters.selectedRatings.includes(productRating)) {
        return false;
      }
    }
    
    return true;
  }) : [];
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a: TProduct, b: TProduct) => {
    if (!filters?.sortBy || filters.sortBy === 'best-seller') {
      return (b.soldCount || 0) - (a.soldCount || 0);
    }
    
    switch (filters.sortBy) {
      case 'new-released':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'price-low-high': {
        return (a.productInfo.salePrice || a.productInfo.price) - (b.productInfo.salePrice || b.productInfo.price);
      }
      case 'price-high-low': {
        return (b.productInfo.salePrice || b.productInfo.price) - (a.productInfo.salePrice || a.productInfo.price);
      }
      case 'discount-low-high': {
        const discountA = a.productInfo.salePrice ? Math.round(((a.productInfo.price - a.productInfo.salePrice) / a.productInfo.price) * 100) : 0;
        const discountB = b.productInfo.salePrice ? Math.round(((b.productInfo.price - b.productInfo.salePrice) / b.productInfo.price) * 100) : 0;
        return discountA - discountB;
      }
      case 'discount-high-low': {
        const discountA2 = a.productInfo.salePrice ? Math.round(((a.productInfo.price - a.productInfo.salePrice) / a.productInfo.price) * 100) : 0;
        const discountB2 = b.productInfo.salePrice ? Math.round(((b.productInfo.price - b.productInfo.salePrice) / b.productInfo.price) * 100) : 0;
        return discountB2 - discountA2;
      }
      default:
        return 0;
    }
  });
  
  const products = sortedProducts;
  const totalProducts = products.length;



  // Get subcategories - either from current category's subCategories array or other categories in same main category
  const getSubcategoriesToShow = (): (TCategory | { _id: string; name: string; slug: string; isSubcategory: boolean })[] => {
    if (currentCategory?.subCategories && Array.isArray(currentCategory.subCategories) && currentCategory.subCategories.length > 0) {
      // If current category has subcategories, show them as cards
      return currentCategory.subCategories.map((subCat, index) => ({
        _id: `${currentCategory._id}-sub-${index}`,
        name: subCat,
        slug: `${currentCategory.slug}-${subCat.toLowerCase().replace(/\s+/g, '-')}`,
        isSubcategory: true
      }));
    } else {
      // Otherwise show other categories in the same main category
      const targetMainCategory = mainCategory || currentCategory?.mainCategory;
      return allCategories.filter(cat => cat.mainCategory === targetMainCategory);
    }
  };
  
  const subcategories = getSubcategoriesToShow();
  const displayedSubcategories = showAllSubcategories ? subcategories : subcategories.slice(0, 6);

  return (
    <div className="space-y-6">
     

      {/* Subcategory Cards Section - Hidden on mobile */}
      {subcategories.length > 0 && (
        <div className="hidden md:block bg-white rounded-lg border p-6">
          <div className="flex flex-wrap gap-6">
            {displayedSubcategories.map((item) => (
              'isSubcategory' in item && item.isSubcategory ? (
                <button
                  key={item._id}
                  onClick={() => {
                    if (!filters) return;
                    const newSubCategories = filters.selectedSubCategories?.includes(item.name)
                      ? [] // If already selected, deselect (clear all)
                      : [item.name]; // If not selected, select only this one
                    onFiltersChange?.({ ...filters, selectedSubCategories: newSubCategories });
                  }}
                  className="group"
                >
                  <div className={`border cursor-pointer rounded-lg px-3 py-6 transition-all duration-200 ${
                    filters?.selectedSubCategories?.includes(item.name)
                      ? ' border-blue-300 text-[#0397D3]'
                      : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-600 group-hover:text-[#0397D3]'
                  }`}>
                    <div className="text-sm font-normal whitespace-nowrap">
                      {item.name}
                    </div>
                  </div>
                </button>
              ) : (
                <Link
                  key={item._id}
                  href={`/category/subcategory/${item.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-6 transition-all duration-200">
                    <div className="text-sm font-normal text-gray-600 group-hover:text-[#0397D3] whitespace-nowrap">
                      {item.name}
                    </div>
                  </div>
                </Link>
              )
            ))}
            
            {/* Show More/Less Button */}
            {subcategories.length > 5 && (
              <button
                onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                className="  border border-blue-200 rounded-lg px-3 py-2 transition-all duration-200 flex items-center"
              >
                <div className="cursor-pointer text-xs font-light text-[#0397D3] flex items-center gap-1 whitespace-nowrap">
                  {showAllSubcategories ? (
                    <>
                      <span>কম দেখুন</span>
                      <ChevronDown className="w-3 h-3 rotate-180 cursor-pointer" />
                    </>
                  ) : (
                    <>
                      <span>আরো দেখুন</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      )}
 {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:underline" style={{color: '#0397D3'}}>Home</Link>
        <span className="mx-2">&gt;</span>
        {mainCategory && (
          <>
            <Link href={`/category/${mainCategory}`} className="hover:underline capitalize" style={{color: '#0397D3'}}>
              {mainCategory}
            </Link>
            {currentCategory && (
              <>
                <span className="mx-2">&gt;</span>
                <span className="capitalize">{currentCategory.name}</span>
              </>
            )}
          </>
        )}
        {!mainCategory && !currentCategory && (
          <span className="capitalize">Products</span>
        )}
      </nav>
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{currentCategory?.name || mainCategory || 'All Products'}</h1>
          <p className="text-gray-600 mt-1">(Showing 1 to {products.length} of {totalProducts} products)</p>
        </div>
        
       
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p>লোড হচ্ছে...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p>কোন প্রোডাক্ট পাওয়া যায়নি</p>
          
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const discount = product.productInfo.salePrice 
              ? Math.round(((product.productInfo.price - product.productInfo.salePrice) / product.productInfo.price) * 100)
              : 0;
            
            return (
              <div key={product._id} className="bg-white cursor-pointer rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                {/* Hover Overlay with Buttons - Full Card */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 z-20 rounded-lg">
                  <Link href={`/product/${product._id}`}>
                    <button className="bg-white cursor-pointer text-gray-800 hover:bg-gray-100 px-6 py-2 rounded-md shadow-md text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(
                        addToCart({
                          id: product._id,
                          name: product.description.name,
                          brand: product.bookInfo?.specification?.authors?.[0]?.name || "Unknown",
                          price: product.productInfo.salePrice || product.productInfo.price,
                          originalPrice: product.productInfo.price,
                          stock: product.productInfo.quantity,
                          superDeal: !!product.productInfo.discount,
                          selected: true,
                          quantity: 1,
                          image: product.featuredImg,
                        })
                      );
                    }}
                    className={`px-6 py-2 rounded-md shadow-md text-sm font-medium transition-colors ${
                      !product.productInfo.inStock
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#0397D3] text-white hover:bg-[#0381b2] cursor-pointer"
                    }`}
                    disabled={!product.productInfo.inStock}
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="relative">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold w-12 h-12 rounded-full flex flex-col items-center justify-center z-30 leading-tight">
                      <span>{discount}%</span>
                      <span>OFF</span>
                    </div>
                  )}
                  
                  {/* Product Image */}
                  <Link href={`/product/${product._id}`} className="block">
                    <div className="aspect-square p-4">
                      <Image
                        src={product.featuredImg || "https://via.placeholder.com/200x200"}
                        alt={product.description.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>
                
                {/* Product Info */}
                <Link href={`/product/${product._id}`} className="block">
                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#0397D3] transition-colors">
                      {product.description.name}
                    </h3>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(product.averageRating || 0))}
                        {"☆".repeat(5 - Math.floor(product.averageRating || 0))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                    
                    {/* Stock Status */}
                    {product.productInfo.inStock && (
                      <p className="text-xs text-green-600 font-medium">Product In Stock</p>
                    )}
                    
                    {/* Price */}
                    <div className="space-y-1">
                      {product.productInfo.salePrice ? (
                        <>
                          <div className="text-sm text-gray-500 line-through">
                            TK. {product.productInfo.price}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            TK. {product.productInfo.salePrice}
                          </div>
                        </>
                      ) : (
                        <div className="text-lg font-bold text-gray-900">
                          TK. {product.productInfo.price}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      <div className="text-center py-8">
        <button className="px-6 py-2 cursor-pointer bg-[#0397D3] hover:bg-[#056991] text-white rounded-lg transition-colors">
          Load More Products
        </button>
      </div>
    </div>
  );
}