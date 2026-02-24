"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import { signOut, useSession } from "next-auth/react";
import { Typewriter } from "react-simple-typewriter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect, useMemo } from "react";
import { RootState } from "@/redux/store";
import { useSearchProductsQuery } from "@/redux/featured/product/productApi";
import { handleAddToCart } from "../Page/cart/useHandleAddtocart";
import { usePathname, useRouter } from "next/navigation";
import useSettings from "@/hooks/useSettings";


interface NavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }: NavbarProps) {
  const dispatch = useAppDispatch();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);



  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: session } = useSession();

  // Debug logs
  useEffect(() => {
  }, [currentUser, session]);

  const [logout] = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();

  const { settings } = useSettings();

  // Cart & Wishlist
  const cartCount: number = useAppSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const wishlistCount: number = useAppSelector(
    (state: RootState) => state.wishlist.items.length
  );

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShowResults(false);
    setSearchQuery("");
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest(".search-result-item")
        )
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const {
    data: searchResponse,
    isLoading,
    isError,
  } = useSearchProductsQuery(searchQuery, {
    skip: !searchQuery.trim(),
  });
  const searchResults = useMemo(
    () => searchResponse?.data ?? [],
    [searchResponse]
  );

  // Debug log
  useEffect(() => {
    if (isError) {
      console.error("❌ Failed to load products");
    } else if (isLoading) {
    } else if (searchResults.length > 0) {
    } else if (!searchQuery.trim()) {
    }
  }, [searchResults, isLoading, isError, searchQuery]);

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.trim().length > 0);
  };

  const closeSearch = () => {
    setShowResults(false);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    if (currentUser?._id) {
      try {
        await logout(currentUser._id).unwrap();
      } catch (err) {
        console.error("Logout API failed", err);
      }
    }
    dispatch(logoutUser());
    await signOut({ callbackUrl: "/auth/login" });
  };

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);







  const topBarItems = [
    { label: "আমার অ্যাকাউন্ট", href: "/dashboard/profile" },
    { label: "অর্ডার ট্র্যাক", href: "/dashboard/orders" },
    { label: "কাস্টমার সার্ভিস", href: "/contact-us" },
    { label: "বই পড়ুন", href: "/read-books" },
  ];

  return (
    <>


      <div className="w-full bg-white border-b shadow-sm sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-gray-100 border-b border-gray-200 hidden lg:block">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-2 text-sm text-gray-600">
              <div className="text-gray-500 text-[12px]">
                {(typeof settings?.data?.welcomeMessage === 'string' ? settings.data.welcomeMessage : null) || "বিডিএম বাজারে স্বাগতম !"}
              </div>
              <div className="flex space-x-6 items-center">
                {topBarItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="relative text-[12px]"
                  >
                    <span className="flex items-center text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                      {item.label}
                      {index !== topBarItems.length - 1 && (
                        <span className="inline-block w-px h-4 bg-gray-400 ml-3"></span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-40">
          <div className="flex items-center justify-between">
            {/* Mobile Menu + Logo */}
            <div className="flex items-center flex-shrink-0">
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>

              <Link href="/">
                <Image
                  src={(typeof settings?.data?.logo === 'string' ? settings.data.logo : null) || "/logo.png"}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl relative mx-auto">
              <div
                ref={searchContainerRef}
                className="relative w-full max-w-xl mx-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder=""
                  className="w-full pl-5 pr-14 md:py-2 border border-blue-400 rounded-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200 text-base sm:text-sm"
                />
                {!searchQuery && (
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-base sm:text-sm w-[90%] truncate">
                    <Typewriter
                      words={[
                        "Search books...",
                        "Search electronics...",
                        "Search accessories...",
                        "Search anything you need...",
                      ]}
                      loop={0}
                      cursor
                      cursorStyle="|"
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={1500}
                    />
                  </span>
                )}
                <button className="absolute right-0 top-0 h-full px-3 text-blue-500 hover:text-blue-600 transition-colors duration-200">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Search Dropdown */}
              {showResults && (
                <>
                  <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={closeSearch}
                  />
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto animate-slide-down">
                    {isLoading ? (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        Loading...
                      </p>
                    ) : isError ? (
                      <p className="px-4 py-3 text-sm text-red-500">
                        Failed to load products. Please try again.
                      </p>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <div
                          className="search-result-item flex justify-between items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          key={product._id}
                          onClick={() => router.push(`/product/${product._id}`)}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={product.featuredImg}
                              alt={product.description.name}
                              width={40}
                              height={40}
                              className="object-cover rounded"
                            />
                            <span className="truncate">
                              {product.description.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-md font-medium text-gray-900">
                              ৳
                              {product.productInfo.salePrice ||
                                product.productInfo.price}
                            </span>
                            <button
                              className="px-2 py-1 bg-[#1897CE] text-white rounded text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product, dispatch);
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        No products found for {searchQuery}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Actions (User, Cart, Wishlist) */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>

              <div className="flex items-center">
                {currentUser || session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:flex flex-col items-start min-w-0">
                          <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                            {currentUser?.name || session?.user?.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">
                            {currentUser?.email || session?.user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 border rounded-lg shadow-lg mt-2"
                    >
                      <div className="px-3 py-3 border-b">
                        <p className="text-sm font-medium truncate">
                          {currentUser?.name || session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.email || session?.user?.email}
                        </p>
                      </div>
                      <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <Link href="/dashboard/orders" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                        <User className="h-4 w-4" />
                        <Link href="/dashboard/profile" className="w-full">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer text-red-600"
                      >
                        <span>🚪</span> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm lg:text-base">
                      Sign in
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/wishlist"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>


      </div>





      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Search..."
            />
            <Button variant="ghost" size="sm" onClick={closeSearch}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
