"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider } from "./firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";

export function useFirebaseFacebookAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Send to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login/provider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          provider: "facebook",
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        dispatch(setUser(json.data));
        toast.success("Login successful!");
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        router.push(redirect || "/");
      } else {
        toast.error("Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Facebook login failed");
    }
  };

  return { loginWithFacebook };
}
