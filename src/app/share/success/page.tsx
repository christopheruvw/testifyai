import { CheckCircle, Sparkles } from "lucide-react";
import { CREATOR_NAME } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/brand-background";
import { HeroBackground } from "@/components/brand/hero-background";

export default function SuccessPage() {
  return (
    <div className="share-page success-page">
      <HeroBackground />
      <main className="success-main">
        <div className="success-card">
          <div className="success-card-accent" />
          <BrandLogo size="sm" href="/share" />
          <div className="success-icon">
            <CheckCircle className="w-10 h-10 text-[var(--charcoal)]" />
          </div>
          <div>
            <h1 className="success-title">
              Thank <span className="success-title-accent">you</span>
            </h1>
            <p className="success-copy">
              Your testimonial has been submitted. {CREATOR_NAME} truly appreciates
              you sharing your experience.
            </p>
          </div>
          <div className="success-badge">
            <Sparkles className="w-3.5 h-3.5" />
            Your words make a real difference
          </div>
        </div>
      </main>
    </div>
  );
}
