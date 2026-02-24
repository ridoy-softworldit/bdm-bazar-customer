/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useAuthHandlers } from "@/lib/authActions";
import { setUser } from "@/redux/featured/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FacebookLogin from "@greatsumini/react-facebook-login";
import toast from "react-hot-toast";
import axios from "axios";
import InputField from "../shared/InputField";
import Logo from "/public/logo.png";

type AuthFormProps = {
  type: "login" | "register";
};

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === "login";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { handleRegister, handleLogin } = useAuthHandlers();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('redirect') || '/';

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      if (type === "register") {
        await handleRegister(data);
        router.push("/auth/login");
      } else {
        const redirect = new URLSearchParams(window.location.search).get(
          "redirect"
        );
        await handleLogin(data);
        router.push(redirect || "/");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  const handleFacebookLogin = async (response: any) => {
    if (response.accessToken) {
      try {
        // Fetch user data from Facebook Graph API
        const userResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${response.accessToken}`
        );
        const userData = await userResponse.json();
        
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/login/provider`,
          {
            name: userData.name,
            email: userData.email,
            provider: "facebook",
          }
        );
        if (data.success) {
          dispatch(setUser({ user: data.data, token: data.data.accessToken }));
          toast.success("Login successful!");
          router.push(redirectUrl);
        } else {
          toast.error("Login failed");
        }
      } catch (error) {
        console.error("❌ Facebook login error:", error);
        toast.error("Facebook login failed");
      }
    }
  };

  return (
    <section
      className="py-6 md:py-8 lg:py-12 mx-auto overflow-hidden flex flex-col
     w-full max-w-[350px] sm:max-w-md md:max-w-[450px] lg:max-w-[666px] px-4 sm:px-8"
    >
      <Link href={"/"}>
        <div className="flex justify-center">
          <Image
            src="https://res.cloudinary.com/dvbnagad5/image/upload/v1758109967/bdmbazarlogo_ujourw.jpg"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
      </Link>
      <h2 className="my-6 capitalize text-center text-xl md:text-2xl">{type} to user account dashboard</h2>
      <div className="bg-white border px-4 sm:px-5 py-5 border-gray-300 rounded-lg text-black">
        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {type === "register" && (
            <InputField
              label="Name"
              id="name"
              placeholder="Name"
              register={register("name", { required: true })}
              error={errors.name && "Name is required"}
            />
          )}

          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            register={register("email", { required: true })}
            error={errors.email && "Email is required"}
          />

          <div className="relative">
            <InputField
              label="Password"
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onIconClick={() => setShowPassword(!showPassword)}
              register={register("password", {
                required: "Password is required",
                validate: (value) =>
                  value.length >= 6 || "Password must be 6 characters long",
              })}
              error={errors.password?.message}
            />
          </div>
          {/* Remember me & Forgot password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-black" />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* submit btn  */}
          <Button type="submit" className="w-full">
            {type === "register" ? "Register" : "Login"}
          </Button>
          {/* google login */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="relative w-full">
              <hr className="border-gray-300" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">Or continue with</span>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => signIn("google", { callbackUrl: redirectUrl })}
                className="flex-1 gap-2"
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Google
              </Button>
              <FacebookLogin
                appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
                onSuccess={handleFacebookLogin}
                onFail={(error) => {
                  console.error('Facebook login failed:', error);
                  toast.error('Facebook login failed');
                }}
                className="flex-1 gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#1877F2] text-white hover:bg-[#1877F2]/90 h-10 px-4 py-2"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </FacebookLogin>
            </div>
          </div>
        </form>
        {/* reg / login link */}
        <div className="mt-4 text-sm text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="underline underline-offset-4 font-medium"
            >
              {isLogin ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
