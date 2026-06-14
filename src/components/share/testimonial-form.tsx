"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  RELATIONSHIP_OPTIONS,
  IMPACT_AREA_OPTIONS,
  VISIBILITY_OPTIONS,
  CREATOR_NAME,
  TOTAL_FORM_STEPS,
  DESCRIPTOR_WORDS_MAX,
  getSharingConsentText,
} from "@/lib/constants";
import {
  getExperienceOptions,
  getOutcomeOptions,
  getDescriptorOptions,
  getStep4Prompt,
  getStep5Prompt,
  getStep7Prompt,
  getResultsOptions,
  getResultsPrompt,
} from "@/lib/form-options";
import type {
  TestimonialFormData,
  ImpactArea,
  RelationshipType,
  VisibilityType,
  SelectedVersion,
} from "@/lib/types";
import { submitTestimonial } from "@/actions/testimonials";
import { ShareHeroLanding } from "@/components/share/share-hero-landing";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Upload, Check } from "lucide-react";
import { cn, getPublicDisplayName, getVisibilityLabel } from "@/lib/utils";

const initialFormData: TestimonialFormData = {
  relationshipType: "",
  relationshipOther: "",
  impactAreas: [],
  impactAreaOther: "",
  experienceHighlights: [],
  transformationOutcomes: [],
  resultsHighlights: [],
  resultsAmount: "",
  descriptorWords: [],
  generatedShort: "",
  generatedProfessional: "",
  generatedStory: "",
  selectedVersion: "",
  finalTestimonial: "",
  permissionPublic: null,
  fullName: "",
  email: "",
  company: "",
  role: "",
  visibilityType: "",
  photoUrl: "",
};

function ChipGrid({
  options,
  selected,
  onToggle,
  max,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const isDisabled = !!max && !isSelected && selected.length >= max;

        return (
          <button
            key={option}
            type="button"
            disabled={isDisabled}
            onClick={() => onToggle(option)}
            className={cn(
              "survey-chip",
              isSelected && "survey-chip-selected",
              isDisabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SingleSelectChips({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "survey-chip",
            selected === option && "survey-chip-selected"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function TestimonialForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [customText, setCustomText] = useState("");


  const relationship = formData.relationshipType as RelationshipType;

  const updateForm = (updates: Partial<TestimonialFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError("");
  };

  const selectRelationship = (option: RelationshipType) => {
    setFormData((prev) => ({
      ...prev,
      relationshipType: option,
      relationshipOther: option === "Other" ? prev.relationshipOther : "",
      experienceHighlights: [],
      transformationOutcomes: [],
      resultsHighlights: [],
      resultsAmount: "",
      descriptorWords: [],
    }));
    setError("");
  };

  const toggleImpactArea = (area: ImpactArea) => {
    setFormData((prev) => {
      const isRemoving = prev.impactAreas.includes(area);
      return {
        ...prev,
        impactAreas: isRemoving
          ? prev.impactAreas.filter((a) => a !== area)
          : [...prev.impactAreas, area],
        impactAreaOther: isRemoving && area === "Other" ? "" : prev.impactAreaOther,
        experienceHighlights: [],
        transformationOutcomes: [],
        resultsHighlights: [],
      };
    });
    setError("");
  };

  const toggleSelection = (
    field:
      | "experienceHighlights"
      | "transformationOutcomes"
      | "resultsHighlights"
      | "descriptorWords",
    option: string,
    max?: number
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      const isSelected = current.includes(option);

      if (isSelected) {
        return { ...prev, [field]: current.filter((item) => item !== option) };
      }

      if (max && current.length >= max) return prev;

      return { ...prev, [field]: [...current, option] };
    });
    setError("");
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return !!formData.relationshipType &&
          (formData.relationshipType !== "Other" || formData.relationshipOther.trim().length > 0);
      case 3:
        return (
          formData.impactAreas.length > 0 &&
          (!formData.impactAreas.includes("Other") || formData.impactAreaOther.trim().length > 0)
        );
      case 4:
        return formData.experienceHighlights.length > 0;
      case 5:
        return formData.transformationOutcomes.length > 0;
      case 6:
        return true;
      case 7:
        return formData.descriptorWords.length === DESCRIPTOR_WORDS_MAX;
      case 9:
        return !!formData.selectedVersion && !!formData.finalTestimonial.trim();
      case 10:
        return formData.permissionPublic === true;
      case 11:
        return (
          formData.fullName.trim().length > 0 &&
          formData.email.trim().length > 0 &&
          !!formData.visibilityType
        );
      default:
        return true;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);

      const res = await fetch("/api/generate-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipType:
            formData.relationshipType === "Other" && formData.relationshipOther.trim()
              ? `Other: ${formData.relationshipOther.trim()}`
              : formData.relationshipType,
          impactAreas: formData.impactAreas.map((area) =>
            area === "Other" && formData.impactAreaOther.trim()
              ? `Other: ${formData.impactAreaOther.trim()}`
              : area
          ),
          experienceHighlights: formData.experienceHighlights,
          transformationOutcomes: formData.transformationOutcomes,
          descriptorWords: formData.descriptorWords,
          resultsHighlights: formData.resultsHighlights,
          resultsAmount: formData.resultsAmount,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed");
      }

      const data = await res.json();
      const short =
        typeof data.short === "string"
          ? data.short
          : typeof data.testimonial1 === "string"
            ? data.testimonial1
            : "";
      const professional =
        typeof data.professional === "string"
          ? data.professional
          : typeof data.testimonial2 === "string"
            ? data.testimonial2
            : "";
      const story =
        typeof data.story === "string"
          ? data.story
          : typeof data.testimonial3 === "string"
            ? data.testimonial3
            : "";

      if (!short || !professional || !story) {
        throw new Error("Invalid testimonial format");
      }

      updateForm({
        generatedShort: short,
        generatedProfessional: professional,
        generatedStory: story,
      });
      setStep(9);
    } catch {
      setError("Taking longer than expected — please tap Write My Testimonial again.");
      setStep(7);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      if (step === 7) {
        setError(`Please pick exactly ${DESCRIPTOR_WORDS_MAX} words.`);
      } else if (step === 9) {
        setError("Please select a version and add your testimonial text.");
      } else if (step === 10) {
        setError("Please agree to the sharing terms to continue.");
      } else if (step === 2 && formData.relationshipType === "Other") {
        setError("Please describe how you know them.");
      } else if (step === 3 && formData.impactAreas.includes("Other")) {
        setError("Please describe the other impact area.");
      } else {
        setError("Please select at least one option to continue.");
      }
      return;
    }

    if (step === 7) {
      setStep(8);
      await handleGenerate();
      return;
    }

    if (step === 8) return;

    if (step === 12) {
      await handleSubmit();
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1 && step !== 8) {
      setStep((s) => (s === 9 ? 7 : s - 1));
      setError("");
    }
  };

  const selectVersion = (version: SelectedVersion) => {
    let text = "";
    switch (version) {
      case "short":
        text = formData.generatedShort;
        break;
      case "professional":
        text = formData.generatedProfessional;
        break;
      case "story":
        text = formData.generatedStory;
        break;
      case "custom":
        text = customText;
        break;
    }
    updateForm({ selectedVersion: version, finalTestimonial: text });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: uploadData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      updateForm({ photoUrl: url });
    } catch {
      setError("Failed to upload photo. You can skip this and continue.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    const result = await submitTestimonial(formData);

    if (result.success) {
      router.push("/share/success");
    } else {
      setError(result.error ?? "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return null;

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">How do you know {CREATOR_NAME}?</h2>
              <p className="survey-subtext mt-1.5">Pick the option that fits your relationship.</p>
            </div>
            <SingleSelectChips
              options={[...RELATIONSHIP_OPTIONS]}
              selected={formData.relationshipType}
              onSelect={(option) => selectRelationship(option as RelationshipType)}
            />
            {formData.relationshipType === "Other" && (
              <div className="animate-fade-up">
                <Input
                  id="relationshipOther"
                  autoFocus
                  placeholder="Describe how you know them (e.g. workshop attendee, referral...)"
                  value={formData.relationshipOther}
                  onChange={(e) => updateForm({ relationshipOther: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">What area did {CREATOR_NAME} impact?</h2>
              <p className="survey-subtext mt-1.5">
                Select all that apply — options in the next steps adapt to this.
              </p>
            </div>
            <ChipGrid
              options={[...IMPACT_AREA_OPTIONS]}
              selected={formData.impactAreas}
              onToggle={(option) => toggleImpactArea(option as ImpactArea)}
            />
            {formData.impactAreas.includes("Other") && (
              <div className="animate-fade-up">
                <Input
                  placeholder="Describe the area (e.g. podcast coaching, event speaking...)"
                  value={formData.impactAreaOther}
                  onChange={(e) => updateForm({ impactAreaOther: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 4: {
        const prompt = getStep4Prompt(relationship);
        const options = getExperienceOptions(relationship, formData.impactAreas);
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">{prompt.title}</h2>
              <p className="survey-subtext mt-1.5">{prompt.subtitle}</p>
            </div>
            <ChipGrid
              options={options}
              selected={formData.experienceHighlights}
              onToggle={(option) => toggleSelection("experienceHighlights", option)}
            />
            {formData.experienceHighlights.length > 0 && (
              <p className="text-xs text-green">
                {formData.experienceHighlights.length} selected
              </p>
            )}
          </div>
        );
      }

      case 5: {
        const prompt = getStep5Prompt(relationship);
        const options = getOutcomeOptions(formData.impactAreas);
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">{prompt.title}</h2>
              <p className="survey-subtext mt-1.5">{prompt.subtitle}</p>
            </div>
            <ChipGrid
              options={options}
              selected={formData.transformationOutcomes}
              onToggle={(option) => toggleSelection("transformationOutcomes", option)}
            />
            {formData.transformationOutcomes.length > 0 && (
              <p className="text-xs text-green">
                {formData.transformationOutcomes.length} selected
              </p>
            )}
          </div>
        );
      }

      case 6: {
        const prompt = getResultsPrompt();
        const options = getResultsOptions(formData.impactAreas);
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">{prompt.title}</h2>
              <p className="survey-subtext mt-1.5">{prompt.subtitle}</p>
            </div>
            <ChipGrid
              options={options}
              selected={formData.resultsHighlights}
              onToggle={(option) => toggleSelection("resultsHighlights", option)}
            />
            <div>
              <Label htmlFor="resultsAmount">Exact amount you made (optional)</Label>
              <Input
                id="resultsAmount"
                placeholder="e.g. I made $18,500 in 60 days"
                value={formData.resultsAmount}
                onChange={(e) => updateForm({ resultsAmount: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-brand-slate mt-1.5">
                This helps {CREATOR_NAME} showcase real wins in marketing materials.
              </p>
            </div>
            {(formData.resultsHighlights.length > 0 || formData.resultsAmount.trim()) && (
              <p className="text-xs text-green">
                {formData.resultsHighlights.length} result
                {formData.resultsHighlights.length === 1 ? "" : "s"} selected
                {formData.resultsAmount.trim() ? " + custom amount" : ""}
              </p>
            )}
          </div>
        );
      }

      case 7: {
        const prompt = getStep7Prompt();
        const options = getDescriptorOptions(relationship);
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">{prompt.title}</h2>
              <p className="survey-subtext mt-1.5">{prompt.subtitle}</p>
            </div>
            <ChipGrid
              options={options}
              selected={formData.descriptorWords}
              onToggle={(option) => toggleSelection("descriptorWords", option, DESCRIPTOR_WORDS_MAX)}
              max={DESCRIPTOR_WORDS_MAX}
            />
            <p className="text-xs text-brand-slate/70">
              {formData.descriptorWords.length}/{DESCRIPTOR_WORDS_MAX} words selected
            </p>
          </div>
        );
      }

      case 8:
        return (
          <div className="text-center space-y-4 py-8">
            <Loader2 className="w-12 h-12 survey-spinner animate-spin mx-auto" />
            <h2 className="survey-question font-black">Writing your testimonial...</h2>
            <p className="survey-subtext">AI is crafting something great for you</p>
            <div className="flex justify-center gap-1.5 pt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-8 rounded-full survey-progress-fill animate-pulse-glow"
                  style={{ animationDelay: `${i * 0.3}s`, width: "2rem" }}
                />
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">Choose your testimonial</h2>
              <p className="survey-subtext mt-1.5">
                Pick an AI version, edit it, or write your own.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { key: "short" as const, label: "Short & Sweet", text: formData.generatedShort },
                { key: "professional" as const, label: "Professional", text: formData.generatedProfessional },
                { key: "story" as const, label: "Story Style", text: formData.generatedStory },
              ].map(({ key, label, text }) => (
                <Card
                  key={key}
                  className={cn(
                    "cursor-pointer transition-all border-0",
                    formData.selectedVersion === key
                      ? "option-card-selected ring-0"
                      : "option-card"
                  )}
                  onClick={() => selectVersion(key)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green">{label}</span>
                      {formData.selectedVersion === key && (
                        <Check className="w-4 h-4 text-green" />
                      )}
                    </div>
                    <p className="text-sm text-brand-slate leading-relaxed">
                      {typeof text === "string" ? text : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}

                <Card
                  className={cn(
                    "cursor-pointer transition-all",
                    formData.selectedVersion === "custom"
                      ? "option-card-selected ring-0 border-0"
                      : "option-card border-0"
                  )}
                  onClick={() => selectVersion("custom")}
                >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green">Write Your Own</span>
                    {formData.selectedVersion === "custom" && (
                      <Check className="w-4 h-4 text-green" />
                    )}
                  </div>
                  <Textarea
                    placeholder="Write your testimonial in your own words..."
                    value={customText}
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      if (formData.selectedVersion === "custom") {
                        updateForm({ finalTestimonial: e.target.value });
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={() => selectVersion("custom")}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {formData.selectedVersion &&
              formData.selectedVersion !== "custom" && (
                <div className="space-y-2">
                  <Label>Edit selected version (optional)</Label>
                  <Textarea
                    value={formData.finalTestimonial}
                    onChange={(e) =>
                      updateForm({ finalTestimonial: e.target.value })
                    }
                    className="min-h-[100px]"
                  />
                </div>
              )}
          </div>
        );

      case 10:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="survey-question">Permission to share</h2>
              <p className="survey-subtext mt-1.5">
                Testimonials are meant to be shared. Please review and agree before continuing.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 text-sm text-brand-slate leading-relaxed">
              {getSharingConsentText()}
            </div>
            <label className="flex items-start gap-3 px-4 py-3.5 rounded-2xl option-card cursor-pointer transition-all">
              <Checkbox
                checked={formData.permissionPublic === true}
                onCheckedChange={(checked) =>
                  updateForm({ permissionPublic: checked === true })
                }
                className="mt-0.5"
              />
              <span className="text-sm leading-relaxed">
                I agree and give {CREATOR_NAME} permission to use my testimonial as
                described above.
              </span>
            </label>
          </div>
        );

      case 11:
        return (
          <div className="space-y-5">
            <h2 className="survey-question">Almost done — tell us about you</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateForm({ fullName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => updateForm({ company: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role (optional)</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => updateForm({ role: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Photo (optional)</Label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] cursor-pointer hover:border-green/30 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      {isUploading ? "Uploading..." : "Upload Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {formData.photoUrl && (
                    <span className="text-sm text-green">Photo uploaded</span>
                  )}
                </div>
              </div>

              <div>
                <Label>Name Visibility *</Label>
                <p className="text-xs text-brand-slate mt-1 mb-2">
                  Choose how your name appears when this testimonial is shared publicly.
                  We still collect your full name for verification.
                </p>
                <RadioGroup
                  value={formData.visibilityType}
                  onValueChange={(v) => updateForm({ visibilityType: v as VisibilityType })}
                  className="mt-2 space-y-2"
                >
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "survey-radio-option",
                        formData.visibilityType === opt.value && "survey-radio-option-selected"
                      )}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
                {formData.fullName.trim() && formData.visibilityType && (
                  <p className="mt-3 text-sm text-green">
                    You&apos;ll appear publicly as{" "}
                    <span className="font-semibold">
                      {getPublicDisplayName(formData.fullName, formData.visibilityType)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-5">
            <h2 className="survey-question">Review & Submit</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="brand-label">Your Testimonial</p>
                  <p className="mt-1 text-sm text-brand-slate italic leading-relaxed">
                    &ldquo;{formData.finalTestimonial}&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="brand-label">Public Name</p>
                    <p className="font-medium">
                      {getPublicDisplayName(formData.fullName, formData.visibilityType)}
                    </p>
                  </div>
                  <div>
                    <p className="brand-label">Name Visibility</p>
                    <p className="font-medium">
                      {getVisibilityLabel(formData.visibilityType)}
                    </p>
                  </div>
                  <div>
                    <p className="brand-label">Sharing Consent</p>
                    <p className="font-medium">Agreed</p>
                  </div>
                  <div>
                    <p className="brand-label">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  {(formData.resultsHighlights.length > 0 || formData.resultsAmount.trim()) && (
                    <div className="col-span-2">
                      <p className="brand-label">Results Shared</p>
                      <p className="font-medium">
                        {[
                          ...formData.resultsHighlights,
                          formData.resultsAmount.trim(),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (step === 1) {
    return (
      <ShareHeroLanding
        onStart={() => {
          setError("");
          setStep(2);
        }}
        isLoading={isGenerating || isSubmitting}
      />
    );
  }

  return (
    <div className="share-form-shell animate-fade-up">
      <div className="share-form-panel glass-panel p-6 sm:p-8 relative">
        {step !== 8 && (
          <>
            <div className="survey-form-header">
              <h1 className="survey-form-title">Share your experience</h1>
              <span className="survey-step-label">
                Step {step} of {TOTAL_FORM_STEPS}
              </span>
            </div>
            <div className="survey-progress" aria-hidden>
              <div
                className="survey-progress-fill"
                style={{ width: `${(step / TOTAL_FORM_STEPS) * 100}%` }}
              />
            </div>
          </>
        )}

        <div className="min-h-[280px]">{renderStep()}</div>

        {error && (
          <p className="mt-4 text-sm text-orange text-center font-medium">{error}</p>
        )}

        {step !== 8 && (
          <div className="survey-form-footer">
            <Button variant="outline" onClick={handleBack} className="survey-btn-back">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isGenerating || isSubmitting || isUploading}
              className="survey-btn-next"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : step === 7 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Write My Testimonial
                </>
              ) : step === 12 ? (
                "Submit"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
