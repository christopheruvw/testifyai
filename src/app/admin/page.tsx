import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/admin/stats-cards";
import { TestimonialTable } from "@/components/admin/testimonial-table";
import { BrandBackground, BrandLogo } from "@/components/brand/brand-background";
import type { Testimonial } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (testimonials ?? []) as Testimonial[];

  const stats = {
    total: all.length,
    approved: all.filter((t) => t.status === "approved").length,
    pending: all.filter((t) => t.status === "pending").length,
    publicCount: all.filter((t) => t.permission_public).length,
  };

  return (
    <>
      <BrandBackground />
      <main className="brand-page relative">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <BrandLogo size="sm" />
              <p className="brand-label mt-3">Dashboard</p>
              <h1 className="text-2xl font-black mt-1 text-[var(--text-primary)]">
                Manage <span className="gradient-text">testimonials</span>
              </h1>
              <p className="text-brand-slate mt-1">Review, approve, and export feedback</p>
            </div>
          </div>

          <StatsCards {...stats} />
          <div className="glass-panel rounded-2xl p-6 relative">
            <div className="accent-bar absolute inset-x-6 top-0" />
            <div className="pt-2">
              <TestimonialTable
                testimonials={all}
                shareUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share`}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
