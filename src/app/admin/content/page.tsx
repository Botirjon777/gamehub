"use client";

import { useEffect, useState } from "react";
import { getAllPosters, updatePoster, deletePoster } from "@/lib/admin.actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  Edit2,
  Link as LinkIcon,
  Image as ImageIcon,
  Layout,
  Save,
} from "lucide-react";

export default function ContentManagement() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "Play Now",
    buttonLink: "",
    order: 0,
  });

  useEffect(() => {
    fetchPosters();
  }, []);

  async function fetchPosters() {
    setLoading(true);
    const data = await getAllPosters();
    setPosters(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updatePoster(editingId, formData);
    if (res.success) {
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "Play Now",
        buttonLink: "",
        order: 0,
      });
      fetchPosters();
    } else {
      alert(res.error);
    }
  };

  const handleEdit = (poster: any) => {
    setFormData({
      title: poster.title,
      subtitle: poster.subtitle,
      imageUrl: poster.imageUrl,
      buttonText: poster.buttonText,
      buttonLink: poster.buttonLink,
      order: poster.order,
    });
    setEditingId(poster._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this poster?")) {
      const res = await deletePoster(id);
      if (res.success) fetchPosters();
      else alert(res.error);
    }
  };

  if (loading) return <div>Loading content...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-white/40">
            Manage your homepage banners and promotional content.
          </p>
        </div>
        {!isAdding && (
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} /> Add New Poster
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="p-8 bg-[#0f111a] border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold">
              {editingId ? "Edit" : "Add New"} Poster
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Subtitle
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Sort Order
                </label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Button Text
                </label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase">
                  Button Link
                </label>
                <div className="relative">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonLink: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="gap-2">
                <Save size={20} />{" "}
                {editingId ? "Save Changes" : "Create Poster"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posters.map((poster) => (
          <Card
            key={poster._id}
            className="p-6 bg-[#0f111a] border-white/5 group hover:border-primary/30 transition-all overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex gap-6 relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                      Order: {poster.order}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(poster)}
                        className="p-2 text-white/40 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(poster._id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{poster.title}</h3>
                  <p className="text-white/40 text-sm line-clamp-2">
                    {poster.subtitle}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest">
                  <LinkIcon size={12} /> {poster.buttonLink}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {posters.length === 0 && !isAdding && (
          <div className="md:col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/40">
              No banners found. Add your first one to showcase on the homepage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
