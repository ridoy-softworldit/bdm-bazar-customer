import BengaliFooter from "@/Component/Footer/Footer";
import Providers from "@/lib/providers";
import { AuthProvider } from "@/provider/AuthProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NavbarWrapper from "@/Component/Navbar/NavbarWrapper";
import FloatingWhatsApp from "@/Component/WhatsApp/FloatingWhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDM Bazar",
  description: "An E-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
          <Providers>
            <NavbarWrapper />
            {children}
            <BengaliFooter />
            <FloatingWhatsApp />
            <Toaster position="top-right" />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
