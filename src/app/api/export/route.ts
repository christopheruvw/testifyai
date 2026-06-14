import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getPublicDisplayName, getVisibilityLabel } from "@/lib/utils";

function escapeCSV(value: string | null | undefined): string {
  if (!value) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers = [
    "ID",
    "Date",
    "Full Name",
    "Public Display Name",
    "Email",
    "Company",
    "Role",
    "Relationship",
    "Impact Areas",
    "Final Testimonial",
    "Results",
    "Results Amount",
    "Sharing Consent",
    "Visibility",
    "Status",
  ];

  const rows = testimonials.map((t) => [
    t.id,
    formatDate(t.created_at),
    t.full_name,
    getPublicDisplayName(t.full_name, t.visibility_type),
    t.email,
    t.company,
    t.role,
    t.relationship_type,
    (t.impact_areas as string[]).join("; "),
    t.final_testimonial,
    t.results_text,
    t.results_amount,
    t.permission_public ? "Agreed" : "Not agreed",
    getVisibilityLabel(t.visibility_type),
    t.status,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="testimonials-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
