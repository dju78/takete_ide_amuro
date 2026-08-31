"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ShieldCheck, Info, QrCode } from "lucide-react";
import { SUPPORT_BENEFICIARY_NOTICE, SUPPORT_SECURITY_NOTICE } from "@/lib/media/community-programme";
import type { SupportAccount } from "@/lib/media/community-programme";

/**
 * The union's official contribution account and manual bank transfer QR.
 *
 * Two things matter more than the styling here. First, the beneficiary-name
 * check: account numbers get copied out of screenshots and mistyped, so the card
 * tells people to confirm the name their bank app shows before sending anything.
 * Second, the site never asks for a PIN, password or OTP, and says so — the most
 * common way a community page like this gets abused is a clone that does.
 */
export function SupportAccountCard({ account }: { account: SupportAccount }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
    } catch {
      // Clipboard access can be blocked; the number is visible and selectable
      // either way, so confirm the attempt rather than raising an error.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
      <div className="bg-purple-700 px-6 py-5 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
          Official contribution account
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold sm:text-2xl">{account.accountName}</h2>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,auto] lg:items-start">
          {/* Bank Account Details */}
          <div>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Bank</dt>
                <dd className="mt-1 text-lg font-semibold text-charcoal">{account.bankName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  Account number
                </dt>
                {/* Standard sans-serif typography with tabular figures for optimal clarity and scan-reading */}
                <dd className="mt-1 font-sans text-2xl font-bold tracking-wider tabular-nums text-purple-600 select-all">
                  {account.accountNumber}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={copy}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-base font-semibold text-purple-900 transition-colors hover:bg-gold-300 focus-visible:bg-gold-300"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Account number copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copy account number
                </>
              )}
            </button>
            {/* Announced once, politely — the button label changing is enough visually. */}
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Account number copied" : ""}
            </span>
          </div>

          {/* QR Code Section for Manual Transfer Account Details */}
          <div className="flex flex-col items-center rounded-2xl border border-purple-600/10 bg-purple-50/50 p-5 text-center sm:flex-row sm:text-left lg:flex-col lg:text-center">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-charcoal/5">
              <Image
                src="/images/support/takete-account-details-qr.png"
                alt="QR code to view Takete-Ide Progressive Union bank account details for manual transfer"
                width={144}
                height={144}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="mt-4 sm:ml-5 sm:mt-0 lg:ml-0 lg:mt-3">
              <h3 className="flex items-center justify-center gap-1.5 font-serif text-sm font-bold text-purple-900 sm:justify-start lg:justify-center">
                <QrCode className="h-4 w-4 text-purple-600" aria-hidden="true" />
                Scan for account details
              </h3>
              <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-charcoal/70">
                Scan this code to view the official bank account details for manual transfer.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Verification Notices */}
        <p className="mt-6 flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-4 text-sm leading-relaxed text-charcoal/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
          <span>{SUPPORT_BENEFICIARY_NOTICE}</span>
        </p>

        <p className="mt-3 flex gap-3 rounded-2xl bg-purple-50 p-4 text-sm leading-relaxed text-charcoal/75">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" aria-hidden="true" />
          <span>{SUPPORT_SECURITY_NOTICE}</span>
        </p>
      </div>
    </div>
  );
}
