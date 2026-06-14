"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteTestimonial } from "@/actions/testimonials";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";
import { Eye, Trash2, Download, LogOut } from "lucide-react";
import { formatDate, getPublicDisplayName, getVisibilityLabel } from "@/lib/utils";

interface TestimonialTableProps {
  testimonials: Testimonial[];
  shareUrl: string;
}

export function TestimonialTable({ testimonials, shareUrl }: TestimonialTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await deleteTestimonial(id);
    router.refresh();
  };

  const handleExport = () => {
    window.open("/api/export", "_blank");
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-brand-slate">
        <p>No testimonials yet. Share your link to start collecting feedback.</p>
        <p className="mt-2 text-sm">
          Share link:{" "}
          <code className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--text-primary)]">
            {shareUrl}
          </code>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">All Testimonials</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-elevated)]">
            <tr>
              <th className="text-left px-4 py-3 brand-label text-brand-slate">Public Name</th>
              <th className="text-left px-4 py-3 brand-label text-brand-slate">Relationship</th>
              <th className="text-left px-4 py-3 brand-label text-brand-slate hidden md:table-cell">
                Impact Area
              </th>
              <th className="text-left px-4 py-3 brand-label text-brand-slate">Visibility</th>
              <th className="text-left px-4 py-3 brand-label text-brand-slate">Date</th>
              <th className="text-right px-4 py-3 brand-label text-brand-slate">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text-primary)]">
                    {getPublicDisplayName(t.full_name, t.visibility_type)}
                  </p>
                  {t.visibility_type !== "full_name" && (
                    <p className="text-xs text-brand-slate mt-0.5">Legal: {t.full_name}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-slate">{t.relationship_type}</td>
                <td className="px-4 py-3 text-brand-slate hidden md:table-cell">
                  {(t.impact_areas as string[]).slice(0, 2).join(", ")}
                  {(t.impact_areas as string[]).length > 2 && "..."}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green/20 text-green">
                    {getVisibilityLabel(t.visibility_type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-slate">
                  {formatDate(t.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/testimonials/${t.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="w-4 h-4 text-orange" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
