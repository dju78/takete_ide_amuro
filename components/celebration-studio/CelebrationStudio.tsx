"use client";

import { useState, useEffect, useRef } from "react";
import { CampaignConfig, CelebrationStudioState } from "@/types/celebration-studio";
import { getActiveCampaign } from "@/lib/celebration-studio/campaigns";
import { StepIndicator } from "./StepIndicator";
import { TemplateGallery } from "./TemplateGallery";
import { PhotoUploader } from "./PhotoUploader";
import { PhotoEditor } from "./PhotoEditor";
import { PersonalisationForm } from "./PersonalisationForm";
import { PosterPreview } from "./PosterPreview";
import { ExportControls } from "./ExportControls";
import { PrivacyNotice } from "./PrivacyNotice";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

interface CelebrationStudioProps {
  campaignId?: string;
}

export function CelebrationStudio({ campaignId = "centenary-2026" }: CelebrationStudioProps) {
  const campaign: CampaignConfig = getActiveCampaign(campaignId);
  const defaultTemplate = campaign.templates[0];

  const [state, setState] = useState<CelebrationStudioState>({
    step: 1,
    selectedTemplateId: defaultTemplate.id,
    photoUrl: null,
    photoFile: null,
    photoAdjustments: {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      filter: "original",
      removeBackground: false,
    },
    personalisation: {
      name: "",
      familyName: "",
      title: defaultTemplate.defaultTitle || "",
      greeting: defaultTemplate.defaultSalutation || "Happy Centenary Celebration!",
      message: defaultTemplate.defaultMessage,
      signOff: defaultTemplate.defaultSignOff || "",
      localExpression: defaultTemplate.defaultLocalExpression || campaign.motto,
      customOptions: {
        backgroundPhoto: defaultTemplate.defaultBackgroundPhoto,
      },
    },
    selectedFormat: "portrait",
    previewScale: 1.0,
    isRendering: false,
  });

  const [showStartAgainModal, setShowStartAgainModal] = useState(false);
  const activeObjectUrlRef = useRef<string | null>(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
      }
    };
  }, []);

  const activeTemplate =
    campaign.templates.find((t) => t.id === state.selectedTemplateId) || defaultTemplate;

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    const tpl = campaign.templates.find((t) => t.id === templateId) || defaultTemplate;
    setState((prev) => ({
      ...prev,
      selectedTemplateId: templateId,
      personalisation: {
        ...prev.personalisation,
        title: prev.personalisation.title || tpl.defaultTitle || "",
        greeting: prev.personalisation.greeting || tpl.defaultSalutation || "Happy Centenary Celebration!",
        message: prev.personalisation.message || tpl.defaultMessage,
        localExpression: prev.personalisation.localExpression || tpl.defaultLocalExpression || campaign.motto,
        customOptions: {
          ...prev.personalisation.customOptions,
          backgroundPhoto: tpl.defaultBackgroundPhoto || prev.personalisation.customOptions?.backgroundPhoto,
        },
      },
    }));
  };

  // Handle photo upload
  const handlePhotoSelected = (file: File, objectUrl: string) => {
    if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
    }
    activeObjectUrlRef.current = objectUrl;

    setState((prev) => ({
      ...prev,
      photoFile: file,
      photoUrl: objectUrl,
      photoAdjustments: {
        zoom: 1.0,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: "original",
        removeBackground: false,
      },
      step: 2,
    }));
  };

  const handleSamplePhotoSelected = (sampleUrl: string) => {
    setState((prev) => ({
      ...prev,
      photoFile: null,
      photoUrl: sampleUrl,
      photoAdjustments: {
        zoom: 1.0,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: "original",
        removeBackground: false,
      },
      step: 2,
    }));
  };

  const handleRemovePhoto = () => {
    if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      photoFile: null,
      photoUrl: null,
    }));
  };

  const handleStartAgain = () => {
    if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setState({
      step: 1,
      selectedTemplateId: defaultTemplate.id,
      photoUrl: null,
      photoFile: null,
      photoAdjustments: {
        zoom: 1.0,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: "original",
        removeBackground: false,
      },
      personalisation: {
        name: "",
        familyName: "",
        title: defaultTemplate.defaultTitle || "",
        greeting: defaultTemplate.defaultSalutation || "Happy Centenary Celebration!",
        message: defaultTemplate.defaultMessage,
        signOff: defaultTemplate.defaultSignOff || "",
        localExpression: defaultTemplate.defaultLocalExpression || campaign.motto,
        customOptions: {
          backgroundPhoto: defaultTemplate.defaultBackgroundPhoto,
        },
      },
      selectedFormat: "portrait",
      previewScale: 1.0,
      isRendering: false,
    });
    setShowStartAgainModal(false);
  };

  const canNavigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return true;
    if (targetStep === 3) return Boolean(state.selectedTemplateId);
    if (targetStep === 4) return Boolean(state.selectedTemplateId);
    if (targetStep === 5) return Boolean(state.selectedTemplateId);
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Step Navigation Bar */}
      <div className="rounded-2xl border border-purple-600/10 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-purple-600/10 mb-3">
          <div className="text-xs font-semibold text-purple-900">
            {campaign.name} · Celebration Studio
          </div>
          {state.step > 1 && (
            <button
              type="button"
              onClick={() => setShowStartAgainModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-900 transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Start Again
            </button>
          )}
        </div>
        <StepIndicator
          currentStep={state.step}
          onStepClick={(s) => setState((prev) => ({ ...prev, step: s }))}
          canNavigateToStep={canNavigateToStep}
        />
      </div>

      {/* Main Studio Viewport */}
      {state.step === 1 && (
        <TemplateGallery
          templates={campaign.templates}
          selectedTemplateId={state.selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
          onNext={() => setState((prev) => ({ ...prev, step: 2 }))}
        />
      )}

      {state.step === 2 && (
        <div className="space-y-6">
          {!state.photoUrl ? (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
                  Step 2: Upload Photograph
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  Add Your Photograph
                </h2>
                <p className="mt-1 text-sm text-charcoal/75">
                  Upload a clear portrait or family photograph. Processing is 100% private in your browser.
                </p>
              </div>

              <PhotoUploader
                onPhotoSelected={handlePhotoSelected}
                onSamplePhotoSelected={handleSamplePhotoSelected}
              />

              <PrivacyNotice />

              <div className="flex items-center justify-between pt-4 border-t border-purple-600/10">
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, step: 1 }))}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-950 hover:bg-purple-50 cursor-pointer"
                >
                  ← Back to Templates
                </button>
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, step: 3 }))}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-800 cursor-pointer"
                >
                  Skip for Now / Add Later →
                </button>
              </div>
            </div>
          ) : (
            <PhotoEditor
              photoUrl={state.photoUrl}
              template={activeTemplate}
              adjustments={state.photoAdjustments}
              onChangeAdjustments={(adj) =>
                setState((prev) => ({ ...prev, photoAdjustments: adj }))
              }
              onReplacePhoto={handleRemovePhoto}
              onRemovePhoto={handleRemovePhoto}
              onNext={() => setState((prev) => ({ ...prev, step: 3 }))}
              onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
            />
          )}
        </div>
      )}

      {state.step === 3 && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
          <PersonalisationForm
            template={activeTemplate}
            personalisation={state.personalisation}
            onChangePersonalisation={(pers) =>
              setState((prev) => ({ ...prev, personalisation: pers }))
            }
            onNext={() => setState((prev) => ({ ...prev, step: 4 }))}
            onBack={() => setState((prev) => ({ ...prev, step: 2 }))}
          />

          {/* Desktop Real-time Side Preview */}
          <div className="hidden lg:block sticky top-24">
            <PosterPreview
              campaign={campaign}
              template={activeTemplate}
              personalisation={state.personalisation}
              photoUrl={state.photoUrl}
              photoAdjustments={state.photoAdjustments}
              selectedFormat={state.selectedFormat}
              onSelectFormat={(fmt) => setState((prev) => ({ ...prev, selectedFormat: fmt }))}
              isStandalonePreview={false}
            />
          </div>
        </div>
      )}

      {state.step === 4 && (
        <PosterPreview
          campaign={campaign}
          template={activeTemplate}
          personalisation={state.personalisation}
          photoUrl={state.photoUrl}
          photoAdjustments={state.photoAdjustments}
          selectedFormat={state.selectedFormat}
          onSelectFormat={(fmt) => setState((prev) => ({ ...prev, selectedFormat: fmt }))}
          onNext={() => setState((prev) => ({ ...prev, step: 5 }))}
          onBack={() => setState((prev) => ({ ...prev, step: 3 }))}
          onStartAgain={() => setShowStartAgainModal(true)}
          isStandalonePreview={true}
        />
      )}

      {state.step === 5 && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
          <ExportControls
            campaign={campaign}
            template={activeTemplate}
            personalisation={state.personalisation}
            photoUrl={state.photoUrl}
            photoAdjustments={state.photoAdjustments}
            selectedFormat={state.selectedFormat}
            onSelectFormat={(fmt) => setState((prev) => ({ ...prev, selectedFormat: fmt }))}
            onCreateAnother={handleStartAgain}
            onBackToEdit={() => setState((prev) => ({ ...prev, step: 4 }))}
          />

          {/* Side Preview on Step 5 */}
          <div className="sticky top-24">
            <PosterPreview
              campaign={campaign}
              template={activeTemplate}
              personalisation={state.personalisation}
              photoUrl={state.photoUrl}
              photoAdjustments={state.photoAdjustments}
              selectedFormat={state.selectedFormat}
              onSelectFormat={(fmt) => setState((prev) => ({ ...prev, selectedFormat: fmt }))}
              isStandalonePreview={false}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal for Start Again */}
      {showStartAgainModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="start-again-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl border border-purple-600/20 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                <h3 id="start-again-title" className="font-serif text-lg font-bold text-purple-950">
                  Start a New Poster?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStartAgainModal(false)}
                className="rounded-full p-1 text-charcoal/60 hover:bg-purple-50"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm text-charcoal/75 leading-relaxed">
              Starting again will reset your uploaded photograph and personalized text fields. Would you like to proceed?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStartAgainModal(false)}
                className="rounded-xl border border-purple-200 px-4 py-2 text-xs font-semibold text-purple-950 hover:bg-purple-50 cursor-pointer"
              >
                Keep Current Design
              </button>
              <button
                type="button"
                onClick={handleStartAgain}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs cursor-pointer"
              >
                Yes, Start Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
