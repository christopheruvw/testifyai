import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    initials: "JA",
    name: "Julia Atreya",
    role: "Logistics Director",
    quote: "Takes the pressure off — I just answered prompts and got something I was proud to share.",
    position: "hero-tcard-1",
    delay: "animate-delay-2",
  },
  {
    initials: "AM",
    name: "Alan Morrison",
    role: "Founder & CEO",
    quote: "We close deals faster once real stories are on the site. It's a no-brainer.",
    position: "hero-tcard-2",
    delay: "animate-delay-3",
  },
  {
    initials: "TM",
    name: "Tom Morton",
    role: "CMO, Brand Collective",
    quote: "I share more wins now. It's not just a nice-to-have — it actually moves the needle.",
    position: "hero-tcard-3",
    delay: "animate-delay-4",
  },
] as const;

function HeroStars() {
  return (
    <div className="hero-tcard-stars" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="hero-tcard-star" />
      ))}
    </div>
  );
}

export function ShareHeroTestimonials() {
  return (
    <div className="hero-testimonials animate-fade-up animate-delay-2" aria-hidden>
      <div className="hero-testimonials-glow" />
      <div className="hero-testimonials-pixels">
        <span className="hero-pixel hero-pixel-1" />
        <span className="hero-pixel hero-pixel-2" />
        <span className="hero-pixel hero-pixel-3" />
        <span className="hero-pixel hero-pixel-4" />
        <span className="hero-pixel hero-pixel-5" />
      </div>

      <div className="hero-testimonials-badge hero-testimonials-badge-companies animate-fade-up animate-delay-3">
        100+ companies
      </div>

      <div className="hero-testimonials-badge hero-testimonials-badge-rating animate-fade-up animate-delay-4">
        <Star className="hero-badge-star" />
        4.9 rating
      </div>

      <div className="hero-testimonials-cards">
        {TESTIMONIALS.map((item) => (
          <article
            key={item.name}
            className={`hero-tcard ${item.position} animate-fade-up ${item.delay}`}
          >
            <div className="hero-tcard-accent" />
            <div className="hero-tcard-header">
              <div className="hero-tcard-avatar">{item.initials}</div>
              <div className="hero-tcard-meta">
                <p className="hero-tcard-name">{item.name}</p>
                <p className="hero-tcard-role">{item.role}</p>
              </div>
            </div>
            <HeroStars />
            <p className="hero-tcard-quote">&ldquo;{item.quote}&rdquo;</p>
          </article>
        ))}
      </div>
    </div>
  );
}
