/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegisterUserMutation } from "@/redux/featured/auth/authApi";
import { getSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { setUser } from "@/redux/featured/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export function useAuthHandlers() {
  const dispatch = useAppDispatch();
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (data: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await registerUser(data).unwrap();
      
      toast.success("Registration successful!");
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Registration failed";
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleLogin = async (
    data: { email: string; password?: string },
    provider: "credentials" | "google" | "facebook" = "credentials"
  ) => {
    try {
      const res = await signIn(provider, {
        redirect: false,
        ...(provider === "credentials"
          ? { email: data.email, password: data.password }
          : { callbackUrl: "/" }),
      });

      if (!res?.ok) {
        if (provider !== "credentials") return; // Don't show error for OAuth redirects
        toast.error("Login failed");
        throw new Error("Login failed");
      }

      // Get fresh session
      const session = await getSession();
      
      if (!session?.user) {
        if (provider !== "credentials") return; // Don't show error for OAuth redirects
        toast.error("Session not found after login");
        throw new Error("Session missing");
      }

      // Dispatch user to Redux with proper mapping
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
      toast.success("Login successful!");

      return session;
    } catch (err: any) {
      if (provider !== "credentials") return; // Don't show error for OAuth redirects
      console.error("❌ Login error:", err);
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  return { handleRegister, handleLogin };
}
