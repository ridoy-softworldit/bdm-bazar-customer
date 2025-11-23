"use client"

import AllCarousel from "@/Component/Page/AllCarousel";
import BudgetBooks from "@/Component/Page/BudgetBooks";
import CategorySelector from "@/Component/Page/CategorySelector";
import IslamicEconomicsandBusiness from "@/Component/Page/IslamicEconomicsandBusiness";
import LaptopSaleBanner from "@/Component/Page/LaptopSaleBanner";
import MuslimPersonalities from "@/Component/Page/MuslimPersonalities";
import PopularBookListsSection from "@/Component/Page/PopularBookLists";
import { PopularPackages } from "@/Component/Page/PopularPackages";
import NewlyReleasedProducts from "@/Component/Page/product-carousel";
import { RecentlyViewed } from "@/Component/Page/RecentlyViewed";
import RelatedSearches from "@/Component/Page/RelatedSearches";

export default function ProductPage() {
  return (
    <div>
      <div className="max-w-7xl min-h-screen mx-auto">
        <LaptopSaleBanner />
        <NewlyReleasedProducts />
        <CategorySelector />
        <BudgetBooks />
        <PopularBookListsSection />
        <AllCarousel />
        <RelatedSearches />
        <IslamicEconomicsandBusiness />
        <PopularPackages />
        <MuslimPersonalities />
      </div>
      <RecentlyViewed />
    </div>
  );
}
