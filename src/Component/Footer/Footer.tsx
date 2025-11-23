/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useSettings from "@/hooks/useSettings";
import useFooterSettings from "@/hooks/useFooterSettings";
import {
  Facebook,
  Phone,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function BengaliFooter() {
  const { settings } = useSettings();
  const { footerSettings } = useFooterSettings();

  const contactInfo = settings?.data?.contactAndSocial;

  return (
    <footer className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Company Info */}
          <div className="lg:w-1/3">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
                BDM Bazar
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Best Online Shop
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-1 sm:mb-2">Customer Care</p>
                <p className="mb-1">
                  Contact us at <span className="text-blue-600">Live Chat</span>
                </p>
                <p>
                  Send us an email:{" "}
                  <span className="text-blue-600 break-all">
                    {contactInfo?.email}
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1">
                    Corporate Sales:{" "}
                    <span className="font-semibold">{contactInfo?.phone}</span>{" "}
                    (Whatsapp Message)
                  </p>
                  <p className="text-blue-600 break-all mb-1">
                    {contactInfo?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">📍</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p>
                    Address:{" "}
                    <span className="font-semibold">
                      {contactInfo?.address}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✉️</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1">Email Us</p>
                  <p className="text-blue-600 break-all">
                    {contactInfo?.email || "admin@bdmbazar.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Menus */}
          <div className="lg:w-2/3">
            {/* First Row - 4 Dynamic Menus */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {footerSettings
                ?.flatMap((setting: any) => 
                  setting.menus.map((menu: any) => ({ ...menu, settingId: setting._id }))
                )
                .sort((a: any, b: any) => a.order - b.order)
                .slice(0, 4)
                .map((menu: any, menuIndex: number) => (
                  <div key={`${menu.settingId}-${menuIndex}`}>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      {menu.menuTitle}
                    </h3>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      {menu.submenus
                        .filter((submenu: any) => submenu.isActive)
                        .map((submenu: any, subIndex: number) => (
                          <li key={subIndex}>
                            {submenu.isDynamicPage ? (
                              <Link 
                                href={submenu.url} 
                                className="hover:text-blue-600 transition-colors"
                              >
                                {submenu.title}
                              </Link>
                            ) : (
                              <a 
                                href={submenu.url} 
                                className="hover:text-blue-600 transition-colors"
                                {...(submenu.url.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                              >
                                {submenu.title}
                              </a>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>

            {/* Second Row - Remaining Menus + Social */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Remaining Dynamic Menus */}
              {footerSettings
                ?.flatMap((setting: any) => 
                  setting.menus.map((menu: any) => ({ ...menu, settingId: setting._id }))
                )
                .sort((a: any, b: any) => a.order - b.order)
                .slice(4)
                .map((menu: any, menuIndex: number) => (
                  <div key={`${menu.settingId}-${menuIndex}-remaining`}>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      {menu.menuTitle}
                    </h3>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      {menu.submenus
                        .filter((submenu: any) => submenu.isActive)
                        .map((submenu: any, subIndex: number) => (
                          <li key={subIndex}>
                            {submenu.isDynamicPage ? (
                              <Link 
                                href={submenu.url} 
                                className="hover:text-blue-600 transition-colors"
                              >
                                {submenu.title}
                              </Link>
                            ) : (
                              <a 
                                href={submenu.url} 
                                className="hover:text-blue-600 transition-colors"
                                {...(submenu.url.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                              >
                                {submenu.title}
                              </a>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}

              {/* Social & App Column */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Stay Connected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contactInfo?.facebookUrl?.[0] && (
                    <a
                      href={contactInfo.facebookUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}

                  {contactInfo?.whatsappLink?.[0] && (
                    <a
                      href={contactInfo.whatsappLink[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}

                  {contactInfo?.instagramUrl?.[0] && (
                    <a
                      href={contactInfo.instagramUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 bg-pink-500 text-white rounded flex items-center justify-center hover:bg-pink-600 transition-colors"
                    >
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}

                  {contactInfo?.youtubeUrl?.[0] && (
                    <a
                      href={contactInfo.youtubeUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © 2012-2025 BDM Bazar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}