"use client";

import type React from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-100 relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/LoginBackgroundImage.jpg"
          alt="Login Background"
          className="w-full h-full  object-cover filter brightness-70"
        />
      </div>

      {/* Card Container */}
      <div
        className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl 
                   rounded-2xl bg-white/60 md:bg-white/40 
                   overflow-hidden relative z-10 shadow-2xl"
      >
        {/* Left Side - Logo (hidden on small screens) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10 bg-white/60">
          <img
            src="/aubonlogo.png"
            alt="Choice Logo"
            className="w-40 h-50 object-contain"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center md:bg-white/60">
          <h1 className="text-2xl mb-6 text-start font-bold text-[#333333]">
            7DayCrush Dashboard!
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              placeholder="Enter Email Address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
    w-full px-5 py-4 rounded-full border-2 border-transparent
    bg-white/30 backdrop-blur-md text-gray-800 placeholder-gray-500
    focus:border-transparent focus:ring-4 focus:ring-[#FF0000]/50 focus:ring-offset-0
    focus:bg-white/40
  "
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
    w-full px-5 py-4 rounded-full border-2 border-transparent
    bg-white/30 backdrop-blur-md text-gray-800 placeholder-gray-500
    focus:border-transparent focus:ring-4 focus:ring-[#FF0000]/50 focus:ring-offset-0
    focus:bg-white/40
  "
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="text-red-600 focus:ring-0"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember Me
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full 
             bg-gradient-to-r from-[#F53C5B]  to-[#FF0000]
             text-white py-4 rounded-full font-semibold text-[12px] shadow-md transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
