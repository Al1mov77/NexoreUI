import { interpolateText, selectSectionSentences } from "./copy-bank";
import { selectTestBakeryCopy } from "./niches/test-bakery";
import { ScoredAsset, SynthesizedLandingPayload, SynthesizedSectionSpec } from "./schema";

export const AI_EDITOR_INSTRUCTION =
  "This is a landing page. Edit only the content and theme objects unless asked otherwise.";

export interface ExportFileEntry {
  path: string;
  content: string;
}

export interface ExportAssetMapping {
  sourcePublicUrl: string;
  zipPath: string;
  relativeRef: string;
  role: string;
}

export interface ExportBundle {
  pageTsx: string;
  reactTsx: string;
  nextjsPageTsx: string;
  copyForAiEditor: string;
  aiInstruction: string;
  lineCount: number;
  files: ExportFileEntry[];
  assetMappings: ExportAssetMapping[];
  dependencies: ReadonlyArray<{ name: string; version: string; reason: string }>;
}

export function stripCodeCommentsAst(code: string): string {
  let result = "";
  let i = 0;
  const len = code.length;

  while (i < len) {
    const ch = code[i];
    const next = i + 1 < len ? code[i + 1] : "";

    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      result += ch;
      i += 1;
      while (i < len) {
        const c = code[i];
        result += c;
        if (c === "\\" && i + 1 < len) {
          i += 1;
          result += code[i];
        } else if (c === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (
      ch === "{" &&
      next === "/" &&
      i + 2 < len &&
      code[i + 2] === "*"
    ) {
      i += 3;
      while (i < len) {
        if (
          code[i] === "*" &&
          i + 2 < len &&
          code[i + 1] === "/" &&
          code[i + 2] === "}"
        ) {
          i += 3;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      i += 2;
      while (i < len && code[i] !== "\n") {
        i += 1;
      }
      continue;
    }

    if (ch === "/" && next === "*") {
      i += 2;
      while (i < len) {
        if (code[i] === "*" && i + 1 < len && code[i + 1] === "/") {
          i += 2;
          break;
        }
        i += 1;
      }
      continue;
    }

    result += ch;
    i += 1;
  }

  return result
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .concat("\n");
}

function pickMediaUrl(scored: ScoredAsset): string {
  return scored.asset.mediaType === "video"
    ? scored.asset.video?.posterUrl || scored.asset.url
    : scored.asset.url;
}

function collectExportAssets(payload: SynthesizedLandingPayload): {
  assetMappings: ExportAssetMapping[];
  toRel: (url: string) => string;
} {
  const { config, heroAsset, featureAssets, sections } = payload;
  const isBakery = config.niche === "test-bakery";
  const heroMediaUrl = pickMediaUrl(heroAsset);

  const candidates: Array<{ url: string; id: string; role: string }> = [
    { url: heroMediaUrl, id: heroAsset.asset.id, role: "Hero visual" },
  ];

  if (sections.some((s) => s.kind === "section-orbit-360") && !isBakery) {
    payload.orbitPack.frames.forEach((f, idx) =>
      candidates.push({ url: f.url, id: `orbit-${idx}`, role: `Orbit ${f.angle} deg` })
    );
  }
  if (sections.some((s) => s.kind === "section-state-morph") && !isBakery) {
    candidates.push(
      { url: payload.morphPack.stateAFrontUrl, id: "morph-a", role: "Mode A plate" },
      { url: payload.morphPack.stateBFrontUrl, id: "morph-b", role: "Mode B plate" },
      { url: payload.morphPack.stateBRearUrl, id: "morph-b-rear", role: "Mode B rear" }
    );
  }
  if (sections.some((s) => s.kind === "section-cockpit-pov") && !isBakery) {
    candidates.push({ url: payload.cockpitPack.mainPovUrl, id: "cockpit-pov", role: "Cabin layout" });
    payload.cockpitPack.hotspots.forEach((h, idx) =>
      candidates.push({ url: h.detailAssetUrl, id: h.id, role: `Cabin station ${idx + 1}` })
    );
  }
  if (sections.some((s) => s.kind === "section-editorial-timeline")) {
    payload.timelineChapters.forEach((ch) =>
      candidates.push({
        url: pickMediaUrl(ch.asset),
        id: ch.asset.asset.id,
        role: `Chapter ${ch.index}`,
      })
    );
  }

  sections.forEach((sec) => {
    sec.primaryAssets.slice(0, 5).forEach((s, idx) =>
      candidates.push({
        url: pickMediaUrl(s),
        id: s.asset.id,
        role: `${sec.code} visual ${idx + 1}`,
      })
    );
  });

  featureAssets.slice(0, 4).forEach((s, idx) =>
    candidates.push({ url: pickMediaUrl(s), id: s.asset.id, role: `Gallery photo ${idx + 1}` })
  );

  const assetMappings: ExportAssetMapping[] = [];
  const seenUrls = new Set<string>();
  for (const item of candidates) {
    if (seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    const baseName = item.url.split("/").pop() || `${item.id}.jpg`;
    assetMappings.push({
      sourcePublicUrl: item.url,
      zipPath: `assets/${baseName}`,
      relativeRef: `./assets/${baseName}`,
      role: item.role,
    });
  }

  const toRel = (publicUrl: string): string => {
    const found = assetMappings.find((m) => m.sourcePublicUrl === publicUrl);
    return found ? found.relativeRef : publicUrl;
  };

  return { assetMappings, toRel };
}

function renderHeroSnippet(
  heroVariant: string,
  padSection: string,
  firstHref: string
): string {
  const isFullBleedHero =
    heroVariant === "fullbleed-left-slab" ||
    heroVariant === "cockpit-first-immersion";
  const isWideStackedHero =
    heroVariant === "monograph-chapter-index" ||
    heroVariant === "interactive-orbit-stage" ||
    heroVariant === "overhead-aero-windtunnel" ||
    heroVariant === "panoramic-gallery-salon";

  if (isFullBleedHero) {
    return `      <section id="overview" style={{ borderColor: theme.border }} className="relative border-b min-h-[520px] flex items-center px-6 sm:px-10 py-16">
        <img src={content.heroImage} alt={content.heroTitle} style={{ objectPosition: content.heroPos }} className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div style={{ ...card, borderColor: theme.border }} className="border p-8 sm:p-10 max-w-xl space-y-5">
            <span style={{ color: theme.accent }} className="text-xs uppercase tracking-wider font-medium block">{content.heroBadge}</span>
            <h1 style={{ fontFamily: theme.displayFont }} className="text-4xl sm:text-5xl font-semibold tracking-tight leading-none">{content.heroTitle}</h1>
            <p style={{ color: theme.muted }} className="text-base leading-relaxed">{content.heroSub}</p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a href="#cta" style={btn} className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.cta}</a>
              <a href=${JSON.stringify(firstHref)} style={card} className="border px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.secondaryCta}</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  if (isWideStackedHero) {
    return `      <section id="overview" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-4">
            <span style={{ color: theme.accent }} className="text-xs uppercase tracking-wider font-medium block">{content.heroBadge}</span>
            <h1 style={{ fontFamily: theme.displayFont }} className="text-4xl sm:text-6xl font-semibold tracking-tight leading-none">{content.heroTitle}</h1>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <p style={{ color: theme.muted }} className="text-base leading-relaxed">{content.heroSub}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#cta" style={btn} className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.cta}</a>
              <a href=${JSON.stringify(firstHref)} style={card} className="border px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.secondaryCta}</a>
            </div>
          </div>
        </div>
        <div style={card} className="border aspect-[21/9] min-h-[280px] overflow-hidden"><img src={content.heroImage} alt={content.heroTitle} style={{ objectPosition: content.heroPos }} className="h-full w-full object-cover" /></div>
      </section>`;
  }

  return `      <section id="overview" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto grid gap-10 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span style={{ color: theme.accent }} className="text-xs uppercase tracking-wider font-medium block">{content.heroBadge}</span>
          <h1 style={{ fontFamily: theme.displayFont }} className="text-4xl sm:text-5xl font-semibold tracking-tight leading-none">{content.heroTitle}</h1>
          <p style={{ color: theme.muted }} className="text-base leading-relaxed max-w-xl">{content.heroSub}</p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a href="#cta" style={btn} className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.cta}</a>
            <a href=${JSON.stringify(firstHref)} style={card} className="border px-6 py-3 text-xs font-semibold uppercase tracking-wider">{content.secondaryCta}</a>
          </div>
          <div style={{ borderColor: theme.border }} className="grid grid-cols-2 gap-6 border-t pt-5">{content.heroMetrics.map((m) => (<div key={m.label}><div style={{ fontFamily: theme.monoFont }} className="text-xl font-semibold tabular-nums">{m.val}</div><div style={{ color: theme.muted }} className="text-xs">{m.label}</div></div>))}</div>
        </div>
        <div style={card} className="lg:col-span-6 border aspect-[16/10] overflow-hidden"><img src={content.heroImage} alt={content.heroTitle} style={{ objectPosition: content.heroPos }} className="h-full w-full object-cover" /></div>
      </section>`;
}

function renderBlueprintSectionSnippet(
  sec: SynthesizedSectionSpec,
  idx: number,
  padSection: string,
  hasUnitToggle: boolean
): string {
  const meta = `content.sections[${idx}]`;
  switch (sec.kind) {
    case "section-orbit-360":
      return `      <section id="section-orbit-360" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div style={card} className="border overflow-hidden">
          <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden"><img src={content.orbit[orbitIdx % content.orbit.length].image} alt={content.orbit[orbitIdx % content.orbit.length].tag} className="h-full w-full object-cover" /></div>
          <div style={{ borderColor: theme.border }} className="border-t p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">{content.orbit.map((f, i) => (<button key={f.tag} type="button" onClick={() => setOrbitIdx(i)} style={i === orbitIdx % content.orbit.length ? btn : card} className="border px-3 py-1.5 text-xs font-mono cursor-pointer">{f.tag}</button>))}</div>
            <p style={{ color: theme.muted }} className="text-xs max-w-md">{content.orbit[orbitIdx % content.orbit.length].readout} · {content.orbit[orbitIdx % content.orbit.length].note}</p>
          </div>
        </div>
      </section>`;
    case "section-state-morph":
      return `      <section id="section-state-morph" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
          <div className="flex gap-2">{content.morph.map((m, i) => (<button key={m.code} type="button" onClick={() => setMorphIdx(i)} style={i === morphIdx % content.morph.length ? btn : card} className="border px-4 py-2 text-xs font-semibold cursor-pointer">{m.code}</button>))}</div>
        </div>
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div style={card} className="lg:col-span-7 border overflow-hidden aspect-[16/10]"><img src={content.morph[morphIdx % content.morph.length].image} alt={content.morph[morphIdx % content.morph.length].title} className="h-full w-full object-cover" /></div>
          <div style={card} className="lg:col-span-5 border p-6 space-y-4">
            <h3 style={{ fontFamily: theme.displayFont }} className="text-xl font-semibold">{content.morph[morphIdx % content.morph.length].title}</h3>
            <p style={{ color: theme.muted }} className="text-sm">{content.morph[morphIdx % content.morph.length].desc}</p>
            <div style={{ borderColor: theme.border }} className="border-t divide-y">{content.morph[morphIdx % content.morph.length].rows.map((r) => (<div key={r.label} style={{ borderColor: theme.border }} className="py-2.5 flex justify-between text-sm"><span style={{ color: theme.muted }}>{r.label}</span><span style={{ fontFamily: theme.monoFont }} className="font-semibold tabular-nums">{r.val}</span></div>))}</div>
          </div>
        </div>
      </section>`;
    case "section-cockpit-pov":
      return `      <section id="section-cockpit-pov" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 space-y-4">
            <div style={card} className="border overflow-hidden aspect-[16/10]"><img src={content.cockpit[cabinIdx % content.cockpit.length].image} alt={content.cockpit[cabinIdx % content.cockpit.length].title} className="h-full w-full object-cover" /></div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">{content.cockpit.map((h, i) => (<button key={h.code} type="button" onClick={() => setCabinIdx(i)} style={i === cabinIdx % content.cockpit.length ? btn : card} className="border px-3 py-2 text-xs text-left cursor-pointer truncate">{h.label}</button>))}</div>
          </div>
          <div style={card} className="lg:col-span-5 border p-6 flex flex-col justify-between space-y-4">
            <span style={{ fontFamily: theme.monoFont, color: theme.muted }} className="text-xs">{content.cockpit[cabinIdx % content.cockpit.length].code}</span>
            <h3 style={{ fontFamily: theme.displayFont }} className="text-xl font-semibold">{content.cockpit[cabinIdx % content.cockpit.length].title}</h3>
            <p style={{ color: theme.muted }} className="text-sm leading-relaxed">{content.cockpit[cabinIdx % content.cockpit.length].note}</p>
          </div>
        </div>
      </section>`;
    case "section-asymmetric-dossier":
      return `      <section id="section-asymmetric-dossier" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-6">{content.gallery.map((item, i) => (<article key={item.title} style={card} className={(i === 0 || i === 3 ? "lg:col-span-7" : "lg:col-span-5") + " border overflow-hidden"}><div className="aspect-[16/10] overflow-hidden"><img src={item.image} alt={item.title} className="h-full w-full object-cover" /></div><div className="p-5 space-y-1"><h3 style={{ fontFamily: theme.displayFont }} className="text-base font-semibold">{item.title}</h3><p style={{ color: theme.muted }} className="text-xs">{item.caption}</p></div></article>))}</div>
      </section>`;
    case "section-editorial-timeline":
      return `      <section id="section-editorial-timeline" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div style={{ borderColor: theme.border }} className="lg:col-span-5 border-t divide-y">{content.timeline.map((c, i) => (<button key={c.index} type="button" onClick={() => setChapterIdx(i)} style={{ borderColor: theme.border }} className="w-full py-4 text-left space-y-1 cursor-pointer"><div className="flex gap-3 items-baseline"><span style={{ fontFamily: theme.monoFont, color: i === chapterIdx % content.timeline.length ? theme.accent : theme.muted }} className="text-xs">{c.index}</span><span style={{ fontFamily: theme.displayFont }} className="text-base font-semibold">{c.title}</span></div><p style={{ color: theme.muted }} className="text-xs">{c.body}</p></button>))}</div>
          <div style={card} className="lg:col-span-7 border overflow-hidden"><div className="aspect-[16/10] overflow-hidden"><img src={content.timeline[chapterIdx % content.timeline.length].image} alt={content.timeline[chapterIdx % content.timeline.length].title} className="h-full w-full object-cover" /></div><div style={{ borderColor: theme.border }} className="border-t p-4 flex justify-between text-xs"><span>{content.timeline[chapterIdx % content.timeline.length].title}</span><span style={{ fontFamily: theme.monoFont, color: theme.muted }}>{content.timeline[chapterIdx % content.timeline.length].phase}</span></div></div>
        </div>
      </section>`;
    case "section-horizontal-strip":
      return `      <section id="section-horizontal-strip" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3">{content.strip.map((item) => (<article key={item.code + item.title} style={card} className="min-w-[280px] sm:min-w-[330px] snap-start border overflow-hidden shrink-0"><div className="aspect-[16/10] overflow-hidden"><img src={item.image} alt={item.title} className="h-full w-full object-cover" /></div><div className="p-5 space-y-1.5"><div className="flex justify-between text-xs" style={{ fontFamily: theme.monoFont }}><span style={{ color: theme.muted }}>{item.code}</span><span>{item.val}</span></div><h3 style={{ fontFamily: theme.displayFont }} className="text-base font-semibold">{item.title}</h3><p style={{ color: theme.muted }} className="text-xs">{item.note}</p></div></article>))}</div>
      </section>`;
    case "section-spec-ledger":
      return `      <section id="section-spec-ledger" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
          ${hasUnitToggle ? `<div className="flex gap-2">{(["Metric", "Imperial"] as const).map((u) => (<button key={u} type="button" onClick={() => setImperial(u === "Imperial")} style={(imperial ? u === "Imperial" : u === "Metric") ? btn : card} className="border px-3 py-1.5 text-xs cursor-pointer">{u}</button>))}</div>` : ""}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{content.specs.map((s) => (<div key={s.label} style={card} className="border p-6 space-y-2"><span style={{ color: theme.muted }} className="text-xs uppercase">{s.label}</span><p style={{ fontFamily: theme.monoFont }} className="text-2xl sm:text-3xl font-semibold tabular-nums">{formatSpec(s)}</p><span style={{ color: theme.muted }} className="text-xs block">{s.note}</span></div>))}</div>
      </section>`;
    case "section-trim-builder":
      return `      <section id="cta" style={{ borderColor: theme.border }} className="border-b ${padSection} px-6 sm:px-10 max-w-6xl mx-auto space-y-6">
        <div><h2 style={{ fontFamily: theme.displayFont }} className="text-2xl sm:text-3xl font-semibold">{${meta}.title}</h2><p style={{ color: theme.muted }} className="text-sm mt-2">{${meta}.sub}</p></div>
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2"><span style={{ color: theme.muted }} className="text-xs uppercase">{content.builder.groupALabel}</span><div className="grid sm:grid-cols-3 gap-3">{content.builder.groupA.map((g, i) => (<button key={g.label} type="button" onClick={() => { setOptA(i); setBooked(false); }} style={{ ...card, borderColor: i === optA ? theme.accent : theme.border }} className="border p-4 text-left text-sm cursor-pointer"><div className="font-semibold">{g.label}</div><div style={{ color: theme.muted, fontFamily: theme.monoFont }} className="text-xs tabular-nums">{g.delta === 0 ? "Included" : "+$" + g.delta.toLocaleString()}</div></button>))}</div></div>
            <div className="space-y-2"><span style={{ color: theme.muted }} className="text-xs uppercase">{content.builder.groupBLabel}</span><div className="grid sm:grid-cols-3 gap-3">{content.builder.groupB.map((g, i) => (<button key={g.label} type="button" onClick={() => { setOptB(i); setBooked(false); }} style={{ ...card, borderColor: i === optB ? theme.accent : theme.border }} className="border p-4 text-left text-sm cursor-pointer"><div className="font-semibold">{g.label}</div><div style={{ color: theme.muted, fontFamily: theme.monoFont }} className="text-xs tabular-nums">{g.delta === 0 ? "Included" : "+$" + g.delta.toLocaleString()}</div></button>))}</div></div>
          </div>
          <div style={card} className="lg:col-span-5 border p-6 space-y-4">
            <div className="flex justify-between items-baseline border-b pb-4" style={{ borderColor: theme.border }}><span style={{ color: theme.muted }} className="text-xs">{content.city} · {content.builder.chassis}</span><span style={{ fontFamily: theme.monoFont }} className="text-3xl font-semibold tabular-nums">{"$"}{(content.builder.basePrice + content.builder.groupA[optA].delta + content.builder.groupB[optB].delta).toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: theme.muted }}>Option weight delta</span><span style={{ fontFamily: theme.monoFont }}>{content.builder.groupA[optA].kg + content.builder.groupB[optB].kg} kg</span></div>
            {booked ? <div style={card} className="border p-3 text-xs">Specification saved for {content.city} consultation.</div> : <button type="button" onClick={() => setBooked(true)} style={btn} className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer">{content.cta}</button>}
          </div>
        </div>
      </section>`;
  }
}

export function buildExportBundle(
  payload: SynthesizedLandingPayload
): ExportBundle {
  const { config, tokens, heroAsset, featureAssets, validatedMetrics, sections } =
    payload;
  const pal =
    config.themeMode === "light" ? tokens.palette.light : tokens.palette.dark;

  const isBakery = config.niche === "test-bakery";
  const heroMediaUrl = pickMediaUrl(heroAsset);
  const firstHref = sections[0]
    ? `#${sections[0].kind === "section-trim-builder" ? "cta" : sections[0].kind}`
    : "#cta";

  const { assetMappings, toRel } = collectExportAssets(payload);

  const cleanCity =
    (config.location || "Zurich").split(",")[0].split("·")[0].trim() || "Zurich";
  const placeBadge = isBakery
    ? `${cleanCity} Bakehouse`
    : tokens.archetype === "track"
      ? `${cleanCity} Track`
      : tokens.archetype === "editorial"
        ? `${cleanCity} Edition`
        : `${cleanCity} Showroom`;

  const sectionCopy = isBakery
    ? selectTestBakeryCopy(config, tokens.voice)
    : selectSectionSentences(config);
  const ctaTitle = interpolateText(
    isBakery ? "Visit {brandName} in {location}" : "Experience the {modelName} in {location}",
    config
  );

  const hasOrbit = sections.some((s) => s.kind === "section-orbit-360");
  const hasMorph = sections.some((s) => s.kind === "section-state-morph");
  const hasCockpit = sections.some((s) => s.kind === "section-cockpit-pov");
  const hasGallery = sections.some((s) => s.kind === "section-asymmetric-dossier");
  const hasTimeline = sections.some((s) => s.kind === "section-editorial-timeline");
  const hasStrip = sections.some((s) => s.kind === "section-horizontal-strip");
  const hasSpecs = sections.some((s) => s.kind === "section-spec-ledger");
  const hasBuilder = sections.some((s) => s.kind === "section-trim-builder");
  const hasUnitToggle =
    hasSpecs && !isBakery && (tokens.archetype === "track" || tokens.archetype === "showroom");

  const safeAssets = featureAssets.length > 0 ? featureAssets : [heroAsset];
  const specsData = validatedMetrics.slice(0, 4).map((m) => ({
    label: m.label,
    value: m.numericValue,
    unit: m.unit,
    prefix: m.kind === "price" ? "$" : "",
    decimals: m.kind === "acceleration" ? 2 : 0,
    note: m.contextNote,
  }));

  const gallerySource =
    sections.find((s) => s.kind === "section-asymmetric-dossier")?.primaryAssets;
  const galleryPool = gallerySource && gallerySource.length > 0 ? gallerySource : safeAssets;
  const galleryData = galleryPool.slice(0, 4).map((s) => ({
    title: interpolateText(s.asset.titleTemplate, config),
    caption: interpolateText(s.asset.descriptionByVoice[tokens.voice], config),
    image: toRel(pickMediaUrl(s)),
  }));

  const orbitData = isBakery
    ? safeAssets.slice(0, 4).map((s, idx) => ({
        tag: `Plate ${idx + 1}`,
        readout: s.asset.aspectRatio,
        note: interpolateText(s.asset.descriptionByVoice[tokens.voice], config),
        image: toRel(pickMediaUrl(s)),
      }))
    : payload.orbitPack.frames.map((f) => ({
        tag: `${f.angle}°`,
        readout: f.dragCoefficient,
        note: f.telemetryNote,
        image: toRel(f.url),
      }));

  const morphData = isBakery
    ? [
        {
          code: "Morning",
          title: "Morning pastry batch",
          desc: "Fresh laminated croissants and seasonal tarts baked early daily.",
          image: toRel(pickMediaUrl(safeAssets[0])),
          rows: specsData.slice(0, 3).map((r) => ({ label: r.label, val: `${r.value} ${r.unit}`.trim() })),
        },
        {
          code: "Hearth",
          title: "Afternoon country loaves",
          desc: "Long-fermented sourdough boules pulled straight from stone hearth decks.",
          image: toRel(pickMediaUrl(safeAssets[1] || safeAssets[0])),
          rows: specsData.slice(0, 3).map((r) => ({ label: r.label, val: `${r.value} ${r.unit}`.trim() })),
        },
      ]
    : [
        {
          code: payload.morphPack.stateACode,
          title: payload.morphPack.stateALabel,
          desc: payload.morphPack.stateADescription,
          image: toRel(payload.morphPack.stateAFrontUrl),
          rows: payload.morphPack.stateASpecs.map((s) => ({ label: s.label, val: s.displayValue })),
        },
        {
          code: payload.morphPack.stateBCode,
          title: payload.morphPack.stateBLabel,
          desc: payload.morphPack.stateBDescription,
          image: toRel(payload.morphPack.stateBFrontUrl),
          rows: payload.morphPack.stateBSpecs.map((s) => ({ label: s.label, val: s.displayValue })),
        },
      ];

  const cockpitData = isBakery
    ? safeAssets.slice(0, 4).map((s, idx) => ({
        code: `0${idx + 1}`,
        label: `Bench ${idx + 1}`,
        title: interpolateText(s.asset.titleTemplate, config),
        note: interpolateText(s.asset.descriptionByVoice[tokens.voice], config),
        image: toRel(pickMediaUrl(s)),
      }))
    : payload.cockpitPack.hotspots.map((h) => ({
        code: h.partCode,
        label: h.label,
        title: h.headline,
        note: h.description,
        image: toRel(h.detailAssetUrl),
      }));

  const timelinePool =
    payload.timelineChapters.length > 0
      ? payload.timelineChapters
      : safeAssets.slice(0, 3).map((s, idx) => ({
          index: `0${idx + 1}`,
          title: interpolateText(s.asset.titleTemplate, config),
          body: interpolateText(s.asset.descriptionByVoice[tokens.voice], config),
          phaseCode: s.asset.partCode,
          asset: s,
        }));
  const timelineData = timelinePool.map((ch) => ({
    index: ch.index,
    title: ch.title,
    body: ch.body,
    phase: ch.phaseCode,
    image: toRel(pickMediaUrl(ch.asset)),
  }));

  const stripSource =
    sections.find((s) => s.kind === "section-horizontal-strip")?.primaryAssets;
  const stripPool = stripSource && stripSource.length > 0 ? stripSource : safeAssets;
  const stripData = stripPool.slice(0, 5).map((s) => ({
    code: s.asset.partCode,
    title: interpolateText(s.asset.titleTemplate, config),
    val: s.asset.specMetric.displayValue,
    note: interpolateText(s.asset.descriptionByVoice[tokens.voice], config),
    image: toRel(pickMediaUrl(s)),
  }));

  const builderData = isBakery
    ? {
        basePrice: 24,
        chassis: "BAKERY",
        groupALabel: "Box size",
        groupA: [
          { label: "Three-Loaf Box", delta: 0, kg: 0 },
          { label: "Weekend Assortment", delta: 22, kg: 2 },
        ],
        groupBLabel: "Pickup window",
        groupB: [
          { label: "08:30 AM", delta: 0, kg: 0 },
          { label: "10:30 AM", delta: 0, kg: 0 },
        ],
      }
    : {
        basePrice: config.customMetrics.basePriceUsd,
        chassis: config.chassisCode,
        groupALabel: "Exterior finish",
        groupA: [
          { label: "Raw Carbon", delta: 0, kg: 0 },
          { label: "Mineral Coat", delta: 5400, kg: 2 },
          { label: "Slate Weave", delta: 7800, kg: -4 },
        ],
        groupBLabel: "Wheel package",
        groupB: [
          { label: "Forged 10-Spoke", delta: 0, kg: 0 },
          { label: "Magnesium Lock", delta: 12000, kg: -14 },
          { label: "Carbon Track", delta: 18500, kg: -18 },
        ],
      };

  const navItems = sections.slice(0, 2).map((s) => ({
    label: s.code,
    href: `#${s.kind === "section-trim-builder" ? "cta" : s.kind}`,
  }));
  const heroMetrics = validatedMetrics.slice(0, 2).map((m) => ({
    label: m.label,
    val: m.displayValue,
  }));

  const heroFp = heroAsset.asset.focalPoint;
  const heroPos = heroFp
    ? `${Math.round(heroFp.x * 100)}% ${Math.round(heroFp.y * 100)}%`
    : "50% 50%";

  const contentLines: string[] = [
    `  brand: ${JSON.stringify(config.brandName)}, city: ${JSON.stringify(cleanCity)}, year: ${config.year}, manifesto: ${JSON.stringify(payload.manifestoQuote)},`,
    `  nav: ${JSON.stringify([{ label: "Overview", href: "#overview" }, ...navItems])}, cta: ${JSON.stringify(payload.ctaPrimary)}, secondaryCta: ${JSON.stringify(payload.ctaSecondary)},`,
    `  heroBadge: ${JSON.stringify(placeBadge)}, heroTitle: ${JSON.stringify(payload.headline)}, heroSub: ${JSON.stringify(payload.subheadline)}, heroImage: ${JSON.stringify(toRel(heroMediaUrl))}, heroPos: ${JSON.stringify(heroPos)}, heroMetrics: ${JSON.stringify(heroMetrics)},`,
    `  sections: ${JSON.stringify(sections.map((s) => ({ kind: s.kind, code: s.code, title: s.title, sub: s.subtitle })))},`,
  ];
  if (hasSpecs) contentLines.push(`  specs: ${JSON.stringify(specsData)},`);
  if (hasGallery) contentLines.push(`  gallery: ${JSON.stringify(galleryData)},`);
  if (hasOrbit) contentLines.push(`  orbit: ${JSON.stringify(orbitData)},`);
  if (hasMorph) contentLines.push(`  morph: ${JSON.stringify(morphData)},`);
  if (hasCockpit) contentLines.push(`  cockpit: ${JSON.stringify(cockpitData)},`);
  if (hasTimeline) contentLines.push(`  timeline: ${JSON.stringify(timelineData)},`);
  if (hasStrip) contentLines.push(`  strip: ${JSON.stringify(stripData)},`);
  if (hasBuilder) contentLines.push(`  builder: ${JSON.stringify(builderData)},`);
  if (!hasBuilder) contentLines.push(`  ctaTitle: ${JSON.stringify(ctaTitle)}, ctaSub: ${JSON.stringify(sectionCopy.ctaSentence)},`);
  const formattedContent = `{\n${contentLines.join("\n")}\n}`;

  const themeObj = {
    bg: pal.bg,
    surface: pal.surface,
    text: pal.fg,
    muted: pal.muted,
    border: pal.border,
    accent: pal.accent,
    accentText: pal.accentFg,
    displayFont: tokens.fontPair.displayFamily,
    bodyFont: tokens.fontPair.bodyFamily,
    monoFont: tokens.fontPair.monoFamily,
    fontUrl: tokens.fontPair.googleFontsUrl,
    radius: tokens.cardRadius,
    btnRadius: tokens.buttonRadius,
  };
  const formattedTheme = `{\n  bg: ${JSON.stringify(themeObj.bg)}, surface: ${JSON.stringify(themeObj.surface)}, text: ${JSON.stringify(themeObj.text)}, muted: ${JSON.stringify(themeObj.muted)},\n  border: ${JSON.stringify(themeObj.border)}, accent: ${JSON.stringify(themeObj.accent)}, accentText: ${JSON.stringify(themeObj.accentText)}, radius: ${JSON.stringify(themeObj.radius)}, btnRadius: ${JSON.stringify(themeObj.btnRadius)},\n  displayFont: ${JSON.stringify(themeObj.displayFont)}, bodyFont: ${JSON.stringify(themeObj.bodyFont)}, monoFont: ${JSON.stringify(themeObj.monoFont)}, fontUrl: ${JSON.stringify(themeObj.fontUrl)}\n}`;

  const padSection =
    tokens.archetype === "track"
      ? "py-14"
      : tokens.archetype === "editorial"
        ? "py-24"
        : "py-20";

  const heroJsx = renderHeroSnippet(tokens.heroVariant, padSection, firstHref);
  const ctaJsx = hasBuilder
    ? ""
    : `\n      <section id="cta" style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="border-b py-20 px-6 text-center max-w-3xl mx-auto space-y-5">
        <h2 style={{ fontFamily: theme.displayFont }} className="text-3xl sm:text-4xl font-semibold">{content.ctaTitle}</h2>
        <p style={{ color: theme.muted }} className="text-sm sm:text-base max-w-xl mx-auto">{content.ctaSub}</p>
        <a href="#overview" style={btn} className="inline-block px-8 py-3.5 text-xs font-semibold uppercase tracking-wider">{content.cta}</a>
      </section>`;
  const ctaOrderIdx = payload.sectionOrder.indexOf("cta");
  const specsOrderIdx = payload.sectionOrder.indexOf("specs");
  const galleryOrderIdx = payload.sectionOrder.indexOf("gallery");
  const slotOfKind = (k: SynthesizedSectionSpec["kind"]) =>
    k === "section-trim-builder"
      ? "cta"
      : k === "section-spec-ledger" || k === "section-state-morph"
        ? "specs"
        : "gallery";
  const bodyBlocks: string[] = [];
  let ctaEmitted = hasBuilder;
  sections.forEach((sec, idx) => {
    const slot = slotOfKind(sec.kind);
    const slotPos = slot === "specs" ? specsOrderIdx : slot === "gallery" ? galleryOrderIdx : ctaOrderIdx;
    if (!ctaEmitted && ctaOrderIdx !== -1 && slotPos > ctaOrderIdx) {
      bodyBlocks.push(ctaJsx);
      ctaEmitted = true;
    }
    bodyBlocks.push(renderBlueprintSectionSnippet(sec, idx, padSection, hasUnitToggle));
  });
  if (!ctaEmitted && ctaJsx) {
    bodyBlocks.push(ctaJsx);
  }
  const renderedSections = bodyBlocks.join("\n");
  const footerJsx = `\n      <footer style={{ color: theme.muted }} className="py-10 px-6 sm:px-10 text-xs max-w-6xl mx-auto space-y-3">
        <p style={{ color: theme.text }} className="text-sm font-medium">{content.manifesto}</p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>{content.year} {content.brand} · {content.city}</span>
          <div className="flex gap-6"><a href="#overview">Privacy</a><a href=${JSON.stringify(firstHref)}>Specs</a><a href="#cta">Contact</a></div>
        </div>
      </footer>`;

  const stateDeclLines: string[] = [];
  if (hasSpecs) stateDeclLines.push("  const [progress, setProgress] = useState(0);");
  if (hasUnitToggle) stateDeclLines.push("  const [imperial, setImperial] = useState(false);");
  if (hasOrbit) stateDeclLines.push("  const [orbitIdx, setOrbitIdx] = useState(0);");
  if (hasMorph) stateDeclLines.push("  const [morphIdx, setMorphIdx] = useState(0);");
  if (hasCockpit) stateDeclLines.push("  const [cabinIdx, setCabinIdx] = useState(0);");
  if (hasTimeline) stateDeclLines.push("  const [chapterIdx, setChapterIdx] = useState(0);");
  if (hasBuilder) {
    stateDeclLines.push("  const [optA, setOptA] = useState(0);");
    stateDeclLines.push("  const [optB, setOptB] = useState(0);");
    stateDeclLines.push("  const [booked, setBooked] = useState(false);");
  }

  const effectLines = hasSpecs
    ? `  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(1); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 800);
      setProgress(1 - (1 - p) ** 3);
      if (p < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);`
    : "";

  const formatSpecHelper = hasSpecs
    ? hasUnitToggle
      ? `  const formatSpec = (s: { value: number; unit: string; prefix: string; decimals: number }) => {
    const raw = imperial && (s.unit === "km" || s.unit === "km/h") ? Math.round(s.value * 0.621371) : imperial && s.unit === "kg" ? Math.round(s.value * 2.20462) : s.value;
    const unit = imperial && s.unit === "km" ? "mi" : imperial && s.unit === "km/h" ? "mph" : imperial && s.unit === "kg" ? "lb" : s.unit;
    const scaled = s.decimals ? (raw * progress).toFixed(s.decimals) : Math.round(raw * progress).toLocaleString();
    return s.prefix ? s.prefix + scaled : scaled + (unit ? " " + unit : "");
  };`
      : `  const formatSpec = (s: { value: number; unit: string; prefix: string; decimals: number }) => {
    const scaled = s.decimals ? (s.value * progress).toFixed(s.decimals) : Math.round(s.value * progress).toLocaleString();
    return s.prefix ? s.prefix + scaled : scaled + (s.unit ? " " + s.unit : "");
  };`
    : "";

  const hookImports = [hasSpecs ? "useEffect" : "", stateDeclLines.length > 0 ? "useState" : ""].filter(Boolean);
  const reactImport =
    hookImports.length > 0
      ? `import React, { ${hookImports.join(", ")} } from "react";`
      : `import React from "react";`;

  const rawPageTsx = `"use client";
${reactImport}

const content = ${formattedContent} as const;
const theme = ${formattedTheme} as const;
const btn = { backgroundColor: theme.accent, color: theme.accentText, borderRadius: theme.btnRadius };
const card = { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: theme.radius };

export default function LandingPage() {
${stateDeclLines.join("\n")}
${effectLines}
${formatSpecHelper}
  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.bodyFont }} className="min-h-screen overflow-x-clip">
      <link rel="stylesheet" href={theme.fontUrl} />
      <header style={{ borderColor: theme.border }} className="border-b px-6 h-16 flex items-center justify-between max-w-6xl mx-auto">
        <span style={{ fontFamily: theme.displayFont }} className="text-lg font-semibold">{content.brand}</span>
        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-wider">{content.nav.map((n) => (<a key={n.label} href={n.href} style={{ color: theme.muted }}>{n.label}</a>))}</nav>
        <a href="#cta" style={btn} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider">{content.cta}</a>
      </header>
${heroJsx}
${renderedSections}${footerJsx}
    </div>
  );
}`;

  const pageTsx = stripCodeCommentsAst(rawPageTsx);
  const lineCount = pageTsx.trim().split("\n").length;

  const imagesManifest = stripCodeCommentsAst(
    JSON.stringify(
      {
        brand: config.brandName,
        model: config.modelName,
        images: assetMappings.map((m) => ({
          role: m.role,
          path: m.relativeRef,
          source: m.sourcePublicUrl,
        })),
      },
      null,
      2
    )
  );

  const files: ExportFileEntry[] = [
    { path: "page.tsx", content: pageTsx },
    { path: "assets/images.json", content: imagesManifest },
  ];

  const dependencies = [
    {
      name: "react",
      version: "^19.0.0",
      reason: "Single runtime dependency (uses native CSS and React hooks)",
    },
  ] as const;

  return {
    pageTsx,
    reactTsx: pageTsx,
    nextjsPageTsx: pageTsx,
    copyForAiEditor: `${AI_EDITOR_INSTRUCTION}\n\n${pageTsx}`,
    aiInstruction: AI_EDITOR_INSTRUCTION,
    lineCount,
    files,
    assetMappings,
    dependencies,
  };
}

function makeCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = makeCrc32Table();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

export function createStoreZipBytes(
  entries: ReadonlyArray<{ path: string; data: Uint8Array }>
): Uint8Array {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path);
    const dataBytes = entry.data;
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  let centralSize = 0;
  for (const ch of centralChunks) {
    centralSize += ch.length;
  }

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalLen = offset + centralSize + eocd.length;
  const output = new Uint8Array(totalLen);
  let pos = 0;

  for (const chunk of localChunks) {
    output.set(chunk, pos);
    pos += chunk.length;
  }
  for (const chunk of centralChunks) {
    output.set(chunk, pos);
    pos += chunk.length;
  }
  output.set(eocd, pos);

  return output;
}
