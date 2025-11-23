"use client";

import Image from "next/image";
import useSettings from "@/hooks/useSettings";

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  
  const whatsappLink = settings?.data?.contactAndSocial?.whatsappLink?.[0];
  
  if (!whatsappLink) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contact us on WhatsApp"
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-full h-full rounded-full"
      />
    </a>
  );
}