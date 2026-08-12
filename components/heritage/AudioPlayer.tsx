"use client";

export function AudioPlayer({ src, label }: { src: string; label: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-charcoal">{label}</p>
      <audio controls preload="none" className="w-full">
        <source src={src} />
        Your browser does not support the audio element. You can{" "}
        <a href={src}>download the audio file</a> instead.
      </audio>
    </div>
  );
}
