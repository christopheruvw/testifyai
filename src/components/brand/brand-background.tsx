import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden brand-mesh-bg">
      <div className="absolute inset-0 brand-grid-overlay opacity-30" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-green/10 blur-[120px] opacity-[var(--orb-opacity)]" />
      <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-green/8 blur-[100px] opacity-[var(--orb-opacity)]" />
    </div>
  );
}

export function BrandLogo({
  size = "md",
  variant = "default",
  href,
  reload,
}: {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "hero";
  href?: string;
  /** Full page navigation — use on /share so the form resets when already on the page */
  reload?: boolean;
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const isHero = variant === "hero";

  const content = (
    <div className={cn("flex flex-col gap-1", isHero ? "items-start" : "items-center")}>
      <span className={`font-black tracking-tight ${sizes[size]}`}>
        <span className={isHero ? "text-white" : "brand-logo-text"}>Testify</span>
        <span className={isHero ? "hero-logo-ai" : "gradient-text"}>AI</span>
      </span>
      {size !== "sm" && (
        <span className={cn("brand-label", isHero && "text-white/70")}>
          Powered testimonials
        </span>
      )}
    </div>
  );

  const linkClassName =
    "inline-block rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  if (href && reload) {
    return (
      <a href={href} className={linkClassName} aria-label="Back to home">
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={linkClassName} aria-label="Back to home">
        {content}
      </Link>
    );
  }

  return content;
}
