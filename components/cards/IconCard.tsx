import Link from "next/link";
import { cn } from "@/lib/utils";

interface IconCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  tone?: "purple" | "gold" | "green";
  className?: string;
  headingLevel?: "h2" | "h3";
}

const toneClasses = {
  purple: "bg-purple-50 text-purple-600",
  gold: "bg-gold-100 text-gold-700",
  green: "bg-green-600/10 text-green-700",
};

export function IconCard({
  icon: Icon,
  title,
  description,
  href,
  tone = "purple",
  className,
  headingLevel = "h3",
}: IconCardProps) {
  const HeadingTag = headingLevel;
  const content = (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow",
        href && "hover:shadow-lg",
        className,
      )}
    >
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClasses[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <HeadingTag className="mt-4 font-serif text-lg font-bold text-purple-600 sm:text-xl">{title}</HeadingTag>
      <p className="mt-3 text-base leading-relaxed text-charcoal/70">{description}</p>
      {href && <span className="mt-4 text-sm font-semibold text-community-green">Learn more →</span>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
