"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import SnakeGame from "@/games/snake/components/SnakeGame";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SnakePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login?redirect=/games/snake");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-linear-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent uppercase tracking-tighter">
            Snake Retro
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">
            The classic arcade experience. Eat, grow, and avoid the walls!
          </p>
        </div>

        <SnakeGame />
      </div>
    </div>
  );
}
