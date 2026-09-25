"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import { validateUploadedPhoto } from "@/lib/celebration-studio/validation";

interface PhotoUploaderProps {
  onPhotoSelected: (file: File, objectUrl: string) => void;
  onSamplePhotoSelected?: (sampleUrl: string) => void;
}

const SAMPLE_COMMUNITY_PHOTOS = [
  {
    label: "Community Celebrant (Demo)",
    src: "/images/takete-ide/children-traditional-attire.jpg",
  },
  {
    label: "Cultural Gathering (Demo)",
    src: "/images/takete-ide/cultural-procession.jpg",
  },
];

export function PhotoUploader({
  onPhotoSelected,
  onSamplePhotoSelected,
}: PhotoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validation = validateUploadedPhoto(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onPhotoSelected(file, objectUrl);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Card */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-purple-600 bg-purple-50/80 ring-4 ring-purple-600/10"
            : "border-purple-600/20 bg-white hover:border-purple-600/60 hover:bg-purple-50/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload your portrait or family photograph"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100/70 text-purple-700 transition-transform group-hover:scale-105">
          <UploadCloud className="h-8 w-8 text-purple-700" aria-hidden="true" />
        </div>

        <h3 className="mt-4 font-serif text-lg font-bold text-purple-950">
          Upload Your Photograph
        </h3>
        <p className="mt-1 text-xs text-charcoal/75 max-w-sm">
          Tap or drag and drop your photo here. Supported formats:{" "}
          <strong className="text-purple-900">JPG, JPEG, PNG, WebP</strong> (Max 10 MB).
        </p>

        <div className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-purple-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition group-hover:bg-purple-800">
          Browse Files
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample Demo Photo Quick-Pick */}
      {onSamplePhotoSelected && (
        <div className="rounded-2xl border border-gold-500/20 bg-gold-50/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gold-900">
            <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
            <span>Don&apos;t have a photo handy? Try with community sample photos:</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {SAMPLE_COMMUNITY_PHOTOS.map((sample) => (
              <button
                key={sample.src}
                type="button"
                onClick={() => onSamplePhotoSelected(sample.src)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/50 bg-white px-3 py-1.5 text-xs font-medium text-purple-950 hover:bg-gold-100/60 transition cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
