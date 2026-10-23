"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  AudioWaveform,
  FilePreviewCard,
  MusicPlayer,
  CodeSnippet,
} from "nexoreui";

export function PremiumMediaSection() {
  return (
    <SuiteSectionLayout
      id="premium-media"
      title="Media Showcase"
      badge="Rich Media & Players"
      description="Interactive audio visualizers, file attachments, and media players with playback telemetry and neutral zinc surfaces."
      cliCommand="npx nexoreui add premium-media"
      items={[
        {
          name: "Audio Waveform Visualizer",
          description: "Canvas-like frequency spectrum bars displaying active audio playback states.",
          component: (
            <div className="w-full max-w-sm p-4">
              <AudioWaveform playing={true} bars={24} />
            </div>
          ),
          code: `import { AudioWaveform } from "nexoreui"

<AudioWaveform playing={true} bars={24} />`,
          propsData: [
            { name: "playing", type: "boolean", defaultValue: "false", description: "Whether bars animate in active state.", required: false },
            { name: "bars", type: "number", defaultValue: "24", description: "Total number of frequency bars rendered.", required: false }
          ]
        },
        {
          name: "Embedded Music & Podcast Player",
          description: "Compact playback deck with scrubbing timeline, track metadata, and rotating vinyl disc.",
          component: (
            <div className="w-full max-w-md">
              <MusicPlayer
                title="System Core Architecture"
                artist="Nexore Engineering Podcast"
                album="Engineering Series Vol. 1"
              />
            </div>
          ),
          code: `import { MusicPlayer } from "nexoreui"

<MusicPlayer
  title="System Core Architecture"
  artist="Nexore Engineering Podcast"
  album="Engineering Series Vol. 1"
/>`
        },
        {
          name: "File Attachment Preview Card",
          description: "Metadata card for documents, archives, and media uploads with download trigger.",
          component: (
            <div className="w-full max-w-sm">
              <FilePreviewCard
                name="architecture_spec_v2.pdf"
                size="4.2 MB"
                type="pdf"
              />
            </div>
          ),
          code: `import { FilePreviewCard } from "nexoreui"

<FilePreviewCard
  name="architecture_spec_v2.pdf"
  size="4.2 MB"
  type="pdf"
/>`
        },
        {
          name: "Interactive Code Snippet Card",
          description: "Syntax card with line numbers, language tag, and 1-click clipboard integration.",
          component: (
            <div className="w-full max-w-md">
              <CodeSnippet
                code={`import { defineConfig } from "vite";\nexport default defineConfig({\n  plugins: [react()],\n});`}
                language="typescript"
              />
            </div>
          ),
          code: `import { CodeSnippet } from "nexoreui"

<CodeSnippet
  code="const app = express();"
  language="typescript"
/>`
        }
      ]}
      a11yNotes={[
        "Audio Accessibility: Controls provide aria-label attributes for Play, Pause, Mute, and Scrubber interactions.",
        "Keyboard Support: Scrubbers support Arrow Left/Right key adjustments."
      ]}
    />
  );
}
