"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Package, Heart, MapPin, Lock, LucideIcon } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Package, label: "Orders", path: "/dashboard/orders" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: MapPin, label: "Address", path: "/dashboard/addressesPage" },
  {
    icon: Lock,
    label: "Change Password",
    path: "/dashboard/changePasswordPage",
  },
];

interface DashboardSidebarProps {
  onClose?: () => void;
}

export default function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const userName = currentUser?.name ?? "Guest";
  const userEmail = currentUser?.email ?? "";
  const userImage = currentUser?.image;

  return (
    <Card className="w-full lg:w-72 bg-white border-0 rounded-md overflow-hidden shadow-sm">
      <CardContent className="p-0">
        {/* User Info */}
        <div className="relative bg-gradient-to-br from-[#1897CE] via-[#1cb5e0] to-[#0ea5e9] p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-30"></div>
          <div className="relative flex flex-nowrap items-center gap-3 sm:gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-16 h-16 border-3 border-white/30 ring-2 ring-white/20">
                <AvatarImage src={userImage} className="object-cover" />
                <AvatarFallback className="bg-white text-[#1897CE] font-bold text-xl">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Active Dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-xl tracking-tight mb-1 truncate">
                {userName}
              </h3>
              <p
                className="text-white/90 text-xs sm:text-sm font-medium truncate"
                title={userEmail}
              >
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-5 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-4 px-3 py-2 rounded-2xl font-semibold transition-all duration-300 hover:translate-x-1",
                  isActive
                    ? "bg-gradient-to-r from-[#1897CE]/15 to-[#1cb5e0]/10 text-[#1897CE] shadow-lg shadow-[#1897CE]/25 border border-[#1897CE]/20"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-md border border-transparent",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative p-2.5 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-[#1897CE] shadow-lg shadow-[#1897CE]/30"
                      : "bg-gray-100 group-hover:bg-[#1897CE]/10 group-hover:shadow-md",
                  ].join(" ")}
                >
                  <item.icon
                    className={[
                      "w-5 h-5 transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#1897CE]",
                    ].join(" ")}
                  />
                </div>
                <span className="text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="absolute right-5 w-2 h-2 bg-[#1897CE] rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
