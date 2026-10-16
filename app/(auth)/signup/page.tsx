"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please provide a valid Gmail address.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await signup({
        email,
        name,
        password,
        whatsappNumber: whatsapp || undefined,
      });

      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Unable to create account. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-12">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/login"
          className="p-1.5 -ml-1 text-ink-sec hover:text-ink rounded-full hover:bg-paper flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Log In</span>
        </Link>
        <span className="font-serif font-bold text-base text-ink">D&apos; POOL</span>
        <div className="w-12" />
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6">
        <div className="bg-surface border border-border rounded-16px p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="relative w-14 h-14 mb-2.5">
              <Image
                src="/logo.jpg"
                alt="D' POOL Logo"
                fill
                sizes="56px"
                className="object-contain mix-blend-multiply"
              />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink">Create Account</h1>
            <p className="text-xs text-ink-sec mt-0.5">
              Join the student exchange at SPAV Vijayawada
            </p>
          </div>

          {/* Campus Indicator Badge */}
          <div className="mb-4 p-2.5 rounded-8px bg-accent-tint/60 border border-accent/20 flex items-center gap-2 text-xs text-ink">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-accent">Pilot Campus:</span>{" "}
              <span className="text-ink-sec">SPAV Vijayawada</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-2.5 rounded-8px bg-danger/10 border border-danger/30 text-danger text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nishchinth"
                  className="w-full h-10 pl-9 pr-3 rounded-8px border border-border bg-paper text-xs text-ink placeholder:text-ink-ph transition-all"
                />
              </div>
            </div>

            {/* Gmail / Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                Gmail ID *
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

            {/* WhatsApp Number (Decision D-24) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                WhatsApp Number <span className="text-ink-ph font-normal">(for deal chats)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="9876543210"
                  className="w-full h-10 pl-9 pr-3 rounded-8px border border-border bg-paper text-xs text-ink placeholder:text-ink-ph transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-sec mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-10 pl-9 pr-3 rounded-8px border border-border bg-paper text-xs text-ink placeholder:text-ink-ph transition-all"
                />
              </div>
            </div>

            {/* Trust badge */}
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-ink-sec">
              <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
              <span>SPAV campus verified badge granted on signup</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-accent hover:bg-accent-hover text-surface rounded-8px font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span className="text-[10px] text-ink-ph uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Log In Link */}
          <div className="text-center">
            <p className="text-xs text-ink-sec">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-accent hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
