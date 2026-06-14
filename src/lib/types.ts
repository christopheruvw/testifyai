export type RelationshipType =
  | "Coaching Client"
  | "Student"
  | "Business Client"
  | "Marketing Client"
  | "Church Member"
  | "Mentorship Recipient"
  | "Friend"
  | "Social Media Follower"
  | "Other";

export type ImpactArea =
  | "Sales"
  | "Digital Marketing"
  | "Funnel Building"
  | "Web Design/Development"
  | "Brand Designer"
  | "AI Consulting"
  | "Personal Development"
  | "Business"
  | "Marketing"
  | "Leadership"
  | "Career"
  | "Faith"
  | "Productivity"
  | "Mindset"
  | "Other";

export type VisibilityType = "full_name" | "first_name" | "anonymous";

export type SelectedVersion = "short" | "professional" | "story" | "custom";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface TestimonialFormData {
  relationshipType: RelationshipType | "";
  relationshipOther: string;
  impactAreas: ImpactArea[];
  impactAreaOther: string;
  experienceHighlights: string[];
  transformationOutcomes: string[];
  resultsHighlights: string[];
  resultsAmount: string;
  descriptorWords: string[];
  generatedShort: string;
  generatedProfessional: string;
  generatedStory: string;
  selectedVersion: SelectedVersion | "";
  finalTestimonial: string;
  permissionPublic: boolean | null;
  fullName: string;
  email: string;
  company: string;
  role: string;
  visibilityType: VisibilityType | "";
  photoUrl: string;
}

export interface Testimonial extends TestimonialFormData {
  id: string;
  created_at: string;
  relationship_type: RelationshipType | string;
  impact_areas: ImpactArea[] | string[];
  experience_text: string;
  transformation_text: string;
  three_words: string;
  generated_short: string;
  generated_professional: string;
  generated_story: string;
  selected_version: SelectedVersion;
  final_testimonial: string;
  permission_public: boolean;
  full_name: string;
  visibility_type: VisibilityType;
  photo_url: string | null;
  results_text: string | null;
  results_amount: string | null;
  relationship_other: string | null;
  impact_area_other: string | null;
  status: TestimonialStatus;
}

export interface GeneratedTestimonials {
  short: string;
  professional: string;
  story: string;
}
