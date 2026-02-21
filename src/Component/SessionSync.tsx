"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";

export default function SessionSync() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔍 SessionSync - session:", session);
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
      console.log("✅ SessionSync - dispatching user:", userData);
      dispatch(setUser(userData));
    }
  }, [session, dispatch]);

  return null;
}
