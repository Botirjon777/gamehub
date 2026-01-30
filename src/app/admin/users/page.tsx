"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  updateUserBalance,
} from "@/lib/admin.actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Search,
  User as UserIcon,
  Shield,
  ShieldCheck,
  Coins,
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  }

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (confirm(`Change role to ${newRole.toUpperCase()}?`)) {
      const res = await updateUserRole(userId, newRole as any);
      if (res.success) fetchUsers();
      else alert(res.error);
    }
  };

  const handleBalanceUpdate = async (userId: string) => {
    const amount = prompt("Enter new balance:");
    if (amount !== null && !isNaN(Number(amount))) {
      const res = await updateUserBalance(userId, Number(amount));
      if (res.success) fetchUsers();
      else alert(res.error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-white/40">
          Manage your player base, roles, and balances.
        </p>
      </div>

      <Card className="p-4 bg-[#0f111a] border-white/5 flex items-center gap-4">
        <Search className="text-white/20" size={20} />
        <input
          type="text"
          placeholder="Search by username or email..."
          className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="p-6 bg-[#0f111a] border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {user.username}
                    {user.role === "admin" && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
                        Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-white/40 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-8 border-x border-white/5">
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                    Balance
                  </p>
                  <p className="font-mono font-bold text-green-400">
                    ${user.balance.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                    Joined
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 border border-white/5 hover:bg-white/5"
                  onClick={() => handleBalanceUpdate(user.id)}
                >
                  <Coins size={16} /> Edit Balance
                </Button>
                <Button
                  variant={user.role === "admin" ? "accent" : "primary"}
                  size="sm"
                  className="gap-2"
                  onClick={() => handleRoleToggle(user.id, user.role)}
                >
                  {user.role === "admin" ? (
                    <>
                      <ShieldCheck size={16} /> Revoke Admin
                    </>
                  ) : (
                    <>
                      <Shield size={16} /> Make Admin
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/40">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
