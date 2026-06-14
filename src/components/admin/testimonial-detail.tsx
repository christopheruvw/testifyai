"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateTestimonial, deleteTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/lib/types";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { formatDateTime, getPublicDisplayName, getVisibilityLabel } from "@/lib/utils";

interface TestimonialDetailProps {
  testimonial: Testimonial;
}

export function TestimonialDetail({ testimonial }: TestimonialDetailProps) {
  const router = useRouter();
  const [finalText, setFinalText] = useState(testimonial.final_testimonial);
  const [status, setStatus] = useState(testimonial.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateTestimonial(testimonial.id, {
      final_testimonial: finalText,
      status,
    });
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await deleteTestimonial(testimonial.id);
    router.push("/admin");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="brand-label text-brand-slate">Legal Name</p>
                <p className="font-medium text-white">{testimonial.full_name}</p>
              </div>
              <div>
                <p className="brand-label text-brand-slate">Public Display Name</p>
                <p className="font-medium text-green">
                  {getPublicDisplayName(testimonial.full_name, testimonial.visibility_type)}
                </p>
              </div>
              <div>
                <p className="text-brand-slate">Email</p>
            <p className="text-white">{testimonial.email}</p>
              </div>
              {testimonial.company && (
                <div>
                  <p className="text-brand-slate">Company</p>
                  <p>{testimonial.company}</p>
                </div>
              )}
              {testimonial.role && (
                <div>
                  <p className="text-brand-slate">Role</p>
                  <p>{testimonial.role}</p>
                </div>
              )}
              <div>
                <p className="text-brand-slate">Relationship</p>
                <p>{testimonial.relationship_type}</p>
              </div>
              <div>
                <p className="text-brand-slate">Visibility</p>
                <p>{getVisibilityLabel(testimonial.visibility_type)}</p>
              </div>
              <div>
                <p className="text-brand-slate">Sharing Consent</p>
                <p>{testimonial.permission_public ? "Agreed" : "Not agreed"}</p>
              </div>
              <div>
                <p className="text-brand-slate">Submitted</p>
                <p>{formatDateTime(testimonial.created_at)}</p>
              </div>
            </div>
            {testimonial.photo_url && (
              <div>
                <p className="text-brand-slate mb-2">Photo</p>
                <div className="flex flex-wrap items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.photo_url}
                    alt={getPublicDisplayName(testimonial.full_name, testimonial.visibility_type)}
                    className="w-32 h-32 rounded-xl object-cover border border-[var(--border-color)]"
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`/api/download-photo?url=${encodeURIComponent(testimonial.photo_url)}&filename=${encodeURIComponent(`${testimonial.full_name.replace(/\s+/g, "-")}-photo.jpg`)}`}
                      >
                        Download Photo
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={testimonial.photo_url} target="_blank" rel="noopener noreferrer">
                        Open Full Size
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approved Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Testimonial["status"])}
                className="mt-1 flex h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Label>Final Testimonial</Label>
              <Textarea
                value={finalText}
                onChange={(e) => setFinalText(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <p className="text-xs text-brand-slate">
              Version selected: {testimonial.selected_version}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-brand-slate">Impact Areas</p>
            <p>{(testimonial.impact_areas as string[]).join(", ")}</p>
          </div>
          <div>
            <p className="text-brand-slate">Experience</p>
            <p className="whitespace-pre-wrap">{testimonial.experience_text}</p>
          </div>
          <div>
            <p className="text-brand-slate">Transformation</p>
            <p className="whitespace-pre-wrap">{testimonial.transformation_text}</p>
          </div>
          {(testimonial.results_text || testimonial.results_amount) && (
            <div>
              <p className="text-brand-slate">Results & Numbers</p>
              <p>
                {[testimonial.results_text, testimonial.results_amount]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}
          {(testimonial.relationship_other || testimonial.impact_area_other) && (
            <div>
              <p className="text-brand-slate">Custom Details</p>
              <p>
                {[
                  testimonial.relationship_other &&
                    `Relationship: ${testimonial.relationship_other}`,
                  testimonial.impact_area_other &&
                    `Impact: ${testimonial.impact_area_other}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}
          <div>
            <p className="text-brand-slate">Three Words</p>
            <p>{testimonial.three_words}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Generated Versions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Short", text: testimonial.generated_short },
            { label: "Professional", text: testimonial.generated_professional },
            { label: "Story-Based", text: testimonial.generated_story },
          ].map(({ label, text }) => (
            <div key={label}>
              <p className="text-sm font-medium text-green mb-1">{label}</p>
              <p className="text-sm text-brand-slate italic">&ldquo;{text}&rdquo;</p>
              <Separator className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
