import {
  ArchetypeId,
  AutoSubcategoryId,
  CopyVoiceId,
  GeneratorUserConfig,
  MetricKind,
  PrimaryCtaGoal,
  SectionKind,
  SlotDimensionType,
  ValidatedMetric,
} from "./schema";

interface MetricValidationRule {
  kind: MetricKind;
  dimension: SlotDimensionType;
  canonicalLabel: string;
  canonicalUnit: string;
  minAllowed: number;
  maxAllowed: number;
  decimals: number;
  prefix?: string;
}

export const METRIC_VALIDATION_RULES: Readonly<
  Record<MetricKind, MetricValidationRule>
> = {
  acceleration: {
    kind: "acceleration",
    dimension: "time",
    canonicalLabel: "0–100 km/h",
    canonicalUnit: "s",
    minAllowed: 1.75,
    maxAllowed: 3.9,
    decimals: 2,
  },
  "top-speed": {
    kind: "top-speed",
    dimension: "length",
    canonicalLabel: "Top Speed",
    canonicalUnit: "km/h",
    minAllowed: 280,
    maxAllowed: 440,
    decimals: 0,
  },
  range: {
    kind: "range",
    dimension: "length",
    canonicalLabel: "Driving Range",
    canonicalUnit: "km",
    minAllowed: 380,
    maxAllowed: 820,
    decimals: 0,
  },
  power: {
    kind: "power",
    dimension: "power",
    canonicalLabel: "Peak Power",
    canonicalUnit: "hp",
    minAllowed: 620,
    maxAllowed: 1950,
    decimals: 0,
  },
  "mass-delta": {
    kind: "mass-delta",
    dimension: "mass",
    canonicalLabel: "Weight Saved",
    canonicalUnit: "kg",
    minAllowed: -240,
    maxAllowed: -35,
    decimals: 0,
  },
  downforce: {
    kind: "downforce",
    dimension: "mass",
    canonicalLabel: "Peak Downforce",
    canonicalUnit: "kg",
    minAllowed: 280,
    maxAllowed: 1200,
    decimals: 0,
  },
  rigidity: {
    kind: "rigidity",
    dimension: "power",
    canonicalLabel: "Chassis Stiffness",
    canonicalUnit: "Nm/deg",
    minAllowed: 38000,
    maxAllowed: 75000,
    decimals: 0,
  },
  "charge-time": {
    kind: "charge-time",
    dimension: "time",
    canonicalLabel: "10–80% Fast Charge",
    canonicalUnit: "min",
    minAllowed: 11,
    maxAllowed: 28,
    decimals: 0,
  },
  "chassis-quota": {
    kind: "chassis-quota",
    dimension: "mass",
    canonicalLabel: "Annual Build Quota",
    canonicalUnit: "units",
    minAllowed: 12,
    maxAllowed: 150,
    decimals: 0,
  },
  price: {
    kind: "price",
    dimension: "price",
    canonicalLabel: "Starting Price",
    canonicalUnit: "USD",
    minAllowed: 145000,
    maxAllowed: 1850000,
    decimals: 0,
    prefix: "$",
  },
} as const;

export function buildValidatedMetric(
  id: string,
  kind: MetricKind,
  rawNumeric: number,
  contextNote: string,
  customLabel?: string
): ValidatedMetric {
  const rule = METRIC_VALIDATION_RULES[kind];
  const safeVal = Number.isFinite(rawNumeric) ? rawNumeric : rule.minAllowed;
  const clamped = Math.max(
    rule.minAllowed,
    Math.min(rule.maxAllowed, safeVal)
  );

  const formattedNum =
    rule.decimals > 0
      ? clamped.toFixed(rule.decimals)
      : Math.round(clamped).toLocaleString("en-US");

  const displayValue = rule.prefix
    ? `${rule.prefix}${formattedNum}`
    : `${formattedNum} ${rule.canonicalUnit}`;

  return {
    id,
    kind,
    dimension: rule.dimension,
    label: customLabel || rule.canonicalLabel,
    numericValue: clamped,
    displayValue,
    unit: rule.canonicalUnit,
    contextNote: ensureCapitalizedSentence(contextNote),
  };
}

export function validateMetricIntegrity(metric: ValidatedMetric): boolean {
  const rule = METRIC_VALIDATION_RULES[metric.kind];
  if (!rule) return false;
  if (metric.dimension !== rule.dimension) return false;
  if (metric.unit !== rule.canonicalUnit) return false;
  if (
    !Number.isFinite(metric.numericValue) ||
    metric.numericValue < rule.minAllowed ||
    metric.numericValue > rule.maxAllowed
  ) {
    return false;
  }
  if (rule.prefix && !metric.displayValue.startsWith(rule.prefix)) {
    return false;
  }
  if (!rule.prefix && !metric.displayValue.endsWith(rule.canonicalUnit)) {
    return false;
  }
  return true;
}

export function validateAndBuildVehicleMetrics(
  config: GeneratorUserConfig
): ValidatedMetric[] {
  const { customMetrics, subcategory } = config;
  const safeLocation =
    (config.location || "Zurich").split(",")[0].split("·")[0].trim() || "Zurich";

  const accel = buildValidatedMetric(
    "m-accel",
    "acceleration",
    customMetrics.accelSeconds,
    "All-wheel launch control"
  );

  const power = buildValidatedMetric(
    "m-power",
    "power",
    customMetrics.powerHp,
    "Combined motor output"
  );

  const speed = buildValidatedMetric(
    "m-speed",
    "top-speed",
    customMetrics.topSpeedKmh,
    "Closed track rating"
  );

  const range = buildValidatedMetric(
    "m-range",
    "range",
    customMetrics.rangeKm,
    "Combined city and highway"
  );

  const downforce = buildValidatedMetric(
    "m-downforce",
    "downforce",
    customMetrics.downforceKg,
    "At 280 km/h with active wing"
  );

  const massDelta = buildValidatedMetric(
    "m-mass",
    "mass-delta",
    customMetrics.massDeltaKg,
    "Carbon body versus aluminum"
  );

  const price = buildValidatedMetric(
    "m-price",
    "price",
    customMetrics.basePriceUsd,
    `Showroom delivery in ${safeLocation}`
  );

  if (subcategory === "carbon-atelier") {
    return [massDelta, downforce, accel, price];
  }
  if (subcategory === "motorsport-tuning") {
    return [accel, speed, downforce, power];
  }
  if (subcategory === "bespoke-dealership") {
    return [accel, power, speed, price];
  }
  return [accel, range, power, price];
}

export const VOICE_LABELS: Readonly<Record<CopyVoiceId, string>> = {
  "technical-homologation": "Precision & Cold",
  "bespoke-collector": "Quiet Luxury",
  "editorial-manifesto": "Electric Future",
  "motorsport-raw": "Raw & Mechanical",
};

export interface HeadlineTemplateItem {
  formId: string;
  template: string;
}

export const HEADLINE_TEMPLATES: Readonly<
  Record<CopyVoiceId, readonly HeadlineTemplateItem[]>
> = {
  "technical-homologation": [
    { formId: "form-01-year-marque", template: "{year} {brandName} {modelName}" },
    { formId: "form-02-power-lead", template: "{power} hp {brandName} {modelName}" },
    { formId: "form-03-city-preposition", template: "{power} hp {modelName} in {location}" },
    { formId: "form-04-sprint-time", template: "0–100 in {accel} s: {modelName}" },
    { formId: "form-05-mass-reduction", template: "{massDelta} kg Lighter {modelName}" },
    { formId: "form-06-chassis-series", template: "{power} hp Chassis {chassisCode} by {brandName}" },
    { formId: "form-07-range-rating", template: "{modelName} with {range} km Range" },
    { formId: "form-08-top-speed", template: "{speed} km/h Top Speed {modelName}" },
    { formId: "form-09-verb-imperative", template: "Drive the {power} hp {modelName}" },
    { formId: "form-10-downforce-load", template: "{downforce} kg Downforce on {modelName}" },
  ],
  "bespoke-collector": [
    { formId: "form-01-year-marque", template: "{year} {brandName} {modelName}" },
    { formId: "form-02-power-lead", template: "{power} hp {brandName} {modelName}" },
    { formId: "form-03-city-preposition", template: "{power} hp {modelName} in {location}" },
    { formId: "form-04-sprint-time", template: "0–100 in {accel} s: {modelName}" },
    { formId: "form-05-mass-reduction", template: "{massDelta} kg Lighter {modelName}" },
    { formId: "form-06-chassis-series", template: "{power} hp Series {chassisCode} by {brandName}" },
    { formId: "form-07-range-rating", template: "{modelName} with {range} km Range" },
    { formId: "form-08-top-speed", template: "{speed} km/h Grand Tourer {modelName}" },
    { formId: "form-09-verb-imperative", template: "Reserve the {power} hp {modelName}" },
    { formId: "form-10-downforce-load", template: "{downforce} kg Aero Load {modelName}" },
  ],
  "editorial-manifesto": [
    { formId: "form-01-year-marque", template: "{year} {brandName} {modelName}" },
    { formId: "form-02-power-lead", template: "{power} hp {brandName} {modelName}" },
    { formId: "form-03-city-preposition", template: "{power} hp {modelName} in {location}" },
    { formId: "form-04-sprint-time", template: "0–100 in {accel} s: {modelName}" },
    { formId: "form-05-mass-reduction", template: "{massDelta} kg Lighter {modelName}" },
    { formId: "form-06-chassis-series", template: "{speed} km/h Edition {chassisCode} by {brandName}" },
    { formId: "form-07-range-rating", template: "{modelName} with {range} km Range" },
    { formId: "form-08-top-speed", template: "{speed} km/h Coupe {modelName}" },
    { formId: "form-09-verb-imperative", template: "Meet the {power} hp {modelName}" },
    { formId: "form-10-downforce-load", template: "{downforce} kg Downforce on {modelName}" },
  ],
  "motorsport-raw": [
    { formId: "form-01-year-marque", template: "{year} {brandName} {modelName}" },
    { formId: "form-02-power-lead", template: "{power} hp {brandName} {modelName}" },
    { formId: "form-03-city-preposition", template: "{power} hp {modelName} in {location}" },
    { formId: "form-04-sprint-time", template: "0–100 in {accel} s: {modelName}" },
    { formId: "form-05-mass-reduction", template: "{massDelta} kg Lighter {modelName}" },
    { formId: "form-06-chassis-series", template: "{power} hp Track {chassisCode} by {brandName}" },
    { formId: "form-07-range-rating", template: "{modelName} with {range} km Range" },
    { formId: "form-08-top-speed", template: "{speed} km/h Track {modelName}" },
    { formId: "form-09-verb-imperative", template: "Drive the {power} hp {modelName}" },
    { formId: "form-10-downforce-load", template: "{downforce} kg Downforce on {modelName}" },
  ],
};

const SUBHEADLINE_TEMPLATES: Readonly<
  Record<CopyVoiceId, readonly string[]>
> = {
  "technical-homologation": [
    "Engineered in {location} with {power} hp output, {accel} s sprint time, and {range} km driving range.",
    "Built on chassis {chassisCode} in {location}, pairing {power} hp with {massDelta} kg of weight saved.",
    "The {year} {modelName} reaches 100 km/h in {accel} s and {speed} km/h top speed in {location}.",
    "Carbon construction removes {massDelta} kg while delivering {power} hp and {downforce} kg downforce.",
    "Rated for {range} km range and {power} hp output at our {location} engineering center.",
    "Dual-motor drive on the {modelName} produces {power} hp for {accel} s launches in {location}.",
    "Wind-tunnel bodywork generates {downforce} kg downforce at {speed} km/h on the {modelName}.",
    "Starting at {price} in {location} with {power} hp and {range} km combined range.",
    "Chassis {chassisCode} sheds {massDelta} kg to reach 100 km/h in {accel} s.",
    "Delivered in {location} with {power} hp, {speed} km/h top speed, and {massDelta} kg saved.",
  ],
  "bespoke-collector": [
    "Available at our {location} showroom with {power} hp, {accel} s acceleration, and {range} km range.",
    "Hand-finished in {location}, pairing a {massDelta} kg lighter carbon body with {power} hp output.",
    "The {year} {modelName} combines {range} km touring range and {speed} km/h speed in {location}.",
    "Custom showroom delivery in {location} starting at {price} with {power} hp performance.",
    "Built to order on chassis {chassisCode} with {accel} s sprint capability and {massDelta} kg saved.",
    "Long-distance comfort in {location} backed by {power} hp and {range} km on one charge.",
    "Sculpted carbon panels save {massDelta} kg while generating {downforce} kg of stability.",
    "Private viewing in {location} for the {power} hp {modelName} with {accel} s launch control.",
    "Limited {year} production in {location} featuring {power} hp and {speed} km/h top speed.",
    "Every {modelName} in {location} unites {power} hp output with {range} km driving range.",
  ],
  "editorial-manifesto": [
    "Designed in {location} to deliver {power} hp, {accel} s acceleration, and {massDelta} kg reduced mass.",
    "The {modelName} pairs {range} km driving range with {power} hp across {location} roads.",
    "Lighter by {massDelta} kg, the {year} {modelName} sprints to 100 km/h in {accel} s.",
    "Clean aerodynamics produce {downforce} kg downforce and {speed} km/h top speed in {location}.",
    "Chassis {chassisCode} brings {power} hp and {range} km range to our {location} collection.",
    "Balanced proportions and {massDelta} kg weight reduction define the {power} hp {modelName}.",
    "From {location} to open highways, the {modelName} offers {range} km range and {accel} s launches.",
    "Priced from {price} in {location} with {power} hp and {downforce} kg aerodynamic load.",
    "Carbon body panels trim {massDelta} kg from the {speed} km/h {brandName} {modelName}.",
    "Quiet cabin acoustics meet {power} hp and {accel} s acceleration in {location}.",
  ],
  "motorsport-raw": [
    "Track-ready in {location} with {power} hp, {accel} s acceleration, and {massDelta} kg of weight removed.",
    "Active aero on the {modelName} generates {downforce} kg downforce and {speed} km/h top speed.",
    "Chassis {chassisCode} delivers {power} hp and 0 to 100 km/h in {accel} s.",
    "Carbon-ceramic brakes and {massDelta} kg saved prepare the {modelName} for {location} circuits.",
    "Built in {location} for {speed} km/h straights with {power} hp and {downforce} kg downforce.",
    "Launch control sends {power} hp to all four wheels for {accel} s sprint times.",
    "Stripped of {massDelta} kg, the {year} {modelName} produces {power} hp in {location}.",
    "Rated at {downforce} kg downforce and {range} km range for {location} track days.",
    "Direct torque vectoring on chassis {chassisCode} with {power} hp and {speed} km/h speed.",
    "Available in {location} from {price} with {power} hp and {accel} s launch performance.",
  ],
};

export const SECTION_SENTENCE_TEMPLATES: Readonly<{
  specs: readonly string[];
  gallery: readonly string[];
  cta: readonly string[];
}> = {
  specs: [
    "Verified figures for the {modelName}: {power} hp, {accel} s sprint, and {massDelta} kg saved.",
    "Measured on chassis {chassisCode} in {location} with {speed} km/h top speed and {range} km range.",
    "Factory data for the {year} {modelName} showing {power} hp and {downforce} kg downforce.",
    "Certified {location} test numbers: 0 to 100 km/h in {accel} s with {power} hp.",
    "Weight reduction of {massDelta} kg paired with {range} km range and {power} hp output.",
    "Benchmark figures for {location} delivery: {speed} km/h speed and {accel} s acceleration.",
    "Drivetrain and chassis numbers for the {power} hp {modelName} starting at {price}.",
    "Aerodynamic load of {downforce} kg and {massDelta} kg saved on chassis {chassisCode}.",
    "Full performance breakdown for the {year} {modelName} rated at {power} hp in {location}.",
    "Standard specification for {location}: {range} km range, {accel} s launch, and {power} hp.",
  ],
  gallery: [
    "Selected views of the {power} hp {modelName} photographed for our {location} showroom.",
    "Exterior and cabin details of chassis {chassisCode} showing {massDelta} kg carbon weight savings.",
    "Studio angles of the {year} {modelName} highlighting its {downforce} kg aerodynamic bodywork.",
    "Close inspection of the {modelName} in {location}, built for {accel} s acceleration.",
    "Bodywork, lighting, and cabin materials on the {speed} km/h {brandName} {modelName}.",
    "Four perspectives of the {modelName} showing the {range} km battery and carbon shell.",
    "Photographed in {location}: carbon weave, brake hardware, and {power} hp drivetrain details.",
    "Production finish on the {year} {modelName} priced from {price} in {location}.",
    "Front, rear, and cabin views of the {massDelta} kg lighter {brandName} {modelName}.",
    "Visual record of chassis {chassisCode} built in {location} with {power} hp output.",
  ],
  cta: [
    "Available in {location} with {power} hp and {range} km range starting at {price}.",
    "Schedule an appointment in {location} to test the {accel} s {brandName} {modelName}.",
    "Visit our {location} showroom to inspect chassis {chassisCode} and its {massDelta} kg carbon body.",
    "Reserve your {year} {modelName} in {location} with {power} hp and {speed} km/h top speed.",
    "Contact the {location} team for allocation details on the {price} {modelName}.",
    "Book a private session in {location} to experience {power} hp and {downforce} kg downforce.",
    "Configure the {range} km {modelName} with our specialists in {location} today.",
    "Direct showroom delivery in {location} for the {accel} s, {power} hp {modelName}.",
    "Inquire in {location} about {year} build slots for the {massDelta} kg lighter {modelName}.",
    "Test the {speed} km/h {brandName} {modelName} on road or track in {location}.",
  ],
};

const MANIFESTO_QUOTES: Readonly<
  Record<CopyVoiceId, readonly string[]>
> = {
  "technical-homologation": [
    "The {modelName} carbon chassis saves {massDelta} kg and supports {power} hp in {location}.",
    "Dual motors deliver {power} hp and 0 to 100 km/h in {accel} s.",
    "Chassis {chassisCode} achieves {speed} km/h top speed with balanced aerodynamics in {location}.",
    "900V architecture charges the {modelName} battery to 80 percent in 14 minutes.",
    "Carbon-ceramic rotors shed {massDelta} kg while halting from 100 km/h in 27 meters.",
    "Active floor tunnels produce {downforce} kg downforce for high-speed stability in {location}.",
    "Four cooling radiators ensure repeated {accel} s launches without thermal degradation.",
    "Track instrumentation inside the {power} hp {modelName} records every circuit lap in {location}.",
    "The {year} production specification pairs {range} km range with extreme track capability.",
    "Direct wheel motors generate instantaneous torque for {accel} s sprint performance.",
  ],
  "bespoke-collector": [
    "Every {modelName} in {location} pairs {power} hp with a {massDelta} kg lighter body.",
    "Built for long-distance comfort with {power} hp and {range} km range in {location}.",
    "Tailored in our {location} atelier with bespoke charcoal suede and titanium appointments.",
    "Limited series {chassisCode} represents the peak of hand-finished composite craftsmanship.",
    "Bespoke forged center-lock wheels save unsprung mass on the {power} hp {modelName}.",
    "Curated coachbuilt proportions deliver timeless presence on the streets of {location}.",
    "A private commission pairing {speed} km/h performance with an ultra-quiet cabin.",
    "Each {year} allocation in {location} includes bespoke paintwork and customized switchgear.",
    "Hand-milled aluminum hardware and woven carbon define the interior of the {modelName}.",
    "Collector edition {chassisCode} offered directly through our private {location} salon.",
  ],
  "editorial-manifesto": [
    "Clean bodywork helps the {power} hp {modelName} reach {range} km on a charge.",
    "Lightweight construction removes {massDelta} kg for {accel} s acceleration in {location}.",
    "Form follows aerodynamics across every surface of the {year} {brandName} {modelName}.",
    "A study in modern proportions, pairing {speed} km/h capability with sculpted minimalism.",
    "The {modelName} redefines high performance through mass efficiency rather than excess weight.",
    "Designed in {location} as a functional synthesis of carbon structure and electric propulsion.",
    "Low drag geometry and {downforce} kg aero balance create a serene high-speed grand tourer.",
    "An architectural silhouette celebrating structural carbon and precision engineering in {location}.",
    "Understated elegance concealing a {power} hp powertrain capable of {accel} s launches.",
    "The {year} {modelName} edition documents a clear commitment to zero-emission velocity.",
  ],
  "motorsport-raw": [
    "Carbon-ceramic brakes and {massDelta} kg weight reduction prepare the {power} hp {modelName} for track days.",
    "Active rear wing adds {downforce} kg of downforce to the {power} hp {modelName}.",
    "Chassis {chassisCode} is corner-balanced and aligned for competition circuits in {location}.",
    "Direct steering feedback and {accel} s acceleration put driver skill at the center.",
    "Stiffened anti-roll bars and titanium hardware maximize mechanical grip through high-speed turns.",
    "Full-length carbon diffuser channels underbody airflow to generate race-proven downforce.",
    "Track loggers display live brake rotor temperatures and tire slip angle readouts.",
    "Developed on the pit-wall to sustain {power} hp output across grueling 30-minute stints.",
    "Stripped of decorative trim to save {massDelta} kg of critical unsprung and body mass.",
    "The {modelName} Track Edition is tuned for immediate circuit delivery in {location}.",
  ],
};

export function protectCompoundHyphens(input: string): string {
  return input
    .replace(/\u00AD/g, "")
    .replace(
      /([A-Za-zÜüÖöÄä0-9])-([A-Za-zÜüÖöÄä0-9])/g,
      "$1\u2011$2"
    )
    .replace(
      /([A-Za-zÜüÖöÄä0-9])-([A-Za-zÜüÖöÄä0-9])/g,
      "$1\u2011$2"
    );
}

export function ensureCapitalizedSentence(input: string): string {
  const collapsed = input.replace(/\s+/g, " ").trim();
  if (!collapsed) return "";
  return collapsed.charAt(0).toUpperCase() + collapsed.slice(1);
}

export function countWords(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

const KNOWN_UNITS = new Set(["hp", "s", "km", "km/h", "kg", "min", "units", "usd"]);

export function enforceWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");

  let sliceLen = maxWords;
  if (words.length > sliceLen) {
    const nextWordLower = words[sliceLen].toLowerCase().replace(/[^a-z/]/g, "");
    const lastWord = words[sliceLen - 1];
    const isLastWordNumber = /^[$]?[0-9]+([.,][0-9]+)?$/.test(lastWord);
    if (isLastWordNumber && KNOWN_UNITS.has(nextWordLower)) {
      sliceLen = Math.max(1, sliceLen - 1);
    }
  }

  const sliced = words.slice(0, sliceLen).join(" ").replace(/[,:;]+$/, "");
  return text.trim().endsWith(".") && !sliced.endsWith(".") ? `${sliced}.` : sliced;
}

export function normalizeCtaToThreeWords(cta: PrimaryCtaGoal | string): string {
  const cleaned = cta.trim();
  if (cleaned.toLowerCase() === "book a test drive") {
    return "Book test drive";
  }
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words.length <= 3) {
    return words.join(" ");
  }
  if (words.length > 3) {
    return words.slice(0, 3).join(" ");
  }
  return "Book test drive";
}

export function interpolateText(
  template: string,
  config: GeneratorUserConfig
): string {
  const rawBrand = (config.brandName || "").trim() || "Kronos";
  const safeBrand = rawBrand.split(/\s+/).slice(0, 2).join(" ");
  const rawModel = (config.modelName || "").trim() || "Valkyrie GT";
  const safeModel = rawModel.split(/\s+/).slice(0, 2).join(" ");
  const safeChassis = (config.chassisCode || "").trim() || "KR-09";
  const rawLoc = (config.location || "").split(",")[0].split("·")[0].trim();
  const safeLoc = (rawLoc || "Zurich").split(/\s+/).slice(0, 2).join(" ");
  const safeYear =
    Number.isFinite(config.year) && config.year >= 2020 && config.year <= 2035
      ? config.year
      : 2026;

  const accelMetric = buildValidatedMetric(
    "slot-accel",
    "acceleration",
    config.customMetrics.accelSeconds,
    "Validated slot"
  );
  const powerMetric = buildValidatedMetric(
    "slot-power",
    "power",
    config.customMetrics.powerHp,
    "Validated slot"
  );
  const speedMetric = buildValidatedMetric(
    "slot-speed",
    "top-speed",
    config.customMetrics.topSpeedKmh,
    "Validated slot"
  );
  const downforceMetric = buildValidatedMetric(
    "slot-df",
    "downforce",
    config.customMetrics.downforceKg,
    "Validated slot"
  );
  const massMetric = buildValidatedMetric(
    "slot-mass",
    "mass-delta",
    config.customMetrics.massDeltaKg,
    "Validated slot"
  );
  const rangeMetric = buildValidatedMetric(
    "slot-range",
    "range",
    config.customMetrics.rangeKm,
    "Validated slot"
  );
  const priceMetric = buildValidatedMetric(
    "slot-price",
    "price",
    config.customMetrics.basePriceUsd,
    "Validated slot"
  );

  const interpolated = template
    .replace(/\{brandName\}/g, safeBrand)
    .replace(/\{modelName\}/g, safeModel)
    .replace(/\{chassisCode\}/g, safeChassis)
    .replace(/\{location\}/g, safeLoc)
    .replace(/\{year\}/g, String(safeYear))
    .replace(/\{power\}/g, Math.round(powerMetric.numericValue).toLocaleString("en-US"))
    .replace(/\{accel\}/g, accelMetric.numericValue.toFixed(2))
    .replace(/\{speed\}/g, String(Math.round(speedMetric.numericValue)))
    .replace(/\{topSpeed\}/g, String(Math.round(speedMetric.numericValue)))
    .replace(/\{downforce\}/g, String(Math.round(downforceMetric.numericValue)))
    .replace(/\{massDelta\}/g, String(Math.abs(Math.round(massMetric.numericValue))))
    .replace(/\{massSaved\}/g, String(Math.abs(Math.round(massMetric.numericValue))))
    .replace(/\{range\}/g, String(Math.round(rangeMetric.numericValue)))
    .replace(/\{price\}/g, priceMetric.displayValue);

  return protectCompoundHyphens(ensureCapitalizedSentence(interpolated));
}

export function selectCopyBundle(
  config: GeneratorUserConfig,
  voice: CopyVoiceId
): {
  headline: string;
  headlineFormId: string;
  subheadline: string;
  manifestoQuote: string;
  ctaPrimary: string;
  ctaSecondary: string;
} {
  const seedIdx = Math.max(0, Math.abs(config.variationSeed) - 1);
  const headlines = HEADLINE_TEMPLATES[voice];
  const subheadlines = SUBHEADLINE_TEMPLATES[voice];
  const quotes = MANIFESTO_QUOTES[voice];

  const chosenHeadlineSpec = headlines[seedIdx % headlines.length];
  const rawHeadline = interpolateText(chosenHeadlineSpec.template, config);
  const headline = enforceWordLimit(rawHeadline, 6);

  const rawSubheadline = interpolateText(
    subheadlines[seedIdx % subheadlines.length],
    config
  );
  const subheadline = enforceWordLimit(rawSubheadline, 18);

  const rawQuote = interpolateText(quotes[seedIdx % quotes.length], config);
  const manifestoQuote = enforceWordLimit(rawQuote, 18);

  const ctaBySub: Record<
    AutoSubcategoryId,
    { primary: string; secondary: string }
  > = {
    "hypercar-launch": {
      primary: "Reserve a car",
      secondary: "View specifications",
    },
    "motorsport-tuning": {
      primary: "Book test drive",
      secondary: "Compare specs",
    },
    "bespoke-dealership": {
      primary: "Visit the showroom",
      secondary: "Explore gallery",
    },
    "carbon-atelier": {
      primary: "Request a quote",
      secondary: "See pricing",
    },
  };

  const chosenPrimary = config.primaryCta
    ? normalizeCtaToThreeWords(config.primaryCta)
    : ctaBySub[config.subcategory].primary;

  return {
    headline,
    headlineFormId: chosenHeadlineSpec.formId,
    subheadline,
    manifestoQuote,
    ctaPrimary: chosenPrimary,
    ctaSecondary: ctaBySub[config.subcategory].secondary,
  };
}

export function selectSectionSentences(config: GeneratorUserConfig): {
  specsSentence: string;
  gallerySentence: string;
  ctaSentence: string;
} {
  const seedIdx = Math.max(0, Math.abs(config.variationSeed) - 1);
  const specsTemplates = SECTION_SENTENCE_TEMPLATES.specs;
  const galleryTemplates = SECTION_SENTENCE_TEMPLATES.gallery;
  const ctaTemplates = SECTION_SENTENCE_TEMPLATES.cta;

  return {
    specsSentence: enforceWordLimit(
      interpolateText(specsTemplates[seedIdx % specsTemplates.length], config),
      18
    ),
    gallerySentence: enforceWordLimit(
      interpolateText(
        galleryTemplates[seedIdx % galleryTemplates.length],
        config
      ),
      18
    ),
    ctaSentence: enforceWordLimit(
      interpolateText(ctaTemplates[seedIdx % ctaTemplates.length], config),
      18
    ),
  };
}

const AUTO_SECTION_COPY: Readonly<
  Record<
    SectionKind,
    {
      code: string;
      titles: readonly string[];
      subtitles: readonly string[];
    }
  >
> = {
  "section-orbit-360": {
    code: "Exterior",
    titles: [
      "Full exterior proportions",
      "Exterior studio walkaround",
      "Three-sixty body geometry",
      "Sculpted aerodynamic surfaces",
      "Orbital silhouette inspection",
    ],
    subtitles: [
      "Inspect the {modelName} stance across seven studio angles calibrated to {downforce} kg downforce.",
      "Clean panel gaps and underbody Venturi channels shaped for {speed} km/h stability.",
      "Examine front splitter, wheelbase balance, and active rear diffuser across full studio rotations.",
      "Every exterior surface on the {modelName} directs cooling airflow toward rear radiators.",
      "Rotate {chassisCode} body panels across zero to 270 degrees under neutral gallery light.",
      "Continuous carbon body lines carry aerodynamic load from nose splitter to diffuser strakes.",
      "Studied silhouette balanced for low frontal drag and {downforce} kg cornering grip.",
      "Low nose profile and wide rear haunches photographed cleanly across 270 degrees in {location}.",
      "Inspect roof channel curvature and recessed door intakes across sequential camera stations.",
      "Every quarter panel transition on the {year} {modelName} prioritizes clean laminar flow.",
    ],
  },
  "section-state-morph": {
    code: "Modes",
    titles: [
      "Touring and track setup",
      "Dual aero mode switch",
      "Road and circuit balance",
      "Adaptive chassis calibration",
      "Switchable aero geometry",
    ],
    subtitles: [
      "Compare {range} km touring ride height against active high-downforce track geometry.",
      "Switch between street compliance and full {power} hp circuit attack in real time.",
      "Ride height drops 35 mm while carbon ceramic cooling ducts open under track load.",
      "Compare aero drag, brake thermal reserve, and suspension travel across primary drive settings.",
      "Touring calibration unlocks {range} km range while Track unlocks {accel} s launches.",
      "Hydraulic pushrods stiffen roll stiffness and deploy twin rear elements past 180 km/h.",
      "Select road poise or locked circuit damping tuned for {location} proving grounds.",
      "Active damper valving transitions between long-distance comfort and flat circuit cornering.",
      "Toggle splitter pitch and rear wing angle to trade peak range for cornering adhesion.",
      "Dual suspension maps pair {massSaved} kg reduced weight with progressive hydraulic control.",
    ],
  },
  "section-cockpit-pov": {
    code: "Cabin",
    titles: [
      "Driver cabin architecture",
      "Tactile interior controls",
      "Carbon cockpit layout",
      "Focused driving position",
      "Anatomical cockpit study",
    ],
    subtitles: [
      "Explore windshield projection, milled aluminum console switches, and 7.4 kg carbon bucket seating.",
      "Inspected from the driver seat of the {modelName} in textured charcoal suede and carbon.",
      "Tap individual cabin stations to inspect material specifications and ergonomic reach zones.",
      "Physical rotary hardware and acoustic glass arranged for clear road feedback in {location}.",
      "Fixed carbon bucket shell aligns hip point low along the {chassisCode} center tunnel.",
      "Machined titanium switchgear eliminates submenu distractions during hard track braking.",
      "Perforated suede upholstery paired with acoustic glass reduces highway cabin fatigue.",
      "Driver sightlines frame front fenders clearly over the compact flat-bottom steering rim.",
      "Anodized floor pedals and heel stop plates adjust along fore-aft titanium tracks.",
      "Integrated door pulls and low sill height ease entry into the {year} {modelName} cabin.",
    ],
  },
  "section-asymmetric-dossier": {
    code: "Gallery",
    titles: [
      "Studio and road plates",
      "Curated vehicle perspectives",
      "Stance and light study",
      "Selected exterior frames",
      "Architectural plate archive",
    ],
    subtitles: [
      "Photographed across concrete galleries and damp proving grounds without digital composites.",
      "Multi-angle frames showing the {power} hp {modelName} from low splitter to rear wing.",
      "Asymmetric composition pairing wide environment plates with close mechanical details.",
      "Visual documentation of the {year} {modelName} compiled for the {location} launch.",
      "Real lighting across brushed titanium, satin carbon bodywork, and wet asphalt surfaces.",
      "Captured without stage overlays to reveal the true proportions of {chassisCode}.",
      "Selected angles contrasting wide profile balance against low rear diffuser tension.",
      "Studio and coastal frames showing surface reflections along sculpted flank intakes.",
      "Raw daylight and controlled gallery exposures highlight panel tolerances on the {modelName}.",
      "Five distinct camera perspectives framed across indoor concrete plinths and mountain passes.",
    ],
  },
  "section-editorial-timeline": {
    code: "Design",
    titles: [
      "Carbon build progression",
      "Three chapters in carbon",
      "From wind tunnel to road",
      "Engineering in three stages",
      "Chronicle of lightness",
    ],
    subtitles: [
      "How the {chassisCode} sheds {massSaved} kg through pressure-cured carbon and titanium hardware.",
      "Trace structural weight reduction, active aero validation, and final cabin finishing.",
      "Each assembly step verified before delivery to {location} allocation holders.",
      "Sequence of aerodynamic molding, powertrain calibration, and final road testing on {modelName}.",
      "Every gram trimmed across bodywork, wheel barrels, and suspension uprights totals {massSaved} kg.",
      "Built in small numbered batches in {location} with full individual track sign-off.",
      "Track validation connects computational aero shapes with predictable wet-weather balance.",
      "Chassis layup begins with hollow structural sills rated above 48,000 Nm/deg stiffness.",
      "Thermal soaking and damp circuit sessions validate cooling ducts before customer completion.",
      "Three measured engineering phases bring the {year} {modelName} from tub to street.",
    ],
  },
  "section-horizontal-strip": {
    code: "Hardware",
    titles: [
      "Forged carbon and brakes",
      "Mechanical close-up strip",
      "Precision hardware details",
      "Materials under close inspection",
      "Surface and component study",
    ],
    subtitles: [
      "Close views of center-lock wheel hubs, matrix optics, 900V charge ports, and cooling vents.",
      "Unfiltered material textures machined in titanium, forged composite, and ceramic composite.",
      "Inspect every exposed fastener, cooling duct, and brake caliper engineered for the {modelName}.",
      "Hardware built to sustain repeat {speed} km/h stops without fade or flex.",
      "Every mechanical component exposed in close frame from forged upright to LED lens.",
      "Machined titanium fasteners secure carbon aero blades under sustained {speed} km/h pressure.",
      "Close surface sequence detailing rotor thermal capacity and composite weave alignment.",
      "Inspect directional wheel aero covers, ceramic rotors, and flush side air extractors.",
      "Tight framing reveals exposed weave transitions and anodised alloy caliper mounts.",
      "Mechanical assemblies finished in bare matte composite for direct heat dissipation.",
    ],
  },
  "section-spec-ledger": {
    code: "Specs",
    titles: [
      "Verified technical figures",
      "Complete performance ledger",
      "Benchmark test figures",
      "Chassis and output breakdown",
      "Certified track numbers",
    ],
    subtitles: [
      "Measured metrics for the {modelName}: {power} hp, {accel} s sprint, {range} km range.",
      "Direct specification comparison across output, mass reduction, peak speed, and stopping distance.",
      "Standardized figures recorded in {location} prior to customer build allocation.",
      "Every figure verified on certified test rigs for the {year} {chassisCode} platform.",
      "Full specification sheet for the {year} {modelName} rated to {speed} km/h top velocity.",
      "Balanced hardware delivering {downforce} kg downforce with {massSaved} kg weight savings.",
      "Benchmarked stopping distance, lateral grip, and fast DC charging efficiency.",
      "Complete powertrain output and braking metrics certified for {location} homologated delivery.",
      "Audited dyno power, dry curb mass, and aero load figures for {chassisCode}.",
      "Side-by-side breakdown of acceleration, cornering grip, and 900V charging speed.",
    ],
  },
  "section-trim-builder": {
    code: "Reserve",
    titles: [
      "Configure your build",
      "Select finish and package",
      "Commission your {modelName}",
      "Specification and allocation",
      "Tailored commission studio",
    ],
    subtitles: [
      "Pair wheel package, cabin trim, and aerodynamic setup starting from {price}.",
      "Calculate real curb mass delta and delivery pricing before locking your {location} build slot.",
      "Customize track aero, forged magnesium wheels, and cabin materials in real time.",
      "Review configured pricing and weight delta prior to booking a {location} consultation.",
      "Select track carbon options and request an allocation consultation in {location}.",
      "Choose satin finish, lightweight calipers, and suede interior trim starting at {price}.",
      "Configure weight reduction packages and schedule private handover in {location}.",
      "Compare standard carbon aero with lightweight forged wheel upgrades from {price}.",
      "Lock exterior finish, brake package, and delivery city for your {year} {modelName}.",
      "Direct commission builder for selecting aerodynamic wings, carbon trim, and wheel finish.",
    ],
  },
};

export function selectBlueprintSectionCopy(
  kind: SectionKind,
  config: GeneratorUserConfig,
  archetype: ArchetypeId,
  isBakery: boolean
): { code: string; title: string; subtitle: string } {
  const seedIdx = Math.max(0, Math.abs(config.variationSeed) - 1);
  if (isBakery) {
    const bakeryMap: Record<SectionKind, { code: string; title: string; subtitle: string }> = {
      "section-orbit-360": {
        code: "Gallery",
        title: "Daily bake counter",
        subtitle: `Fresh sourdough loaves and laminated pastry trays baked daily at ${config.brandName}.`,
      },
      "section-state-morph": {
        code: "Schedule",
        title: "Morning and afternoon bake",
        subtitle: `Compare early viennoiserie batches with late-morning hearth loaves in ${config.location}.`,
      },
      "section-cockpit-pov": {
        code: "Hearth",
        title: "Stone mill and oven",
        subtitle: `Look inside the stone deck oven room and fermentation benches at ${config.brandName}.`,
      },
      "section-asymmetric-dossier": {
        code: "Gallery",
        title: "Bakehouse and loaf gallery",
        subtitle: `Hand-shaped country loaves and seasonal tarts photographed fresh on marble counters.`,
      },
      "section-editorial-timeline": {
        code: "Craft",
        title: "Fermentation and milling",
        subtitle: `Thirty-six hours of cold fermentation develop deep crust blister and open crumb structure.`,
      },
      "section-horizontal-strip": {
        code: "Ingredients",
        title: "Crust and grain details",
        subtitle: `Stone-milled regional wheat, cultured butter, and sea salt from trusted growers.`,
      },
      "section-spec-ledger": {
        code: "Specs",
        title: "Daily loaf weights",
        subtitle: `Standard weights, hydration levels, and oven times across our daily bread schedule.`,
      },
      "section-trim-builder": {
        code: "Reserve",
        title: `Reserve loaves in ${config.location}`,
        subtitle: `Select weekly sourdough box size and pickup window at ${config.brandName}.`,
      },
    };
    return bakeryMap[kind];
  }

  const entry = AUTO_SECTION_COPY[kind];
  const hasForcedArchetype = config.forcedArchetype !== "auto";
  const archOffset = hasForcedArchetype
    ? archetype === "monolith"
      ? 0
      : archetype === "track"
        ? 1
        : archetype === "editorial"
          ? 2
          : 3
    : 0;
  const rawTitle = entry.titles[(seedIdx + archOffset) % entry.titles.length];
  const rawSub = entry.subtitles[(seedIdx + archOffset) % entry.subtitles.length];

  return {
    code: entry.code,
    title: enforceWordLimit(interpolateText(rawTitle, config), 6),
    subtitle: enforceWordLimit(interpolateText(rawSub, config), 18),
  };
}
