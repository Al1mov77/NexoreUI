"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export function DarkModeSection() {
  const [playTheme, setPlayTheme] = useState<ThemeMode>("dark");
  const [playVariant, setPlayVariant] = useState<"pill" | "icon" | "segmented" | "card">("pill");
  const [playSize, setPlaySize] = useState<"sm" | "md" | "lg">("md");
  const [playShowLabel, setPlayShowLabel] = useState<boolean>(true);

  const generateLiveCode = () => {
    const props: string[] = [];
    if (playVariant !== "pill") props.push(`variant="${playVariant}"`);
    if (playSize !== "md" && (playVariant === "pill" || playVariant === "icon")) {
      props.push(`size="${playSize}"`);
    }
    if (playShowLabel && (playVariant === "pill" || playVariant === "segmented")) {
      props.push("showLabel");
    }
    props.push(`theme="${playTheme}"`);
    props.push("onChange={setTheme}");

    return `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeMode>("${playTheme}");

  return (
    <DarkModeToggle
      ${props.join("\n      ")}
    />
  );
}`;
  };

  const propsData = [
    {
      name: "theme",
      type: '"light" | "dark" | "system"',
      defaultValue: "uncontrolled",
      description: "Controlled theme mode. When omitted, persists to localStorage and syncs with matchMedia.",
      required: false,
    },
    {
      name: "variant",
      type: '"pill" | "icon" | "segmented" | "card"',
      defaultValue: '"pill"',
      description: "Visual presentation style for the switcher.",
      required: false,
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "Control size for pill and icon variants.",
      required: false,
    },
    {
      name: "showLabel",
      type: "boolean",
      defaultValue: "false",
      description: "Displays text label alongside pill or segmented controls.",
      required: false,
    },
    {
      name: "storageKey",
      type: "string",
      defaultValue: '"nexore-theme"',
      description: "localStorage key used in uncontrolled mode.",
      required: false,
    },
    {
      name: "onChange",
      type: '(theme: "light" | "dark" | "system") => void',
      defaultValue: "-",
      description: "Callback invoked when the user switches theme.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "Pill Switch",
      component: (
        <DarkModeToggle
          variant="pill"
          size="md"
          showLabel
          theme={playTheme}
          onChange={setPlayTheme}
        />
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function PillThemeDemo() {
  return <DarkModeToggle variant="pill" size="md" showLabel />;
}`,
    },
    {
      name: "Segmented Light / Dark / System",
      component: (
        <DarkModeToggle
          variant="segmented"
          showLabel
          theme={playTheme}
          onChange={setPlayTheme}
        />
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function SegmentedThemeDemo() {
  return <DarkModeToggle variant="segmented" showLabel />;
}`,
    },
    {
      name: "Icon Buttons (sm / md / lg)",
      component: (
        <div className="flex items-center gap-3">
          <DarkModeToggle variant="icon" size="sm" theme={playTheme} onChange={setPlayTheme} />
          <DarkModeToggle variant="icon" size="md" theme={playTheme} onChange={setPlayTheme} />
          <DarkModeToggle variant="icon" size="lg" theme={playTheme} onChange={setPlayTheme} />
        </div>
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function IconThemeDemo() {
  return <DarkModeToggle variant="icon" size="md" />;
}`,
    },
    {
      name: "Card Selector",
      component: (
        <DarkModeToggle
          variant="card"
          theme={playTheme}
          onChange={setPlayTheme}
        />
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function CardThemeDemo() {
  return <DarkModeToggle variant="card" />;
}`,
    },
  ];

  return (
    <section id="dark-mode" className="space-y-12 scroll-mt-20">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Interactive Playground
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div
            data-demo-preview
            className="xl:col-span-2 min-h-[260px] flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card gap-4"
          >
            <DarkModeToggle
              theme={playTheme}
              variant={playVariant}
              size={playSize}
              showLabel={playShowLabel}
              onChange={setPlayTheme}
            />
            <p className="text-xs text-muted-foreground font-mono">
              Selected mode: <span className="text-foreground font-semibold">{playTheme}</span>
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Theme State</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPlayTheme(t)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-colors cursor-pointer ${
                      playTheme === t
                        ? "bg-primary text-primary-foreground font-semibold border-primary"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Variant</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["pill", "icon", "segmented", "card"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPlayVariant(v)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-colors cursor-pointer ${
                      playVariant === v
                        ? "bg-primary text-primary-foreground font-semibold border-primary"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {(playVariant === "pill" || playVariant === "icon") && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Size</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPlaySize(s)}
                      className={`py-1.5 px-2 text-xs rounded-lg border uppercase font-mono transition-colors cursor-pointer ${
                        playSize === s
                          ? "bg-primary text-primary-foreground font-semibold border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(playVariant === "pill" || playVariant === "segmented") && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-foreground">Show Label</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={playShowLabel}
                  aria-label="Toggle text label"
                  onClick={() => setPlayShowLabel(!playShowLabel)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border ${
                    playShowLabel ? "bg-foreground border-foreground" : "bg-muted border-border"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-transform absolute top-0.5 ${
                      playShowLabel ? "translate-x-4.5 bg-background" : "translate-x-0.5 bg-foreground"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        <ComponentSource sourceCode={generateLiveCode()} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Variants</h2>
        <div className="space-y-10">
          {examples.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div
                  data-demo-preview
                  className="min-h-[160px] flex items-center justify-center p-6 rounded-xl border border-border bg-card"
                >
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DarkModeSection;
