import { TestimonialForm } from "@/components/share/testimonial-form";
import { BrandLogo } from "@/components/brand/brand-background";
import { HeroBackground } from "@/components/brand/hero-background";

export default function SharePage() {
  return (
    <div className="share-page">
      <HeroBackground />
      <header className="share-header">
        <BrandLogo variant="hero" size="md" href="/share" reload />
      </header>
      <main className="share-main">
        <TestimonialForm />
      </main>
    </div>
  );
}
