import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { CREATOR_NAME } from "@/lib/constants";
import { ShareHeroTestimonials } from "@/components/share/share-hero-testimonials";

interface ShareHeroLandingProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function ShareHeroLanding({ onStart, isLoading }: ShareHeroLandingProps) {
  return (
    <div className="hero-landing animate-fade-up">
      <div className="hero-landing-grid">
        <div className="hero-landing-copy">
        <span className="hero-eyebrow animate-fade-up animate-delay-1">
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered testimonials for {CREATOR_NAME}
        </span>

        <h1 className="hero-headline animate-fade-up animate-delay-2">
          Your words could be the reason{" "}
          <span className="hero-headline-accent">someone says yes.</span>
        </h1>

        <p className="hero-subcopy animate-fade-up animate-delay-3">
          You don&apos;t have to write anything from scratch. Just tell us what changed,
          we&apos;ll handle the rest. It takes under 2 minutes and you&apos;ll see exactly
          how it reads before you submit.
        </p>

        <div className="hero-cta-row animate-fade-up animate-delay-4">
          <button
            type="button"
            onClick={onStart}
            disabled={isLoading}
            className="hero-cta"
          >
            <span className="hero-cta-icon">
              <ArrowUpRight className="w-4 h-4" />
            </span>
            Get started
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={isLoading}
            className="hero-secondary-link"
          >
            See how it works
          </button>
        </div>

        <div className="hero-stats-section animate-fade-up animate-delay-5">
          <p className="hero-stats-eyebrow">Why people complete it</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <p className="hero-stat-value">94%</p>
              <div className="hero-stat-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[var(--lime)] text-[var(--lime)]" />
                ))}
              </div>
              <p className="hero-stat-label">Completion rate</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value">&lt;2min</p>
              <p className="hero-stat-label">Avg. time to submit</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value">3x</p>
              <p className="hero-stat-label">More testimonials collected</p>
            </div>
          </div>
        </div>
        </div>

        <div className="hero-landing-visual">
          <ShareHeroTestimonials />
        </div>
      </div>
    </div>
  );
}
