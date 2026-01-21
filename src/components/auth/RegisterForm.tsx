"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [localError, setLocalError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    const success = await register(
      formData.email,
      formData.username,
      formData.password,
    );

    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || localError) && (
        <div className="glass-strong border border-red-500 text-red-400 p-4 rounded-lg text-sm animate-slide-up">
          {error || localError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="username"
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="gamer123"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-2"
        >
          Confirm Password
        </label>
        <div className="relative">
          <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
}
