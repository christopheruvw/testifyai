import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestimonialDetail } from "@/components/admin/testimonial-detail";
import { BrandBackground } from "@/components/brand/brand-background";
import type { Testimonial } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestimonialDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (!testimonial) {
    notFound();
  }

  return (
    <>
      <BrandBackground />
      <main className="brand-page relative">
        <div className="max-w-6xl mx-auto p-6">
          <TestimonialDetail testimonial={testimonial as Testimonial} />
        </div>
      </main>
    </>
  );
}
