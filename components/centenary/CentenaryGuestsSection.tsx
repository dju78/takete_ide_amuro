import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CentenaryGuestGroup } from "@/lib/media/centenary-guests";
import { Crown, Sparkles, Award, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CentenaryGuestsSectionProps {
  groups: CentenaryGuestGroup[];
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  distinguished_special_guest: Crown,
  special_guests_of_honour: Award,
  chairman_of_the_day: Sparkles,
  lady_chairman: Sparkles,
  chief_launcher: Shield,
  co_launchers: Users,
  special_hosts: Users,
  special_royal_guest: Crown,
  special_royal_hosts: Crown,
  royal_guest: Crown,
  royal_host: Crown,
  chief_hosts: Shield,
};

export function CentenaryGuestsSection({ groups, className }: CentenaryGuestsSectionProps) {
  return (
    <section id="guests" className={cn("scroll-mt-20", className)}>
      <SectionHeading
        eyebrow="Official Dignitaries & Leadership"
        title="Official Guests & Hosts"
        align="left"
        className="mx-0"
        description="Distinguished guests, traditional leaders, hosts and launchers listed on the official Takete-Ide Centenary 2026 invitation."
      />

      <div className="mt-10 space-y-10">
        {groups.map((group) => {
          const Icon = CATEGORY_ICONS[group.category] ?? Sparkles;
          const isDistinguished = group.category === "distinguished_special_guest";
          const isRoyal = group.category.includes("royal");
          const isChairmanOrLauncher =
            group.category === "chairman_of_the_day" ||
            group.category === "lady_chairman" ||
            group.category === "chief_launcher";

          return (
            <div
              key={group.category}
              className={cn(
                "rounded-3xl border p-6 sm:p-8 lg:p-10 transition-all",
                isDistinguished
                  ? "border-2 border-gold-500/50 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 text-white shadow-md"
                  : isRoyal
                  ? "border-gold-500/30 bg-gold-100/40 text-purple-950 shadow-sm"
                  : isChairmanOrLauncher
                  ? "border-purple-600/20 bg-purple-50/50 text-purple-950 shadow-sm"
                  : "border-purple-600/10 bg-white text-purple-950 shadow-sm",
              )}
            >
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 sm:pb-5 border-current/10">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      isDistinguished
                        ? "bg-gold-400 text-purple-950"
                        : isRoyal
                        ? "bg-gold-500/20 text-gold-900"
                        : "bg-purple-600/10 text-purple-700",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <div>
                    {group.eyebrow && (
                      <p
                        className={cn(
                          "text-[0.65rem] font-bold uppercase tracking-widest sm:text-xs",
                          isDistinguished ? "text-gold-300" : "text-charcoal/60",
                        )}
                      >
                        {group.eyebrow}
                      </p>
                    )}
                    <h3
                      className={cn(
                        "font-serif text-lg font-bold sm:text-xl",
                        isDistinguished ? "text-white" : "text-purple-900",
                      )}
                    >
                      {group.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    isDistinguished
                      ? "bg-gold-400/20 text-gold-200"
                      : "bg-purple-100 text-purple-700",
                  )}
                >
                  {group.items.length} {group.items.length === 1 ? "Dignitary" : "Dignitaries"}
                </span>
              </div>

              {/* Guest Cards Grid */}
              <div
                className={cn(
                  "mt-6 grid gap-4 sm:gap-6",
                  group.items.length === 1
                    ? "grid-cols-1"
                    : group.items.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {group.items.map((guest) => (
                  <div
                    key={guest.id}
                    className={cn(
                      "flex flex-col justify-between rounded-2xl p-5 transition",
                      isDistinguished
                        ? "bg-white/10 ring-1 ring-inset ring-white/15"
                        : isRoyal
                        ? "bg-white/80 ring-1 ring-inset ring-gold-500/20"
                        : "bg-white ring-1 ring-inset ring-purple-600/10 shadow-xs",
                    )}
                  >
                    <div>
                      <span
                        className={cn(
                          "inline-block text-[0.65rem] font-bold uppercase tracking-wider",
                          isDistinguished
                            ? "text-gold-300"
                            : isRoyal
                            ? "text-gold-800"
                            : "text-purple-600",
                        )}
                      >
                        {guest.categoryLabel}
                      </span>

                      <h4
                        className={cn(
                          "mt-1.5 font-serif font-bold text-base sm:text-lg leading-snug",
                          isDistinguished ? "text-white" : "text-purple-950",
                        )}
                      >
                        {guest.name}
                      </h4>

                      {guest.role && (
                        <p
                          className={cn(
                            "mt-2 text-xs leading-relaxed",
                            isDistinguished ? "text-white/80" : "text-charcoal/75",
                          )}
                        >
                          {guest.role}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[0.65rem] opacity-70">
                      <span>Official Invitation</span>
                      <span>Takete-Ide 2026</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
