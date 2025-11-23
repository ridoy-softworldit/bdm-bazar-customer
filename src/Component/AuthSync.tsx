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
        dispatch(setUser(session.user));
      }
    };

    syncSession();
  }, [dispatch]);

  return null;
}
