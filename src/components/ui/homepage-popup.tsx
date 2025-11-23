/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // from shadcn

export default function HomepagePopup() {
  const [settings, setSettings] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/settings")
      .then((res) => res.json())
      .then((data) => {
        const settingsData = data?.data;
        setSettings(settingsData);

        const hasSeenPopup = sessionStorage.getItem("seenPopup"); 

        if (!hasSeenPopup && settingsData?.enableHomepagePopup) {
          setTimeout(() => {
            setOpen(true);
            sessionStorage.setItem("seenPopup", "true"); 
          }, settingsData?.popupDelay || 2000);
        }
      })
      .catch((err) => console.error("Settings fetch error:", err));
  }, []);

  if (!settings?.enableHomepagePopup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm text-center p-6 rounded-2xl">
        <DialogTitle className="text-xl font-semibold mb-2">{settings?.popupTitle}</DialogTitle>
        {settings?.popupImage && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={settings.popupImage}
              alt="Popup"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <p className="text-gray-600">{settings?.popupDescription}</p>
      </DialogContent>
    </Dialog>
  );
}
