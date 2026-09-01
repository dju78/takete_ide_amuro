import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CentenaryRSVPContact } from "@/lib/media/centenary-guests";
import { Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CentenaryRSVPSectionProps {
  contacts: CentenaryRSVPContact[];
  className?: string;
}

export function CentenaryRSVPSection({ contacts, className }: CentenaryRSVPSectionProps) {
  return (
    <section id="rsvp" className={cn("scroll-mt-20", className)}>
      <div className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
        <SectionHeading
          eyebrow="Confirmations & Enquiries"
          title="RSVP & Enquiries"
          align="left"
          className="mx-0"
          description="For enquiries, confirmations, sponsorships, and participation, kindly contact:"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex flex-col justify-between rounded-2xl border border-purple-600/10 bg-purple-50/50 p-5 transition hover:border-purple-600/30 hover:bg-purple-50"
            >
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/10 text-purple-700">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </div>

                <p className="mt-3 text-xs font-semibold text-purple-900">
                  Official Centenary Contact {index + 1}
                </p>

                <a
                  href={`tel:${contact.phone}`}
                  className="mt-1 block font-mono text-lg font-bold text-purple-700 hover:text-purple-950 hover:underline tracking-tight"
                  aria-label={`Call ${contact.displayPhone} for Centenary enquiry`}
                >
                  {contact.displayPhone}
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-600/10 text-[0.65rem] text-charcoal/60">
                Official Invitation Line
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-gold-100/50 p-4 sm:p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-gold-700 mt-0.5" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-charcoal/80">
            <strong>Official Contact Notice:</strong> These contact telephone numbers are published directly
            on the official Centenary invitation for enquiries, confirmations, sponsorships, and participation.
          </p>
        </div>
      </div>
    </section>
  );
}
