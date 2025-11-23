"use client";
import PopularAuthorsCarousel from "@/Component/Author/PopularAuthorsCarousel";
import NewReleasedProducts from "@/Component/displayProducts/NewReleasedProduct";
import RecentlySoldProducts from "@/Component/displayProducts/RecentlySoldProducts";
import PopularProducts from "@/Component/displayProducts/PopularProducts";
import FeaturedCategories from "@/Component/displayProducts/FeaturedCategories";
import CategoryWiseProducts from "@/Component/displayProducts/CategoryWiseProducts";
import CategoryPage from "@/Component/Page/Category";
import LaptopSaleBanner from "@/Component/Page/LaptopSaleBanner";
import OtherCategoryCarousel from "@/Component/Page/OtherCategoryCarousel";
import ProdCarousel from "@/Component/Page/prod-carousel";
import HomepagePopup from "@/components/ui/homepage-popup";
import { useGetFeaturedCategoriesQuery } from "@/redux/featured/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
// import TwoProductCarousel from "@/Component/Page/Two-Product-Carousel";

export default function ProductPage() {
  const { data: categoriesData } = useGetFeaturedCategoriesQuery("");
  const { data: allProductsData } = useGetAllProductsQuery("");
  const allProducts = allProductsData?.data || [];

  // Get all unique categories from products
  const productCategoryNames = new Set<string>();
  allProducts.forEach((product: unknown) => {
    const prod = product as { categoryAndTags?: { categories?: { name?: string }[] } };
    prod.categoryAndTags?.categories?.forEach((cat) => {
      if (cat?.name) productCategoryNames.add(cat.name);
    });
  });
  
  // Convert to array for rendering
  const categoriesWithProducts = Array.from(productCategoryNames) as string[];

  return (
    <div className="bg-[#F1F2F4]  ">
      <HomepagePopup /> {/* 👈 Add here */}
      <div className="sm:w-[80vw] w-[95vw] m-auto">
        {/* slider */}
        <LaptopSaleBanner />
        <CategoryPage />

        {/* new Released Products */}
        <NewReleasedProducts />

        {/* <ProductCarousel /> */}
        <ProdCarousel />
        <OtherCategoryCarousel />

        {/* Recently Sold Products */}
        <RecentlySoldProducts />

        {/* Popular Products */}
        <PopularProducts />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Dynamic Category Sections */}
        {categoriesWithProducts.map((categoryName) => (
          <CategoryWiseProducts key={categoryName} categoryName={categoryName} />
        ))}

        <PopularAuthorsCarousel />
      </div>
    </div>
  );
}
