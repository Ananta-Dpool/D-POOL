"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Unable to log in. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="p-1.5 -ml-1 text-ink-sec hover:text-ink rounded-full hover:bg-paper flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span className="font-serif font-bold text-base text-ink">D&apos; POOL</span>
        <div className="w-12" />
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="bg-surface border border-border rounded-16px p-6 shadow-sm">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-16 h-16 rounded-12px overflow-hidden border border-border shadow-2xs mb-3">
              <Image
                src="/logo.jpg"
                alt="D' POOL Logo"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink">Welcome Back</h1>
            <p className="text-xs text-ink-sec mt-1">
              Log in with your Gmail ID to buy, sell &amp; chat on campus
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-2.5 rounded-8px bg-danger/10 border border-danger/30 text-danger text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                Gmail / Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full h-10 pl-9 pr-3 rounded-8px border border-border bg-paper text-xs text-ink placeholder:text-ink-ph transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your Gmail.")}
                  className="text-[11px] text-accent hover:underline font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-9 rounded-8px border border-border bg-paper text-xs text-ink placeholder:text-ink-ph transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-ph hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-accent hover:bg-accent-hover text-surface rounded-8px font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span className="text-[10px] text-ink-ph uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-xs text-ink-sec">
              New to D&apos; POOL?{" "}
              <Link
                href="/signup"
                className="font-semibold text-accent hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
