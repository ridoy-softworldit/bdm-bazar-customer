// components/AuthSync.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";
import { useSession } from "next-auth/react";

export default function AuthSync() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user) {
      const userData = {
        _id: session.user.id,
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        gender: session.user.gender,
        walletPoint: session.user.walletPoint,
        contactNo: session.user.contactNo,
        bio: session.user.bio,
      };
      const token = (session.user as { accessToken?: string }).accessToken;
      dispatch(setUser({ 
        user: userData, 
        token: token || null 
      }));
    }
  }, [session, dispatch]);

  return null;
}
