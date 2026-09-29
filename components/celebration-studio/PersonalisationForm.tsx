"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, User, Tag, Landmark } from "lucide-react";
import {
  CelebrationTemplate,
  PersonalisationData,
} from "@/types/celebration-studio";
import {
  APPROVED_MESSAGES,
  APPROVED_GREETINGS,
  APPROVED_LOCAL_EXPRESSIONS,
} from "@/lib/celebration-studio/messages";
import { APPROVED_HERITAGE_BACKGROUNDS } from "@/lib/celebration-studio/heritage-backgrounds";
import { FIELD_LIMITS, sanitizeTextInput } from "@/lib/celebration-studio/validation";
import { cn } from "@/lib/utils";

interface PersonalisationFormProps {
  template: CelebrationTemplate;
  personalisation: PersonalisationData;
  onChangePersonalisation: (data: PersonalisationData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalisationForm({
  template,
  personalisation,
  onChangePersonalisation,
  onNext,
  onBack,
}: PersonalisationFormProps) {
  const [activeTab, setActiveTab] = useState<"fields" | "backgrounds">("fields");

  const handleChange = (field: keyof PersonalisationData, value: string) => {
    const clean = sanitizeTextInput(value);
    onChangePersonalisation({
      ...personalisation,
      [field]: clean,
    });
  };

  const handleSelectBackground = (bgId: string) => {
    onChangePersonalisation({
      ...personalisation,
      customOptions: {
        ...personalisation.customOptions,
        backgroundPhoto: bgId,
      },
    });
  };

  const isFamily = template.category === "family";
  const isHeritageOrCustom = template.category === "heritage" || template.category === "custom";

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
          <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
          Step 3: Personalise Names &amp; Felicitation
        </span>
        <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
          Add Your Details &amp; Message
        </h2>
        <p className="mt-1 text-sm text-charcoal/75">
          Enter names, select verified congratulatory messages, and customise expressions.
        </p>
      </div>

      {isHeritageOrCustom && (
        <div className="flex gap-2 border-b border-purple-600/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("fields")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer",
              activeTab === "fields"
                ? "bg-purple-700 text-white shadow-xs"
                : "bg-purple-50 text-purple-900 hover:bg-purple-100"
            )}
          >
            Personalisation Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backgrounds")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer",
              activeTab === "backgrounds"
                ? "bg-purple-700 text-white shadow-xs"
                : "bg-purple-50 text-purple-900 hover:bg-purple-100"
            )}
          >
            <Landmark className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            Approved Heritage Backgrounds
          </button>
        </div>
      )}

      {activeTab === "backgrounds" && isHeritageOrCustom ? (
        <div className="space-y-4">
          <div className="text-xs text-charcoal/75">
            Select an approved authentic Takete-Ide scenery background:
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {APPROVED_HERITAGE_BACKGROUNDS.map((bg) => {
              const isSelected =
                (personalisation.customOptions?.backgroundPhoto || template.defaultBackgroundPhoto) === bg.id;
              return (
                <div
                  key={bg.id}
                  onClick={() => handleSelectBackground(bg.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectBackground(bg.id);
                    }
                  }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border-2 p-3 text-left transition cursor-pointer bg-white",
                    isSelected
                      ? "border-purple-600 ring-2 ring-purple-600/20 shadow-md"
                      : "border-purple-600/10 hover:border-gold-500/50"
                  )}
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-xl bg-purple-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bg.imageSrc}
                      alt={bg.altText}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="font-serif text-xs font-bold text-purple-950 truncate">
                      {bg.title}
                    </div>
                    <div className="text-[11px] text-charcoal/60 line-clamp-2 mt-0.5">
                      {bg.caption}
                    </div>
                    <div className="mt-1 text-[10px] italic text-gold-700">
                      Credit: {bg.credit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-5 rounded-3xl border border-purple-600/15 bg-white p-5 sm:p-7 shadow-xs">
          {/* 1. Name or Family Name */}
          {isFamily ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="familyName"
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-950"
                >
                  <User className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                  Family Name <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal/50">
                  {personalisation.familyName?.length || 0}/{FIELD_LIMITS.familyName.max}
                </span>
              </div>
              <input
                id="familyName"
                type="text"
                maxLength={FIELD_LIMITS.familyName.max}
                value={personalisation.familyName}
                onChange={(e) => handleChange("familyName", e.target.value)}
                placeholder="e.g. The Daramola Family, Mr & Mrs Omoyele"
                className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 px-4 py-2.5 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fullName"
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-950"
                >
                  <User className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                  Celebrant Full Name <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal/50">
                  {personalisation.name?.length || 0}/{FIELD_LIMITS.name.max}
                </span>
              </div>
              <input
                id="fullName"
                type="text"
                maxLength={FIELD_LIMITS.name.max}
                value={personalisation.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Chief Daramola Omoyele, Dr. Adebayo Kolade"
                className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 px-4 py-2.5 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          )}

          {/* 2. Optional Title / Role */}
          {!isFamily && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="userTitle"
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-950"
                >
                  <Tag className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                  Title or Community Role (Optional)
                </label>
                <span className="text-[11px] text-charcoal/50">
                  {personalisation.title?.length || 0}/{FIELD_LIMITS.title.max}
                </span>
              </div>
              <input
                id="userTitle"
                type="text"
                maxLength={FIELD_LIMITS.title.max}
                value={personalisation.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Proud Son of Takete-Ide, Community Contributor, Patron"
                className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 px-4 py-2.5 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          )}

          {/* 3. Short Greeting / Salutation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="greetingInput"
                className="text-xs font-bold text-purple-950"
              >
                Celebration Greeting / Salutation
              </label>
              <span className="text-[11px] text-charcoal/50">
                {personalisation.greeting?.length || 0}/{FIELD_LIMITS.greeting.max}
              </span>
            </div>
            <input
              id="greetingInput"
              type="text"
              maxLength={FIELD_LIMITS.greeting.max}
              value={personalisation.greeting}
              onChange={(e) => handleChange("greeting", e.target.value)}
              placeholder="e.g. Happy Centenary Celebration!"
              className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 px-4 py-2 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
            {/* Quick Greeting Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {APPROVED_GREETINGS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleChange("greeting", g)}
                  className="rounded-lg border border-purple-200 bg-purple-50/60 px-2.5 py-1 text-[11px] font-medium text-purple-900 hover:bg-purple-100 transition cursor-pointer"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Felicitation Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="messageInput"
                className="flex items-center gap-1.5 text-xs font-bold text-purple-950"
              >
                <MessageSquare className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                Congratulatory Message <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-charcoal/50">
                {personalisation.message?.length || 0}/{FIELD_LIMITS.message.max}
              </span>
            </div>
            <textarea
              id="messageInput"
              rows={3}
              maxLength={FIELD_LIMITS.message.max}
              value={personalisation.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter your message or select an approved quote below..."
              className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 p-3 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />

            {/* Approved Messages Quick Pick */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-purple-900">
                Approved Centenary Quotations (Tap to fill):
              </span>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {APPROVED_MESSAGES.map((msg) => (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => handleChange("message", msg.text)}
                    className="flex items-start gap-1.5 rounded-xl border border-purple-100 bg-purple-50/40 p-2.5 text-left text-xs text-charcoal/80 hover:border-gold-400 hover:bg-gold-50/30 transition cursor-pointer"
                  >
                    <span className="text-gold-700 font-serif text-sm">“</span>
                    <span className="line-clamp-2">{msg.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Local Expression / Motto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="expressionInput"
                className="text-xs font-bold text-purple-950"
              >
                Local Expression / Motto Banner
              </label>
              <span className="text-[11px] text-charcoal/50">
                {personalisation.localExpression?.length || 0}/{FIELD_LIMITS.localExpression.max}
              </span>
            </div>
            <input
              id="expressionInput"
              type="text"
              maxLength={FIELD_LIMITS.localExpression.max}
              value={personalisation.localExpression}
              onChange={(e) => handleChange("localExpression", e.target.value)}
              placeholder="e.g. Agbagba Ide Agbe Wa O"
              className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 px-4 py-2 text-sm text-charcoal focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
            {/* Quick Expressions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {APPROVED_LOCAL_EXPRESSIONS.map((expr) => (
                <button
                  key={expr}
                  type="button"
                  onClick={() => handleChange("localExpression", expr)}
                  className="rounded-lg border border-gold-300/80 bg-gold-50 px-2.5 py-1 text-[11px] font-semibold text-gold-900 hover:bg-gold-100 transition cursor-pointer"
                >
                  {expr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-600/10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-950 hover:bg-purple-50 transition cursor-pointer"
        >
          ← Back to Photo
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-purple-800 cursor-pointer"
        >
          Continue to Preview →
        </button>
      </div>
    </div>
  );
}
