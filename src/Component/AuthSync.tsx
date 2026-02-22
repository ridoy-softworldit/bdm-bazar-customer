// components/AuthSync.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";
import { getSession } from "next-auth/react";

export default function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncSession = async () => {
      const session = await getSession();
      
      if (session?.user) {
        const userData = {
          _id: session.user.id,
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          gender: session.user.gender,
          walletPoint: session.user.walletPoint,
        };
        dispatch(setUser(userData));
      }
    };

    syncSession();
  }, [dispatch]);

  return null;
}
