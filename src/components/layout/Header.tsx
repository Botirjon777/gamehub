"use client";

"use client";

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/ui/Button";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    ...(isAuthenticated
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/skins", label: "Skins" },
        ]
      : []),
  ];

  return (
    <header className="glass-strong sticky top-0 z-50 backdrop-blur-xl">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="GameHub Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 group px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center text-xs font-bold">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white/80 group-hover:text-primary transition-colors hidden md:block">
                    {user?.username}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 text-white/40 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
