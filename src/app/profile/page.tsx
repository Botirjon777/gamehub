"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/useAuthStore";
import { updateProfile, topUpBalance } from "@/lib/profile.actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { User, Wallet, Camera, Save, Plus, ChevronLeft } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, initialize, setUser } =
    useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [topUpAmount, setTopUpAmount] = useState<string>("500");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setProfileImage(user.profileImage);
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setMessage(null);

    const result = await updateProfile({
      username,
      email,
      phoneNumber,
      profileImage,
    });
    if (result.success && result.user) {
      setUser(result.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to update profile",
      });
    }
    setIsUpdatingProfile(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setProfileImage(data.url);
        // Refresh user state to reflect new image globally
        const updatedUser = { ...user!, profileImage: data.url };
        setUser(updatedUser);
        setMessage({ type: "success", text: "Avatar uploaded successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong during upload" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setIsToppingUp(true);
    setMessage(null);

    const result = await topUpBalance(amount);
    if (result.success && result.user) {
      setUser(result.user);
      setMessage({
        type: "success",
        text: `$${amount} added to your balance!`,
      });
      setTopUpAmount("");
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to top up balance",
      });
    }
    setIsToppingUp(false);
  };

  if (!isInitialized || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
            Account Settings
          </h1>
          <p className="text-white/40">
            Manage your profile and wallet balance.
          </p>
        </header>

        {message && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="md:col-span-2 space-y-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="text-primary" />
                <h2 className="text-2xl font-bold">Profile Details</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group self-center md:self-start">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all shadow-2xl relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full gradient-primary flex items-center justify-center text-3xl font-black">
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg z-10">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white font-medium"
                        placeholder="CoolGamer123"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white font-medium"
                        placeholder="gamer@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white font-medium"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={isUpdatingProfile}
                    className="flex items-center gap-2 px-8 w-full sm:w-auto"
                  >
                    <Save size={18} />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Wallet className="text-yellow-500" />
                <h2 className="text-2xl font-bold">Wallet & Credits</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-center min-h-[140px]">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                    Current Balance
                  </p>
                  <p className="text-4xl font-black text-yellow-500 break-all">
                    $
                    {user.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Top Up Amount ($)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-yellow-500/50 transition-colors text-white font-black text-lg"
                        placeholder="500"
                      />
                      <Button
                        variant="primary"
                        onClick={handleTopUp}
                        isLoading={isToppingUp}
                        className="flex items-center justify-center gap-1 px-2 h-[30px] sm:h-auto"
                      >
                        <Plus size={24} />
                        <span className="font-bold">Top Up</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["100", "500", "1000", "5000"].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTopUpAmount(preset)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:border-yellow-500/30 border border-white/10 text-xs font-black transition-all"
                      >
                        +${preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-linear-to-br from-primary/10 to-transparent overflow-hidden">
              <h3 className="text-lg font-bold mb-6 opacity-80 uppercase tracking-tighter">
                Account Info
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                    Email
                  </p>
                  <p className="font-bold text-white/90 break-all leading-tight">
                    {user.email}
                  </p>
                </div>
                {user.phoneNumber && (
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                      Phone
                    </p>
                    <p className="font-bold text-white/90">
                      {user.phoneNumber}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                    Member Since
                  </p>
                  <p className="font-bold text-white/90">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                    Library Size
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {user.purchasedGames.length}
                    </span>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Games Owned
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 opacity-80 uppercase tracking-tighter">
                Security
              </h3>
              <p className="text-xs text-white/40 mb-6 font-medium leading-relaxed">
                Your account is protected by industry-standard encryption.
              </p>
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="w-full justify-center"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
