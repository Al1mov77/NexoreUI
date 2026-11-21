"use client";

import React, { useState } from "react";
import {
  AudioWaveform,
  CodeSnippet,
  EmbedCard,
  FilePreviewCard,
  GalleryGrid,
  ImageCarousel,
  ImageCompare,
  MusicPlayer,
  TestimonialCarousel,
  VideoPlayer,
} from "nexoreui";
import { A11yHeader } from "../A11yNotice";
import { ComponentCard, ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { WhenToUse } from "../WhenToUse";

const whenToUseItems = [
  {
    label: "Music & Waveform",
    description:
      "Use MusicPlayer and AudioWaveform for deterministic scrubbable tracks, podcast chapters, or voice notes.",
  },
  {
    label: "VideoPlayer",
    description:
      "Use for walkthrough recordings or demos requiring native playback speed, mute, scrubber, and fullscreen controls.",
  },
  {
    label: "ImageCompare",
    description:
      "Use for interactive before/after visual regressions, design tokens, or rendering quality comparisons.",
  },
  {
    label: "Carousel & Gallery",
    description:
      "Use ImageCarousel for sequential slides and GalleryGrid when buyers need an inspectable lightbox matrix.",
  },
  {
    label: "File, Embed & Code",
    description:
      "Use FilePreviewCard for downloadable artifacts, EmbedCard for reference links, and CodeSnippet for line-numbered examples.",
  },
];

const sampleTracks = [
  {
    title: "Modular Grid Studies",
    artist: "Nadia Okafor",
    album: "Studio Sessions 04",
    durationSeconds: 214,
  },
  {
    title: "Harmonic Interval",
    artist: "Tomas Lind",
    album: "Draft Recordings",
    durationSeconds: 186,
  },
];

const sampleSlides = [
  { src: "slide-01", alt: "Grid System & Baseline Proportion Spec" },
  { src: "slide-02", alt: "Monochrome Surface Token Matrix" },
  { src: "slide-03", alt: "Responsive Breakpoint Verification" },
];

const galleryItems = [
  { title: "Typography Baseline Grid", subtitle: "12-column spec · SVG" },
  { title: "Adaptive Viewport Frame", subtitle: "Mobile 375px chassis" },
  { title: "Elevation Token Map", subtitle: "Light & Dark polarity" },
  { title: "Keyboard Roving Focus", subtitle: "ARIA toolbar sequence" },
];

const sampleCode = `import { MusicPlayer } from "nexoreui"

export function TrackCard() {
  return (
    <MusicPlayer
      title="Modular Grid Studies"
      artist="Nadia Okafor"
      album="Studio Sessions 04"
    />
  )
}`;

const testimonialsData = [
  {
    quote:
      "Every media primitive ships keyboard accessible out of the box, with deterministic waveforms that never flicker during hydration.",
    author: "Mina Kato",
    role: "Staff Frontend Engineer",
  },
  {
    quote:
      "Replacing custom third-party lightbox and slider dependencies with unified token components trimmed our client bundle immediately.",
    author: "David Kim",
    role: "Design Systems Lead",
  },
];

const musicPlayerCode = `import { MusicPlayer } from "nexoreui";

const tracks = [
  { title: "Modular Grid Studies", artist: "Nadia Okafor", album: "Studio Sessions 04", durationSeconds: 214 },
  { title: "Harmonic Interval", artist: "Tomas Lind", album: "Draft Recordings", durationSeconds: 186 },
];

export default function AudioTransportDemo() {
  return (
    <div className="flex justify-center w-full">
      <MusicPlayer
        title="Modular Grid Studies"
        artist="Nadia Okafor"
        album="Studio Sessions 04"
        tracks={tracks}
      />
    </div>
  );
}`;

const waveformCode = `import { useState } from "react";
import { AudioWaveform } from "nexoreui";

export default function SeekableWaveformDemo() {
  const [progress, setProgress] = useState(42);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground hover:bg-muted cursor-pointer"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <span className="font-mono text-muted-foreground tabular-nums">
          {Math.round(progress)}% elapsed
        </span>
      </div>
      <AudioWaveform
        playing={playing}
        bars={40}
        progress={progress}
        onSeek={setProgress}
      />
    </div>
  );
}`;

const videoPlayerCode = `import { VideoPlayer } from "nexoreui";

export default function StudioVideoDemo() {
  return (
    <div className="flex justify-center w-full">
      <VideoPlayer title="Component Architecture Walkthrough" duration="3:45" />
    </div>
  );
}`;

const imageCompareCode = `import { ImageCompare } from "nexoreui";

export default function VisualDiffDemo() {
  return (
    <div className="flex justify-center w-full">
      <ImageCompare leftLabel="Wireframe" rightLabel="Rendered" />
    </div>
  );
}`;

const carouselCode = `import { ImageCarousel } from "nexoreui";

const slides = [
  { src: "slide-01", alt: "Grid System & Baseline Proportion Spec" },
  { src: "slide-02", alt: "Monochrome Surface Token Matrix" },
  { src: "slide-03", alt: "Responsive Breakpoint Verification" },
];

export default function CarouselDemo() {
  return (
    <div className="flex justify-center w-full">
      <ImageCarousel images={slides} />
    </div>
  );
}`;

const galleryCode = `import { GalleryGrid } from "nexoreui";

const items = [
  { title: "Typography Baseline Grid", subtitle: "12-column spec · SVG" },
  { title: "Adaptive Viewport Frame", subtitle: "Mobile 375px chassis" },
  { title: "Elevation Token Map", subtitle: "Light & Dark polarity" },
  { title: "Keyboard Roving Focus", subtitle: "ARIA toolbar sequence" },
];

export default function LightboxGalleryDemo() {
  return <GalleryGrid items={items} />;
}`;

const attachmentsCode = `import { EmbedCard, FilePreviewCard } from "nexoreui";

export default function MediaAttachmentsDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start">
      <div className="space-y-3">
        <FilePreviewCard name="design-tokens-v2.pdf" size="2.4 MB" type="pdf" />
        <FilePreviewCard name="telemetry-schema.ts" size="18 KB" type="code" />
      </div>
      <EmbedCard
        domain="nexoreui.dev"
        title="Semantic Token Architecture Guide"
        description="Structured rules for surface polarity, tabular metrics, and reduced motion accessibility."
        href="https://nexoreui.dev/docs"
      />
    </div>
  );
}`;

const snippetAndQuotesCode = `import { CodeSnippet, TestimonialCarousel } from "nexoreui";

const codeSample = \`import { MusicPlayer } from "nexoreui"

export function TrackCard() {
  return (
    <MusicPlayer
      title="Modular Grid Studies"
      artist="Nadia Okafor"
      album="Studio Sessions 04"
    />
  )
}\`;

const quotes = [
  {
    quote: "Every media primitive ships keyboard accessible out of the box, with deterministic waveforms that never flicker during hydration.",
    author: "Mina Kato",
    role: "Staff Frontend Engineer",
  },
  {
    quote: "Replacing custom third-party lightbox and slider dependencies with unified token components trimmed our client bundle immediately.",
    author: "David Kim",
    role: "Design Systems Lead",
  },
];

export default function CodeAndQuotesDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
      <CodeSnippet code={codeSample} language="tsx" filename="track-card.tsx" />
      <TestimonialCarousel testimonials={quotes} />
    </div>
  );
}`;

export function PremiumMediaSection() {
  const [activeTab, setActiveTab] = useState<
    "audio" | "waveform" | "video" | "compare"
  >("audio");
  const [waveProgress, setWaveProgress] = useState(42);
  const [wavePlaying, setWavePlaying] = useState(false);

  const playgroundCodeMap = {
    audio: musicPlayerCode,
    waveform: waveformCode,
    video: videoPlayerCode,
    compare: imageCompareCode,
  };

  return (
    <section id="premium-media" className="space-y-12 scroll-mt-20">
      <WhenToUse items={whenToUseItems} />

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Interactive Media Playground
          </h2>
          <p className="text-sm text-muted-foreground">
            Test keyboard-scrubbable audio waveforms, video transport controls, and drag-split visual comparisons.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background p-1">
              {(
                [
                  { id: "audio", label: "Music Player" },
                  { id: "waveform", label: "Audio Waveform" },
                  { id: "video", label: "Video Player" },
                  { id: "compare", label: "Image Compare" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              Interactive stage
            </span>
          </div>

          <div
            data-demo-preview
            className="flex min-h-[320px] items-center justify-center bg-background p-5 sm:p-8"
          >
            {activeTab === "audio" && (
              <MusicPlayer
                title="Modular Grid Studies"
                artist="Nadia Okafor"
                album="Studio Sessions 04"
                tracks={sampleTracks}
              />
            )}
            {activeTab === "waveform" && (
              <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setWavePlaying((p) => !p)}
                    className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    {wavePlaying ? "Pause" : "Play"}
                  </button>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {Math.round(waveProgress)}% elapsed
                  </span>
                </div>
                <AudioWaveform
                  playing={wavePlaying}
                  bars={40}
                  progress={waveProgress}
                  onSeek={setWaveProgress}
                />
              </div>
            )}
            {activeTab === "video" && (
              <VideoPlayer
                title="Component Architecture Walkthrough"
                duration="3:45"
              />
            )}
            {activeTab === "compare" && (
              <ImageCompare leftLabel="Wireframe" rightLabel="Rendered" />
            )}
          </div>
        </div>

        <ComponentSource
          sourceCode={playgroundCodeMap[activeTab]}
          fileName={`media-${activeTab}.tsx`}
        />
      </div>

      <div className="space-y-10">
        <ComponentCard
          title="Audio Transport & Multi-Track Queue"
          description="MusicPlayer includes live ticking playback timers, multi-track navigation, speed toggles (1x-2x), and a scrubbable waveform."
          code={musicPlayerCode}
        >
          <div className="flex justify-center w-full">
            <MusicPlayer
              title="Modular Grid Studies"
              artist="Nadia Okafor"
              album="Studio Sessions 04"
              tracks={sampleTracks}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Deterministic Seekable Waveform"
          description="AudioWaveform computes deterministic bar heights across SSR and client hydration with full keyboard slider support."
          code={waveformCode}
        >
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setWavePlaying((p) => !p)}
                className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground hover:bg-muted cursor-pointer"
              >
                {wavePlaying ? "Pause" : "Play"}
              </button>
              <span className="font-mono text-muted-foreground tabular-nums">
                {Math.round(waveProgress)}% elapsed
              </span>
            </div>
            <AudioWaveform
              playing={wavePlaying}
              bars={40}
              progress={waveProgress}
              onSeek={setWaveProgress}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Studio Video Transport"
          description="VideoPlayer wraps native HTML5 video when src is provided or renders a clean frame timeline with mute, rate, and fullscreen actions."
          code={videoPlayerCode}
        >
          <div className="flex justify-center w-full">
            <VideoPlayer title="Component Architecture Walkthrough" duration="3:45" />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Before / After Comparison"
          description="Pointer-captured drag slider and ArrowLeft/ArrowRight keyboard control for comparing two renders or design states."
          code={imageCompareCode}
        >
          <div className="flex justify-center w-full">
            <ImageCompare leftLabel="Wireframe" rightLabel="Rendered" />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Slide Carousel"
          description="ImageCarousel tracks progress with an aligned 01 / 0N counter, hover pause, and left/right keyboard controls."
          code={carouselCode}
        >
          <div className="flex justify-center w-full">
            <ImageCarousel images={sampleSlides} />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Asymmetric Lightbox Gallery"
          description="GalleryGrid spans featured tiles automatically and opens a keyboard-navigable lightbox modal on selection."
          code={galleryCode}
        >
          <GalleryGrid items={galleryItems} />
        </ComponentCard>

        <ComponentCard
          title="File Attachments & Link Embeds"
          description="FilePreviewCard and EmbedCard present downloadable artifacts and external references using crisp semantic borders."
          code={attachmentsCode}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start">
            <div className="space-y-3">
              <FilePreviewCard
                name="design-tokens-v2.pdf"
                size="2.4 MB"
                type="pdf"
              />
              <FilePreviewCard
                name="telemetry-schema.ts"
                size="18 KB"
                type="code"
              />
            </div>
            <EmbedCard
              domain="nexoreui.dev"
              title="Semantic Token Architecture Guide"
              description="Structured rules for surface polarity, tabular metrics, and reduced motion accessibility."
              href="https://nexoreui.dev/docs"
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Code Snippet & Quote Switcher"
          description="CodeSnippet uses a structured header with line numbers (zero macOS window chrome) beside TestimonialCarousel."
          code={snippetAndQuotesCode}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
            <CodeSnippet code={sampleCode} language="tsx" filename="track-card.tsx" />
            <TestimonialCarousel testimonials={testimonialsData} />
          </div>
        </ComponentCard>
      </div>

      <div className="space-y-4">
        <A11yHeader title="Accessibility & Keyboard Transport" />
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground rounded-xl border border-border bg-card p-5">
          <li>
            <strong className="text-foreground">ARIA sliders:</strong> AudioWaveform, VideoPlayer timeline, and ImageCompare expose role=&quot;slider&quot; with ArrowLeft, ArrowRight, Home, and End keyboard control.
          </li>
          <li>
            <strong className="text-foreground">Lightbox dialog:</strong> GalleryGrid manages Escape closing and left/right keyboard cycling when open.
          </li>
          <li>
            <strong className="text-foreground">SSR determinism:</strong> Waveforms derive bar heights mathematically with zero Math.random() calls during render.
          </li>
        </ul>
      </div>

      <PropsTable
        propsData={[
          {
            name: "playing",
            type: "boolean",
            defaultValue: "false",
            description: "Animates active waveform bars in AudioWaveform when reduced motion is off.",
          },
          {
            name: "progress / onSeek",
            type: "number / (pct: number) => void",
            description: "Controlled playback percentage (0-100) and scrub callback for AudioWaveform.",
          },
          {
            name: "tracks",
            type: "MusicPlayerTrack[]",
            description: "Optional playlist queue enabling multi-track Prev/Next navigation in MusicPlayer.",
          },
          {
            name: "src / duration",
            type: "string",
            description: "Media file URL and formatted MM:SS clock string for VideoPlayer.",
          },
          {
            name: "leftLabel / rightLabel",
            type: "string",
            defaultValue: '"Before" / "After"',
            description: "Corner labels shown inside ImageCompare.",
          },
          {
            name: "items (GalleryGrid)",
            type: "{ title: string; subtitle?: string; src?: string }[]",
            description: "Grid tiles opening the built-in keyboard-navigable lightbox modal.",
          },
          {
            name: "code / filename",
            type: "string",
            description: "Source string and header filename rendered by CodeSnippet.",
          },
        ]}
      />
    </section>
  );
}

export default PremiumMediaSection;
