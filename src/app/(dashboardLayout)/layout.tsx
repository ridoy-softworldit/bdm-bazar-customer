/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import DashboardSideber from "@/Component/Siderbar-dashbord/Dashbord-sideber";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { useSession } from "next-auth/react";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const userId = currentUser?.id;

  const { data: user, isLoading, isError } = useGetSingleUserQuery(userId, {
    skip: !userId,
  });

  const session = useSession();
  const isCheckoutPage = pathname.startsWith("/dashboard/checkout");
  const showSidebar = !isCheckoutPage;

  // Lock scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col bg-gray-50 text-gray-800">
      {/* Mobile Menu Button */}
      {showSidebar && (
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 flex items-center gap-2"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-sm font-medium">Manage Account</span>
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto relative py-6">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block">
            <DashboardSideber />
          </div>
        )}

        {/* Mobile Sidebar Drawer */}
        {showSidebar && sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Slide Panel */}
            <div className="relative bg-white w-72 max-w-[80vw] h-full shadow-lg animate-slideIn">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-base font-semibold">📋 Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <DashboardSideber onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
