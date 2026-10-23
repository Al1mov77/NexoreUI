"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dereference } from "@apidevtools/json-schema-ref-parser";
import { parse as parseYaml } from "yaml";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  FileQuestion,
  Link2,
  Loader2,
  Lock,
  Moon,
  RotateCcw,
  Search,
  Send,
  Sun,
  WifiOff,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   1. TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type Json = Record<string, unknown>;
type ThemeName = "light" | "dark";
type Transport = "fetch" | "axios" | "curl";
type FieldKind = "text" | "password" | "email" | "date" | "datetime" | "select" | "switch" | "number";
type FieldSource = "body" | "path" | "query";

const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

interface EndpointInfo {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  operationId?: string;
  tags: string[];
  operation: Json;
  pathItem: Json;
}

interface LoadedSpec {
  title: string;
  version: string;
  openapi: string;
  baseUrl: string;
  sourceUrl: string;
  isDemo: boolean;
  endpoints: EndpointInfo[];
  methodCounts: Partial<Record<HttpMethod, number>>;
}

interface FieldModel {
  /** Stable id: `${source}:${apiName}` */
  key: string;
  /** Safe JS identifier used as the form key */
  ident: string;
  /** Original property / parameter name in the API */
  apiName: string;
  source: FieldSource;
  kind: FieldKind;
  integer: boolean;
  label: string;
  placeholder: string;
  description: string;
  required: boolean;
  options: string[];
  optionsAreNumbers: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  defaultValue?: string | number | boolean;
}

interface SkippedField {
  name: string;
  source: FieldSource | "header" | "body";
  reason: string;
}

interface FormModel {
  endpoint: EndpointInfo;
  fields: FieldModel[];
  skipped: SkippedField[];
  notices: string[];
  hasBody: boolean;
}

interface FormSettings {
  columns: 1 | 2;
  order: string[];
  labels: Record<string, string>;
  placeholders: Record<string, string>;
}

type SpecErrorCode =
  | "invalid-url"
  | "network"
  | "timeout"
  | "http"
  | "parse"
  | "not-openapi"
  | "swagger2"
  | "refs"
  | "empty";

class SpecError extends Error {
  readonly code: SpecErrorCode;
  readonly hint: string;
  constructor(code: SpecErrorCode, message: string, hint: string) {
    super(message);
    this.name = "SpecError";
    this.code = code;
    this.hint = hint;
  }
}

type Phase =
  | { status: "idle" }
  | { status: "loading"; url: string }
  | { status: "error"; error: SpecError; url: string }
  | { status: "ready"; spec: LoadedSpec };

interface RequestPreview {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  body?: Record<string, unknown>;
}

type LiveValues = FieldValues;

/* ═══════════════════════════════════════════════════════════════════════════
   2. SMALL HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const isRecord = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const ACRONYMS = new Set(["id", "url", "uri", "api", "ip", "uuid", "sku", "iban", "vat"]);

function humanize(name: string): string {
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim();
  if (!spaced) return "Field";
  return spaced
    .split(/\s+/)
    .map((word) =>
      ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function toPascal(input: string): string {
  return input
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toKebab(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toIdent(name: string, used: Set<string>): string {
  let base = name.replace(/[^A-Za-z0-9_$]/g, "_");
  if (!base || /^\d/.test(base)) base = "_" + base;
  let candidate = base;
  let counter = 2;
  while (used.has(candidate)) {
    candidate = base + "_" + counter;
    counter += 1;
  }
  used.add(candidate);
  return candidate;
}

function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

function toNumber(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function shellQuote(value: string): string {
  return "'" + value.replace(/'/g, "'\\''") + "'";
}

function pluralize(count: number, word: string): string {
  return count + " " + word + (count === 1 ? "" : "s");
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. SPEC LOADING  (fetch → parse JSON/YAML → $ref resolution → endpoints)
   ═══════════════════════════════════════════════════════════════════════════ */

const FETCH_TIMEOUT_MS = 15000;

async function fetchSpecText(url: string, outerSignal?: AbortSignal): Promise<string> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, FETCH_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  outerSignal?.addEventListener("abort", onOuterAbort);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json, application/yaml;q=0.9, text/yaml;q=0.9, */*;q=0.5" },
    });
    if (!response.ok) {
      throw new SpecError(
        "http",
        "The server answered with HTTP " + response.status + (response.statusText ? " " + response.statusText : "") + ".",
        response.status === 404
          ? "Check the path — it should point straight at openapi.json or openapi.yaml."
          : response.status === 401 || response.status === 403
            ? "This document is protected. Public specs only, for now."
            : "Try again in a moment, or open the URL in a new tab to confirm it loads.",
      );
    }
    return await response.text();
  } catch (error) {
    if (error instanceof SpecError) throw error;
    if (timedOut) {
      throw new SpecError(
        "timeout",
        "The request took longer than " + FETCH_TIMEOUT_MS / 1000 + " seconds.",
        "The server may be slow or unreachable. Try again, or use a smaller spec.",
      );
    }
    if (outerSignal?.aborted) throw error;
    throw new SpecError(
      "network",
      "The browser couldn't load that URL.",
      "Most often the server doesn't send CORS headers (Access-Control-Allow-Origin), or you're offline. Use a spec that allows cross-origin requests, or host a copy next to your app.",
    );
  } finally {
    window.clearTimeout(timer);
    outerSignal?.removeEventListener("abort", onOuterAbort);
  }
}

function parseSpecText(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new SpecError("parse", "The response was empty.", "The URL answered successfully but returned no content.");
  }
  if (trimmed.startsWith("<")) {
    throw new SpecError(
      "parse",
      "That URL returned a web page, not an OpenAPI document.",
      "Link straight to the openapi.json / openapi.yaml file, not to the Swagger UI page.",
    );
  }
  try {
    return trimmed.startsWith("{") ? JSON.parse(trimmed) : parseYaml(trimmed);
  } catch (error) {
    throw new SpecError(
      "parse",
      "The document isn't valid JSON or YAML.",
      error instanceof Error ? error.message.split("\n")[0] : "Check the file for syntax errors.",
    );
  }
}

function resolveBaseUrl(doc: Json, sourceUrl: string): string {
  const servers = Array.isArray(doc.servers) ? doc.servers : [];
  const first = servers.find(isRecord);
  let raw = first && typeof first.url === "string" ? first.url : "/";
  if (first && isRecord(first.variables)) {
    const variables = first.variables;
    raw = raw.replace(/\{([^}]+)\}/g, (match, name: string) => {
      const variable = variables[name];
      return isRecord(variable) && typeof variable.default === "string" ? variable.default : match;
    });
  }
  try {
    const fallbackOrigin = typeof window !== "undefined" ? window.location.href : "https://api.example.com";
    const base = new URL(raw, sourceUrl || fallbackOrigin).toString();
    return base.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

export async function prepareSpec(raw: unknown, sourceUrl: string, isDemo: boolean): Promise<LoadedSpec> {
  if (!isRecord(raw)) {
    throw new SpecError(
      "not-openapi",
      "That file doesn't look like an OpenAPI document.",
      "Expected an object with an `openapi` version and a `paths` section.",
    );
  }
  if (typeof raw.swagger === "string") {
    throw new SpecError(
      "swagger2",
      "Swagger 2.0 documents aren't supported yet.",
      "This version reads OpenAPI 3.x. Swagger 2.0 support is planned for the next release.",
    );
  }
  if (typeof raw.openapi !== "string" || !raw.openapi.startsWith("3.")) {
    throw new SpecError(
      "not-openapi",
      "No OpenAPI 3 version found in this document.",
      "A valid document starts with `openapi: 3.0.x` or `3.1.x`.",
    );
  }

  let doc: Json;
  try {
    const dereferenced = await dereference(
      structuredClone(raw) as unknown as Parameters<typeof dereference>[0],
      { resolve: { external: false }, dereference: { circular: "ignore" } },
    );
    doc = dereferenced as unknown as Json;
  } catch (error) {
    throw new SpecError(
      "refs",
      "A $ref in this document couldn't be resolved.",
      error instanceof Error ? error.message.split("\n")[0] : "Check that every $ref points to an existing definition.",
    );
  }

  const paths = isRecord(doc.paths) ? doc.paths : {};
  const endpoints: EndpointInfo[] = [];
  const methodCounts: Partial<Record<HttpMethod, number>> = {};

  for (const path of Object.keys(paths)) {
    const pathItem = paths[path];
    if (!isRecord(pathItem)) continue;
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!isRecord(operation)) continue;
      endpoints.push({
        id: method + ":" + path,
        method,
        path,
        summary:
          typeof operation.summary === "string"
            ? operation.summary
            : typeof operation.description === "string"
              ? operation.description.split("\n")[0]
              : "",
        operationId: typeof operation.operationId === "string" ? operation.operationId : undefined,
        tags: Array.isArray(operation.tags) ? operation.tags.filter((t): t is string => typeof t === "string") : [],
        operation,
        pathItem,
      });
      methodCounts[method] = (methodCounts[method] ?? 0) + 1;
    }
  }

  if (endpoints.length === 0) {
    throw new SpecError(
      "empty",
      "This document has no endpoints.",
      "The `paths` section is missing or empty, so there is nothing to build a form from.",
    );
  }

  const info = isRecord(doc.info) ? doc.info : {};
  return {
    title: typeof info.title === "string" ? info.title : "Untitled API",
    version: typeof info.version === "string" ? info.version : "",
    openapi: raw.openapi,
    baseUrl: resolveBaseUrl(doc, sourceUrl),
    sourceUrl,
    isDemo,
    endpoints,
    methodCounts,
  };
}

async function loadSpecFromUrl(rawUrl: string, signal?: AbortSignal): Promise<LoadedSpec> {
  const trimmed = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new SpecError(
      "invalid-url",
      "That doesn't look like a valid URL.",
      "Use a full address such as https://petstore3.swagger.io/api/v3/openapi.json",
    );
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SpecError("invalid-url", "Only http and https links can be loaded.", "Paste a link that starts with https://");
  }
  if (typeof window !== "undefined" && window.location.protocol === "https:" && parsed.protocol === "http:") {
    throw new SpecError(
      "invalid-url",
      "This page is served over HTTPS, so the browser blocks plain http:// requests.",
      "Use the https:// version of the link.",
    );
  }
  const text = await fetchSpecText(parsed.toString(), signal);
  return prepareSpec(parseSpecText(text), parsed.toString(), false);
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. SCHEMA → FIELD MODEL
   ═══════════════════════════════════════════════════════════════════════════ */

interface FlatSchema {
  properties: Record<string, Json>;
  required: string[];
}

function schemaType(schema: Json): string | undefined {
  const type = schema.type;
  if (typeof type === "string") return type;
  if (Array.isArray(type)) {
    const first = type.find((t): t is string => typeof t === "string" && t !== "null");
    if (first) return first;
  }
  if (isRecord(schema.properties)) return "object";
  if (schema.items !== undefined) return "array";
  return undefined;
}

/** Merges `allOf` into one flat object schema. Returns a reason string when the shape isn't supported. */
function flattenObjectSchema(schema: Json): FlatSchema | string {
  if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
    return "The request body uses oneOf / anyOf, which arrives in the second wave.";
  }
  const merged: FlatSchema = { properties: {}, required: [] };
  const parts: Json[] = Array.isArray(schema.allOf) ? schema.allOf.filter(isRecord) : [];
  for (const part of parts) {
    const flat = flattenObjectSchema(part);
    if (typeof flat === "string") return flat;
    Object.assign(merged.properties, flat.properties);
    merged.required.push(...flat.required);
  }
  if (isRecord(schema.properties)) {
    for (const [name, value] of Object.entries(schema.properties)) {
      if (isRecord(value)) merged.properties[name] = value;
    }
  }
  if (Array.isArray(schema.required)) {
    merged.required.push(...schema.required.filter((r): r is string => typeof r === "string"));
  }
  const type = schemaType(schema);
  if (Object.keys(merged.properties).length === 0 && type && type !== "object") {
    return type === "array"
      ? "The request body is a list (array). Arrays arrive in the second wave."
      : "The request body is a plain " + type + " value, not an object with fields.";
  }
  return merged;
}

function exampleOf(schema: Json): string | number | undefined {
  const candidate = schema.example !== undefined ? schema.example : schema.default;
  return typeof candidate === "string" || typeof candidate === "number" ? candidate : undefined;
}

interface MapContext {
  used: Set<string>;
}

function mapSchemaToField(
  name: string,
  schema: Json,
  required: boolean,
  source: FieldSource,
  context: MapContext,
  description?: string,
): FieldModel | SkippedField {
  const type = schemaType(schema);
  const skip = (reason: string): SkippedField => ({ name, source, reason });

  if (schema.readOnly === true) return skip("Read-only property — the server fills it in, so it isn't sent.");
  if (typeof schema.$ref === "string") return skip("Recursive reference — nested structures arrive in the second wave.");
  if (type === "object") return skip("Nested object — nested forms arrive in the second wave.");
  if (type === "array") return skip("Array — list fields arrive in the second wave.");

  const format = typeof schema.format === "string" ? schema.format : "";
  const label = typeof schema.title === "string" && schema.title.trim() ? schema.title.trim() : humanize(name);
  const helper = (description ?? (typeof schema.description === "string" ? schema.description : ""))
    .replace(/\s+/g, " ")
    .trim();

  const base: FieldModel = {
    key: source + ":" + name,
    ident: "",
    apiName: name,
    source,
    kind: "text",
    integer: false,
    label,
    placeholder: "",
    description: helper.length > 140 ? helper.slice(0, 137) + "…" : helper,
    required: required || source === "path",
    options: [],
    optionsAreNumbers: false,
  };

  if (Array.isArray(schema.enum)) {
    const values = schema.enum.filter((v): v is string | number => typeof v === "string" || typeof v === "number");
    if (values.length === 0) return skip("Enum values aren't strings or numbers.");
    const field: FieldModel = {
      ...base,
      kind: "select",
      options: values.map(String),
      optionsAreNumbers: values.every((v) => typeof v === "number"),
      placeholder: "Select an option",
    };
    if (schema.default !== undefined && values.includes(schema.default as string | number)) {
      field.defaultValue = String(schema.default);
    }
    field.ident = toIdent(name, context.used);
    return field;
  }

  if (type === "boolean") {
    const field: FieldModel = { ...base, kind: "switch", required: false };
    if (schema.default === true) field.defaultValue = true;
    field.ident = toIdent(name, context.used);
    return field;
  }

  if (type === "integer" || type === "number") {
    const field: FieldModel = { ...base, kind: "number", integer: type === "integer" };
    if (typeof schema.minimum === "number") field.minimum = schema.minimum;
    if (typeof schema.maximum === "number") field.maximum = schema.maximum;
    if (typeof schema.default === "number") field.defaultValue = schema.default;
    const example = exampleOf(schema);
    field.placeholder = example !== undefined ? String(example) : field.minimum !== undefined ? String(field.minimum) : "0";
    field.ident = toIdent(name, context.used);
    return field;
  }

  if (type === "string") {
    if (format === "binary" || format === "byte") return skip("File / binary upload — arrives in the second wave.");
    const kind: FieldKind =
      format === "email" ? "email" : format === "date" ? "date" : format === "date-time" ? "datetime" : format === "password" ? "password" : "text";
    const field: FieldModel = { ...base, kind };
    if (typeof schema.minLength === "number") field.minLength = schema.minLength;
    if (typeof schema.maxLength === "number") field.maxLength = schema.maxLength;
    if (typeof schema.pattern === "string" && isValidRegex(schema.pattern)) field.pattern = schema.pattern;
    if (typeof schema.default === "string") field.defaultValue = schema.default;
    const example = exampleOf(schema);
    field.placeholder =
      kind === "email"
        ? typeof example === "string"
          ? example
          : "name@example.com"
        : kind === "password"
          ? "••••••••"
          : kind === "date" || kind === "datetime"
            ? ""
            : example !== undefined
              ? String(example)
              : "Enter " + label.toLowerCase();
    field.ident = toIdent(name, context.used);
    return field;
  }

  return skip(type ? "The type “" + type + "” isn't supported yet." : "No `type` declared, so the right input can't be chosen.");
}

const isSkipped = (value: FieldModel | SkippedField): value is SkippedField => "reason" in value;

export function buildFormModel(endpoint: EndpointInfo): FormModel {
  const fields: FieldModel[] = [];
  const skipped: SkippedField[] = [];
  const notices: string[] = [];
  const context: MapContext = { used: new Set<string>() };

  const parameters = new Map<string, Json>();
  for (const list of [endpoint.pathItem.parameters, endpoint.operation.parameters]) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (isRecord(item) && typeof item.name === "string" && typeof item.in === "string") {
        parameters.set(item.in + ":" + item.name, item);
      }
    }
  }

  parameters.forEach((param) => {
    const location = String(param.in);
    const name = String(param.name);
    if (location !== "path" && location !== "query") {
      skipped.push({
        name,
        source: "header",
        reason: location + " parameters aren't part of the form — add them to the request headers in the exported code.",
      });
      return;
    }
    let schema: Json = isRecord(param.schema) ? param.schema : {};
    if (!isRecord(param.schema) && isRecord(param.content)) {
      const media = Object.values(param.content).find(isRecord);
      if (media && isRecord(media.schema)) schema = media.schema;
    }
    const mapped = mapSchemaToField(
      name,
      schema,
      param.required === true,
      location,
      context,
      typeof param.description === "string" ? param.description : undefined,
    );
    if (isSkipped(mapped)) skipped.push(mapped);
    else fields.push(mapped);
  });

  let hasBody = false;
  const body = endpoint.operation.requestBody;
  if (isRecord(body) && isRecord(body.content)) {
    const types = Object.keys(body.content);
    const jsonType = types.find((t) => t === "application/json") ?? types.find((t) => /json/i.test(t));
    if (!jsonType) {
      if (types.length > 0) {
        notices.push(
          "This endpoint expects " + types.join(", ") + ". Only application/json bodies are supported right now.",
        );
      }
    } else {
      const media = body.content[jsonType];
      const schema = isRecord(media) && isRecord(media.schema) ? media.schema : null;
      if (!schema) {
        notices.push("The JSON request body has no schema, so there are no fields to build.");
      } else {
        const flat = flattenObjectSchema(schema);
        if (typeof flat === "string") {
          notices.push(flat);
        } else {
          hasBody = true;
          for (const [name, property] of Object.entries(flat.properties)) {
            const mapped = mapSchemaToField(name, property, flat.required.includes(name), "body", context);
            if (isSkipped(mapped)) skipped.push(mapped);
            else fields.push(mapped);
          }
        }
      }
    }
  }

  // Collisions between a body property and a path/query parameter: idents were already de-duplicated.
  return { endpoint, fields, skipped, notices, hasBody: hasBody && fields.some((f) => f.source === "body") };
}

export function defaultSettings(model: FormModel): FormSettings {
  return { columns: model.fields.length >= 5 ? 2 : 1, order: [], labels: {}, placeholders: {} };
}

export function resolveFields(model: FormModel, settings: FormSettings): FieldModel[] {
  const byKey = new Map(model.fields.map((f) => [f.key, f] as const));
  const ordered = [
    ...settings.order.filter((key) => byKey.has(key)),
    ...model.fields.map((f) => f.key).filter((key) => !settings.order.includes(key)),
  ];
  return ordered.map((key) => {
    const field = byKey.get(key) as FieldModel;
    const label = settings.labels[key]?.trim();
    return {
      ...field,
      label: label || field.label,
      placeholder: key in settings.placeholders ? settings.placeholders[key] : field.placeholder,
    };
  });
}

function describeField(field: FieldModel): string {
  const parts: string[] = [];
  if (field.kind === "number") {
    parts.push(field.integer ? "integer" : "number");
    if (field.minimum !== undefined || field.maximum !== undefined) {
      parts.push((field.minimum ?? "…") + "–" + (field.maximum ?? "…"));
    }
  } else if (field.kind === "select") {
    parts.push("enum · " + field.options.length);
  } else if (field.kind === "switch") {
    parts.push("boolean");
  } else {
    parts.push(field.kind === "text" ? "string" : field.kind);
    if (field.minLength !== undefined || field.maxLength !== undefined) {
      parts.push((field.minLength ?? 0) + "–" + (field.maxLength ?? "∞") + " chars");
    }
    if (field.pattern) parts.push("pattern");
  }
  return parts.join(" · ");
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. VALIDATION  (runtime zod schema — mirrored 1:1 by the code generator)
   ═══════════════════════════════════════════════════════════════════════════ */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const MSG = {
  required: (label: string) => label + " is required",
  minLength: (label: string, n: number) => label + " must be at least " + n + " characters",
  maxLength: (label: string, n: number) => label + " must be at most " + n + " characters",
  pattern: (label: string) => label + " doesn't match the expected format",
  email: "Enter a valid email address",
  date: "Pick a valid date",
  datetime: "Pick a valid date and time",
  select: "Select an option",
  number: "Enter a valid number",
  integer: "Must be a whole number",
  min: (label: string, n: number) => label + " must be at least " + n,
  max: (label: string, n: number) => label + " must be at most " + n,
};

function buildFieldSchema(field: FieldModel): z.ZodType {
  if (field.kind === "switch") return z.boolean();

  if (field.kind === "number") {
    let schema = z.number({ message: MSG.number });
    if (field.integer) schema = schema.int(MSG.integer);
    if (field.minimum !== undefined) schema = schema.min(field.minimum, MSG.min(field.label, field.minimum));
    if (field.maximum !== undefined) schema = schema.max(field.maximum, MSG.max(field.label, field.maximum));
    return field.required ? schema : schema.optional();
  }

  if (field.kind === "select") {
    const options = z.enum(field.options as [string, ...string[]], { message: MSG.select });
    return field.required ? options : options.optional().or(z.literal(""));
  }

  let schema = z.string();
  if (field.required) schema = schema.min(1, MSG.required(field.label));
  if (field.kind === "email") schema = schema.email(MSG.email);
  if (field.kind === "date") schema = schema.regex(DATE_RE, MSG.date);
  if (field.kind === "datetime") schema = schema.regex(DATETIME_RE, MSG.datetime);
  if (field.minLength !== undefined) schema = schema.min(field.minLength, MSG.minLength(field.label, field.minLength));
  if (field.maxLength !== undefined) schema = schema.max(field.maxLength, MSG.maxLength(field.label, field.maxLength));
  if (field.pattern) schema = schema.regex(new RegExp(field.pattern), MSG.pattern(field.label));
  return field.required ? schema : schema.optional().or(z.literal(""));
}

function buildFormSchema(fields: FieldModel[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) shape[field.ident] = buildFieldSchema(field);
  return z.object(shape);
}

function buildDefaults(fields: FieldModel[]): LiveValues {
  const defaults: LiveValues = {};
  for (const field of fields) {
    if (field.kind === "switch") defaults[field.ident] = field.defaultValue === true;
    else if (field.kind === "number") defaults[field.ident] = typeof field.defaultValue === "number" ? field.defaultValue : undefined;
    else defaults[field.ident] = typeof field.defaultValue === "string" ? field.defaultValue : "";
  }
  return defaults;
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. REQUEST BUILDING  (live preview — mirrored by the generated code)
   ═══════════════════════════════════════════════════════════════════════════ */

function valueToPayload(field: FieldModel, value: unknown): unknown {
  if (field.kind === "switch") return value === true;
  if (field.kind === "number") return typeof value === "number" ? value : undefined;
  if (value === undefined || value === null || value === "") return undefined;
  if (field.kind === "datetime") return new Date(String(value)).toISOString();
  if (field.kind === "select" && field.optionsAreNumbers) return Number(value);
  return value;
}

function buildRequestPreview(spec: LoadedSpec, endpoint: EndpointInfo, fields: FieldModel[], values: LiveValues): RequestPreview {
  let path = endpoint.path;
  const query = new URLSearchParams();
  const body: Record<string, unknown> = {};

  for (const field of fields) {
    const payload = valueToPayload(field, values[field.ident]);
    if (field.source === "path") {
      path = path.split("{" + field.apiName + "}").join(encodeURIComponent(String(payload ?? "")));
    } else if (field.source === "query") {
      if (payload !== undefined) query.set(field.apiName, String(payload));
    } else if (payload !== undefined) {
      body[field.apiName] = payload;
    }
  }

  const queryString = query.toString();
  const hasBody = fields.some((f) => f.source === "body");
  return {
    method: "POST",
    url: spec.baseUrl + path + (queryString ? "?" + queryString : ""),
    headers: hasBody ? { Accept: "application/json", "Content-Type": "application/json" } : { Accept: "application/json" },
    body: hasBody ? body : undefined,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. CODE GENERATION  (React Hook Form + zod; submit via fetch / axios / curl)
   ═══════════════════════════════════════════════════════════════════════════ */

function componentNameFor(endpoint: EndpointInfo): string {
  let base = endpoint.operationId ? toPascal(endpoint.operationId) : toPascal(endpoint.method + " " + endpoint.path.replace(/[{}]/g, ""));
  if (!base || /^\d/.test(base)) base = "Generated" + base;
  return base.endsWith("Form") ? base : base + "Form";
}

const q = (value: string) => JSON.stringify(value);

function jsxAttr(name: string, value: string): string {
  return /["\\\n{}<>&]/.test(value) ? name + "={" + q(value) + "}" : name + "=" + q(value);
}

function jsxText(value: string): string {
  return /[{}<>&"]/.test(value) ? "{" + q(value) + "}" : value;
}

function zodSource(field: FieldModel): string {
  if (field.kind === "switch") return "z.boolean()";

  if (field.kind === "number") {
    let source = "z.number({ message: " + q(MSG.number) + " })";
    if (field.integer) source += ".int(" + q(MSG.integer) + ")";
    if (field.minimum !== undefined) source += ".min(" + field.minimum + ", " + q(MSG.min(field.label, field.minimum)) + ")";
    if (field.maximum !== undefined) source += ".max(" + field.maximum + ", " + q(MSG.max(field.label, field.maximum)) + ")";
    return field.required ? source : source + ".optional()";
  }

  if (field.kind === "select") {
    const source = "z.enum([" + field.options.map(q).join(", ") + "], { message: " + q(MSG.select) + " })";
    return field.required ? source : source + '.optional().or(z.literal(""))';
  }

  let source = "z.string()";
  if (field.required) source += ".min(1, " + q(MSG.required(field.label)) + ")";
  if (field.kind === "email") source += ".email(" + q(MSG.email) + ")";
  if (field.kind === "date") source += ".regex(/^\\d{4}-\\d{2}-\\d{2}$/, " + q(MSG.date) + ")";
  if (field.kind === "datetime") source += ".regex(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}/, " + q(MSG.datetime) + ")";
  if (field.minLength !== undefined) source += ".min(" + field.minLength + ", " + q(MSG.minLength(field.label, field.minLength)) + ")";
  if (field.maxLength !== undefined) source += ".max(" + field.maxLength + ", " + q(MSG.maxLength(field.label, field.maxLength)) + ")";
  if (field.pattern) source += ".regex(new RegExp(" + q(field.pattern) + "), " + q(MSG.pattern(field.label)) + ")";
  return field.required ? source : source + '.optional().or(z.literal(""))';
}

function defaultSource(field: FieldModel): string | null {
  if (field.kind === "switch") return field.defaultValue === true ? "true" : "false";
  if (field.kind === "number") return typeof field.defaultValue === "number" ? String(field.defaultValue) : null;
  if (field.kind === "select") return typeof field.defaultValue === "string" ? q(field.defaultValue) : null;
  return typeof field.defaultValue === "string" ? q(field.defaultValue) : '""';
}

function autoCompleteFor(field: FieldModel): string | null {
  const name = field.apiName.toLowerCase();
  if (field.kind === "email") return "email";
  if (field.kind === "password") return "current-password";
  if (field.kind === "text" && /^(full)?name$/.test(name)) return "name";
  if (field.kind === "text" && /^(user)?name$/.test(name)) return "username";
  if (field.kind === "text" && /phone|tel/.test(name)) return "tel";
  return null;
}

function fieldJsx(field: FieldModel, prefix: string): string[] {
  const id = prefix + "-" + field.ident;
  const err = "errors." + field.ident;
  const shellOpen = (extra = "") =>
    "<FieldShell id=" + q(id) + " " + jsxAttr("label", field.label) + (field.required ? " required" : "") +
    (field.description ? " " + jsxAttr("hint", field.description) : "") +
    " error={" + err + "?.message}" + extra + ">";
  const common =
    "id=" + q(id) + " aria-invalid={" + err + " ? true : undefined} aria-describedby=" + q(id + "-msg");

  if (field.kind === "switch") {
    return [
      "<div className=\"sfb-field\">",
      "  <label className=\"sfb-switch\" htmlFor=" + q(id) + ">",
      "    <input " + common + " type=\"checkbox\" role=\"switch\" {...register(" + q(field.ident) + ")} />",
      "    <span className=\"sfb-switch-track\" aria-hidden=\"true\">",
      "      <span className=\"sfb-switch-thumb\" />",
      "    </span>",
      "    <span className=\"sfb-switch-text\">" + jsxText(field.label) + "</span>",
      "  </label>",
      "  <div className=\"sfb-msg\" id=" + q(id + "-msg") + ">",
      field.description
        ? "    <p className=\"sfb-hint\">" + jsxText(field.description) + "</p>"
        : "    {null}",
      "  </div>",
      "</div>",
    ];
  }

  if (field.kind === "select") {
    return [
      shellOpen(),
      "  <div className=\"sfb-control sfb-control--select\">",
      "    <select className=\"sfb-input\" " + common + " {...register(" + q(field.ident) + ")}>",
      "      <option value=\"\">" + jsxText(field.placeholder || "Select an option") + "</option>",
      ...field.options.map((option) => "      <option value=" + q(option) + ">" + jsxText(option) + "</option>"),
      "    </select>",
      "  </div>",
      "</FieldShell>",
    ];
  }

  const attrs: string[] = [];
  if (field.kind === "number") {
    attrs.push('type="number"', 'inputMode="' + (field.integer ? "numeric" : "decimal") + '"');
    attrs.push('step="' + (field.integer ? "1" : "any") + '"');
    if (field.minimum !== undefined) attrs.push("min={" + field.minimum + "}");
    if (field.maximum !== undefined) attrs.push("max={" + field.maximum + "}");
  } else {
    attrs.push('type="' + (field.kind === "datetime" ? "datetime-local" : field.kind === "text" ? "text" : field.kind) + '"');
    if (field.maxLength !== undefined) attrs.push("maxLength={" + field.maxLength + "}");
  }
  if (field.placeholder && field.kind !== "date" && field.kind !== "datetime") attrs.push(jsxAttr("placeholder", field.placeholder));
  const autoComplete = autoCompleteFor(field);
  if (autoComplete) attrs.push('autoComplete="' + autoComplete + '"');
  const registerCall =
    field.kind === "number" ? "register(" + q(field.ident) + ", { setValueAs: toNumber })" : "register(" + q(field.ident) + ")";

  return [
    shellOpen(),
    "  <div className=\"sfb-control\">",
    "    <input className=\"sfb-input\" " + common + " " + attrs.join(" ") + " {..." + registerCall + "} />",
    "  </div>",
    "</FieldShell>",
  ];
}

function bodyValueSource(field: FieldModel): string {
  const v = "values." + field.ident;
  if (field.kind === "switch") return v;
  if (field.kind === "number") return v;
  if (field.kind === "datetime") return v + " ? new Date(" + v + ").toISOString() : undefined";
  if (field.kind === "select" && field.optionsAreNumbers) return v + " ? Number(" + v + ") : undefined";
  return field.required ? v : v + " || undefined";
}

function buildRequestSource(fields: FieldModel[], hasBody: boolean): string[] {
  const lines: string[] = [];
  lines.push("function buildRequest(values: FormValues) {");
  const pathFields = fields.filter((f) => f.source === "path");
  const queryFields = fields.filter((f) => f.source === "query");
  const bodyFields = fields.filter((f) => f.source === "body");

  let pathExpr = "ENDPOINT_PATH";
  for (const field of pathFields) {
    pathExpr += ".replace(" + q("{" + field.apiName + "}") + ", encodeURIComponent(String(values." + field.ident + ")))";
  }
  lines.push("  const path = " + pathExpr + ";");

  if (queryFields.length > 0) {
    lines.push("  const query = new URLSearchParams();");
    for (const field of queryFields) {
      const v = "values." + field.ident;
      if (field.kind === "switch") lines.push("  query.set(" + q(field.apiName) + ", String(" + v + "));");
      else if (field.kind === "number") lines.push("  if (" + v + " !== undefined) query.set(" + q(field.apiName) + ", String(" + v + "));");
      else lines.push("  if (" + v + ") query.set(" + q(field.apiName) + ", String(" + v + "));");
    }
    lines.push('  const search = query.toString();');
    lines.push('  const url = API_BASE_URL + path + (search ? "?" + search : "");');
  } else {
    lines.push("  const url = API_BASE_URL + path;");
  }

  if (hasBody && bodyFields.length > 0) {
    lines.push("  const body = {");
    for (const field of bodyFields) lines.push("    " + q(field.apiName) + ": " + bodyValueSource(field) + ",");
    lines.push("  };");
    lines.push("  return { url, body };");
  } else {
    lines.push("  return { url, body: undefined };");
  }
  lines.push("}");
  return lines;
}

interface GenerateArgs {
  model: FormModel;
  spec: LoadedSpec;
  fields: FieldModel[];
  columns: 1 | 2;
  transport: "fetch" | "axios";
  useClient: boolean;
}

export function generateComponentSource({ model, spec, fields, columns, transport, useClient }: GenerateArgs): string {
  const name = componentNameFor(model.endpoint);
  const valuesType = name.replace(/Form$/, "") + "FormValues";
  const prefix = toKebab(name.replace(/Form$/, "")) || "form";
  const hasBody = fields.some((f) => f.source === "body");
  const out: string[] = [];

  if (useClient) out.push('"use client";', "");
  out.push('import { useState, type ReactNode } from "react";');
  out.push('import { useForm } from "react-hook-form";');
  out.push('import { zodResolver } from "@hookform/resolvers/zod";');
  out.push('import { z } from "zod";');
  if (transport === "axios") out.push('import axios from "axios";');
  out.push("");
  out.push("/**");
  out.push(" * " + model.endpoint.method.toUpperCase() + " " + model.endpoint.path + (model.endpoint.summary ? " — " + model.endpoint.summary.replace(/\*\//g, "* /") : ""));
  out.push(" * Generated by NexoreUI · Swagger → Form Builder");
  out.push(" * Source: " + (spec.isDemo ? "built-in demo spec" : spec.sourceUrl));
  out.push(" */");
  out.push("const API_BASE_URL = " + q(spec.baseUrl) + ";");
  out.push("const ENDPOINT_PATH = " + q(model.endpoint.path) + ";");
  out.push("");
  out.push("const formSchema = z.object({");
  for (const field of fields) out.push("  " + field.ident + ": " + zodSource(field) + ",");
  out.push("});");
  out.push("");
  out.push("export type " + valuesType + " = z.infer<typeof formSchema>;");
  out.push("type FormValues = " + valuesType + ";");
  out.push("");
  out.push("export interface SubmitResult {");
  out.push("  status: number;");
  out.push("  body: string;");
  out.push("}");
  out.push("");
  out.push("export interface " + name + "Props {");
  out.push('  /** "auto" follows the visitor\'s system preference. */');
  out.push('  theme?: "auto" | "light" | "dark";');
  out.push("  onSuccess?: (result: SubmitResult) => void;");
  out.push("}");
  out.push("");
  if (fields.some((f) => f.kind === "number")) {
    out.push("function toNumber(value: unknown): number | undefined {");
    out.push('  if (value === "" || value === null || value === undefined) return undefined;');
    out.push("  const parsed = Number(value);");
    out.push("  return Number.isNaN(parsed) ? undefined : parsed;");
    out.push("}");
    out.push("");
  }
  out.push(...buildRequestSource(fields, hasBody));
  out.push("");

  out.push("async function submitForm(values: FormValues): Promise<SubmitResult> {");
  out.push("  const { url, body } = buildRequest(values);");
  if (transport === "fetch") {
    out.push("  const response = await fetch(url, {");
    out.push('    method: "POST",');
    out.push("    headers: {");
    out.push('      Accept: "application/json",');
    if (hasBody) out.push('      "Content-Type": "application/json",');
    out.push("    },");
    if (hasBody) out.push("    body: JSON.stringify(body),");
    out.push("  });");
    out.push("  const text = await response.text();");
    out.push("  if (!response.ok) {");
    out.push('    throw new Error("Request failed with status " + response.status + (text ? ": " + text.slice(0, 200) : ""));');
    out.push("  }");
    out.push("  return { status: response.status, body: text };");
  } else {
    out.push("  const response = await axios.post<string>(url, body, {");
    out.push('    headers: { Accept: "application/json" },');
    out.push('    responseType: "text",');
    out.push("    transformResponse: (data: string) => data,");
    out.push("  });");
    out.push("  return { status: response.status, body: response.data };");
  }
  out.push("}");
  out.push("");
  out.push("function getErrorMessage(error: unknown): string {");
  if (transport === "axios") {
    out.push("  if (axios.isAxiosError(error)) {");
    out.push("    return error.response");
    out.push('      ? "Request failed with status " + error.response.status');
    out.push('      : "Network error — check your connection and the API\'s CORS settings.";');
    out.push("  }");
    out.push('  return error instanceof Error ? error.message : "Something went wrong.";');
  } else {
    out.push("  if (error instanceof TypeError) {");
    out.push('    return "Network error — check your connection and the API\'s CORS settings.";');
    out.push("  }");
    out.push('  return error instanceof Error ? error.message : "Something went wrong.";');
  }
  out.push("}");
  out.push("");

  out.push("interface FieldShellProps {");
  out.push("  id: string;");
  out.push("  label: string;");
  out.push("  required?: boolean;");
  out.push("  hint?: string;");
  out.push("  error?: string;");
  out.push("  children: ReactNode;");
  out.push("}");
  out.push("");
  out.push("function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {");
  out.push("  return (");
  out.push('    <div className="sfb-field">');
  out.push('      <label className="sfb-label" htmlFor={id}>');
  out.push("        {label}");
  out.push('        {required ? <span className="sfb-req" aria-hidden="true"> *</span> : null}');
  out.push("      </label>");
  out.push("      {children}");
  out.push('      <div className="sfb-msg" id={id + "-msg"}>');
  out.push("        {error ? (");
  out.push('          <p className="sfb-error" role="alert">{error}</p>');
  out.push("        ) : hint ? (");
  out.push('          <p className="sfb-hint">{hint}</p>');
  out.push("        ) : null}");
  out.push("      </div>");
  out.push("    </div>");
  out.push("  );");
  out.push("}");
  out.push("");

  out.push("type ResultState =");
  out.push("  | { ok: true; status: number; body: string }");
  out.push("  | { ok: false; message: string }");
  out.push("  | null;");
  out.push("");
  out.push("export default function " + name + "({ theme = \"auto\", onSuccess }: " + name + "Props) {");
  out.push("  const [result, setResult] = useState<ResultState>(null);");
  out.push("  const {");
  out.push("    register,");
  out.push("    handleSubmit,");
  out.push("    reset,");
  out.push("    formState: { errors, isSubmitting },");
  out.push("  } = useForm<FormValues>({");
  out.push("    resolver: zodResolver(formSchema),");
  out.push("    defaultValues: {");
  for (const field of fields) {
    const def = defaultSource(field);
    if (def !== null) out.push("      " + field.ident + ": " + def + ",");
  }
  out.push("    },");
  out.push('    mode: "onTouched",');
  out.push("  });");
  out.push("");
  out.push("  async function onSubmit(values: FormValues) {");
  out.push("    setResult(null);");
  out.push("    try {");
  out.push("      const response = await submitForm(values);");
  out.push("      setResult({ ok: true, status: response.status, body: response.body });");
  out.push("      onSuccess?.(response);");
  out.push("    } catch (error) {");
  out.push("      setResult({ ok: false, message: getErrorMessage(error) });");
  out.push("    }");
  out.push("  }");
  out.push("");
  out.push("  return (");
  out.push('    <div className="sfb-scope" data-theme={theme}>');
  out.push("      <style>{styles}</style>");
  out.push("      <form");
  out.push('        className="sfb-form"');
  out.push('        data-columns="' + columns + '"');
  out.push("        noValidate");
  out.push("        onSubmit={handleSubmit(onSubmit)}");
  out.push("      >");
  for (const field of fields) {
    for (const line of fieldJsx(field, prefix)) out.push("        " + line);
  }
  out.push('        <div className="sfb-actions">');
  out.push('          <button type="submit" className="sfb-submit" disabled={isSubmitting}>');
  out.push('            {isSubmitting ? <span className="sfb-spinner" aria-hidden="true" /> : null}');
  out.push('            {isSubmitting ? "Sending…" : "Submit"}');
  out.push("          </button>");
  out.push("          <button");
  out.push('            type="button"');
  out.push('            className="sfb-reset"');
  out.push("            onClick={() => {");
  out.push("              reset();");
  out.push("              setResult(null);");
  out.push("            }}");
  out.push("          >");
  out.push("            Reset");
  out.push("          </button>");
  out.push("        </div>");
  out.push("        {result?.ok === true ? (");
  out.push('          <div className="sfb-result sfb-result--ok" role="status">');
  out.push('            <p className="sfb-result-title">Sent — HTTP {result.status}</p>');
  out.push('            {result.body ? <pre className="sfb-result-body">{result.body.slice(0, 600)}</pre> : null}');
  out.push("          </div>");
  out.push("        ) : null}");
  out.push("        {result?.ok === false ? (");
  out.push('          <div className="sfb-result sfb-result--error" role="alert">');
  out.push('            <p className="sfb-result-title">{result.message}</p>');
  out.push("          </div>");
  out.push("        ) : null}");
  out.push("      </form>");
  out.push("    </div>");
  out.push("  );");
  out.push("}");
  out.push("");
  out.push("/* Scoped, dependency-free styles with light & dark themes. Replace with your own CSS if you prefer. */");
  out.push("const styles = `" + FORM_CSS + "`;");
  out.push("");
  return out.join("\n");
}

function sampleValueFor(field: FieldModel): unknown {
  if (field.kind === "switch") return field.defaultValue === true;
  if (field.kind === "number") {
    if (typeof field.defaultValue === "number") return field.defaultValue;
    let value = field.minimum ?? 1;
    if (field.maximum !== undefined && value > field.maximum) value = field.maximum;
    return field.integer ? Math.round(value) : value;
  }
  if (field.kind === "select") {
    const chosen = typeof field.defaultValue === "string" ? field.defaultValue : field.options[0];
    return field.optionsAreNumbers ? Number(chosen) : chosen;
  }
  if (field.kind === "email") return "user@example.com";
  if (field.kind === "date") return "2026-01-31";
  if (field.kind === "datetime") return "2026-01-31T09:30:00.000Z";
  if (typeof field.defaultValue === "string") return field.defaultValue;
  if (field.pattern) return "REPLACE_ME";
  const base = field.apiName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "value";
  let text = "sample-" + base;
  if (field.minLength !== undefined && text.length < field.minLength) text = text.padEnd(field.minLength, "x");
  if (field.maxLength !== undefined && text.length > field.maxLength) text = text.slice(0, field.maxLength);
  return text;
}

export function generateCurlScript(model: FormModel, spec: LoadedSpec, fields: FieldModel[]): string {
  const bodyFields = fields.filter((f) => f.source === "body");
  let path = model.endpoint.path;
  const query = new URLSearchParams();
  const body: Record<string, unknown> = {};
  for (const field of fields) {
    const value = sampleValueFor(field);
    if (field.source === "path") path = path.split("{" + field.apiName + "}").join(encodeURIComponent(String(value)));
    else if (field.source === "query") query.set(field.apiName, String(value));
    else body[field.apiName] = value;
  }
  const search = query.toString();
  const url = spec.baseUrl + path + (search ? "?" + search : "");
  const lines: string[] = [
    "#!/usr/bin/env bash",
    "# " + model.endpoint.method.toUpperCase() + " " + model.endpoint.path + (model.endpoint.summary ? " — " + model.endpoint.summary : ""),
    "# Generated by NexoreUI · Swagger → Form Builder",
    "# Replace the sample values below with real ones before running.",
    "set -euo pipefail",
    "",
    "curl --silent --show-error --include \\",
    "  --request POST " + shellQuote(url) + " \\",
    "  --header 'Accept: application/json'" + (bodyFields.length > 0 ? " \\" : ""),
  ];
  if (bodyFields.length > 0) {
    lines.push("  --header 'Content-Type: application/json' \\");
    lines.push("  --data-raw " + shellQuote(JSON.stringify(body, null, 2)));
  }
  lines.push("");
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. DEMO SPEC  (works offline; exercises every supported field type + $ref)
   ═══════════════════════════════════════════════════════════════════════════ */

export const DEMO_SPEC: Json = {
  openapi: "3.0.3",
  info: { title: "Northwind Accounts API", version: "1.4.0" },
  servers: [{ url: "https://api.northwind.example/v1" }],
  paths: {
    "/accounts": {
      get: { summary: "List accounts", responses: { "200": { description: "OK" } } },
      post: {
        operationId: "createAccount",
        summary: "Create an account",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/NewAccount" } } },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/accounts/{accountId}": {
      delete: { summary: "Delete an account", responses: { "204": { description: "Gone" } } },
    },
    "/invoices/{invoiceId}/payments": {
      post: {
        operationId: "recordPayment",
        summary: "Record a payment against an invoice",
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            description: "Invoice number, e.g. 20481.",
            schema: { type: "integer", minimum: 1 },
          },
          { name: "notify", in: "query", description: "Email the customer a receipt.", schema: { type: "boolean", default: true } },
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Payment" } } },
        },
        responses: { "201": { description: "Recorded" } },
      },
    },
    "/support/tickets": {
      post: {
        operationId: "openTicket",
        summary: "Open a support ticket",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Contact" },
                  {
                    type: "object",
                    required: ["subject", "priority"],
                    properties: {
                      subject: { type: "string", minLength: 5, maxLength: 80, example: "Cannot export invoices" },
                      priority: { $ref: "#/components/schemas/Priority" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: { "201": { description: "Opened" } },
      },
    },
    "/imports": {
      post: {
        summary: "Upload a CSV import",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { type: "object", properties: { file: { type: "string", format: "binary" } } },
            },
          },
        },
        responses: { "202": { description: "Accepted" } },
      },
    },
  },
  components: {
    schemas: {
      Priority: { type: "string", enum: ["low", "normal", "high", "urgent"], default: "normal" },
      Contact: {
        type: "object",
        required: ["email"],
        properties: {
          name: { type: "string", maxLength: 60 },
          email: { type: "string", format: "email", description: "We reply to this address." },
        },
      },
      Address: {
        type: "object",
        properties: { street: { type: "string" }, city: { type: "string" } },
      },
      NewAccount: {
        type: "object",
        required: ["fullName", "email", "username", "plan"],
        properties: {
          id: { type: "string", readOnly: true },
          fullName: { type: "string", minLength: 2, maxLength: 60, description: "As it appears on invoices.", example: "Ada Lovelace" },
          email: { type: "string", format: "email" },
          username: {
            type: "string",
            pattern: "^[a-z0-9_]{3,16}$",
            description: "3–16 characters: lowercase letters, digits and underscores.",
            example: "ada_l",
          },
          birthDate: { type: "string", format: "date" },
          plan: { type: "string", enum: ["starter", "pro", "enterprise"], description: "Billing tier." },
          seats: { type: "integer", minimum: 1, maximum: 500, default: 5, description: "Between 1 and 500 seats." },
          newsletter: { type: "boolean", default: true, title: "Product newsletter" },
          notes: { type: "string", maxLength: 280, description: "Anything the success team should know." },
          address: { $ref: "#/components/schemas/Address" },
          tags: { type: "array", items: { type: "string" } },
        },
      },
      Payment: {
        type: "object",
        required: ["amount", "method"],
        properties: {
          amount: { type: "number", minimum: 0.01, maximum: 1000000, example: 249.5 },
          method: { type: "string", enum: ["card", "wire", "cash"] },
          paidAt: { type: "string", format: "date-time" },
          reference: { type: "string", maxLength: 40 },
        },
      },
    },
  },
};

const SAMPLE_LINKS: { id: string; label: string; url: string }[] = [
  { id: "petstore-json", label: "Petstore 3 · JSON", url: "https://petstore3.swagger.io/api/v3/openapi.json" },
  { id: "petstore-yaml", label: "Petstore 3 · YAML", url: "https://petstore3.swagger.io/api/v3/openapi.yaml" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   9. STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT_STACK =
  'var(--font-inter, Inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
const MONO_STACK =
  'var(--font-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

const FORM_TOKENS_LIGHT =
  "--f-text:#16170f;--f-muted:#4a4c42;--f-faint:#666a5d;--f-surface:#ffffff;--f-input-bg:#fbfbf9;--f-input-border:#8f9288;--f-input-border-hover:#5d6055;--f-divider:rgba(28,27,20,.1);--f-accent:#c9f35c;--f-accent-ink:#14180a;--f-accent-edge:rgba(62,98,0,.55);--f-focus:#3b6600;--f-danger:#b3261e;--f-danger-bg:#fdecea;--f-ok:#1b6e35;--f-ok-bg:#e8f6ec;--f-spec:rgba(255,255,255,.9);--f-shadow:rgba(30,28,15,.14);--f-switch-off:#a9ac9f;--f-pre-bg:#f3f2ee;color-scheme:light;";
const FORM_TOKENS_DARK =
  "--f-text:#f4f5f7;--f-muted:#aab1bc;--f-faint:#838b98;--f-surface:#101216;--f-input-bg:#0a0c0f;--f-input-border:#6a707b;--f-input-border-hover:#98a0ac;--f-divider:rgba(255,255,255,.08);--f-accent:#c9f35c;--f-accent-ink:#10140a;--f-accent-edge:rgba(255,255,255,.3);--f-focus:#c9f35c;--f-danger:#ff8b84;--f-danger-bg:rgba(255,99,90,.1);--f-ok:#7ee08f;--f-ok-bg:rgba(126,224,143,.09);--f-spec:rgba(255,255,255,.1);--f-shadow:rgba(0,0,0,.6);--f-switch-off:#3a3f48;--f-pre-bg:#0a0c0f;color-scheme:dark;";

/** Shared by the live preview AND the exported component (kept free of backticks and `${`). */
const FORM_CSS = `
.sfb-scope{${FORM_TOKENS_LIGHT}}
.sfb-scope[data-theme="dark"]{${FORM_TOKENS_DARK}}
@media (prefers-color-scheme: dark){.sfb-scope[data-theme="auto"]{${FORM_TOKENS_DARK}}}
.sfb-scope,.sfb-scope *,.sfb-scope *::before,.sfb-scope *::after{box-sizing:border-box}
.sfb-scope{container-type:inline-size;container-name:sfb-form;font-family:${FONT_STACK};font-size:14px;line-height:1.45;color:var(--f-text);-webkit-font-smoothing:antialiased}
.sfb-form{display:grid;grid-template-columns:minmax(0,1fr);column-gap:20px;row-gap:2px}
.sfb-form[data-columns="2"]{grid-template-columns:repeat(2,minmax(0,1fr))}
@container sfb-form (max-width:520px){.sfb-form[data-columns="2"]{grid-template-columns:minmax(0,1fr)}}
.sfb-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.sfb-label{font-size:13px;font-weight:600;letter-spacing:-.006em;color:var(--f-text)}
.sfb-req{color:var(--f-faint);font-weight:500}
.sfb-control{position:relative;display:block}
.sfb-control::after{content:"";position:absolute;inset:-4px;border-radius:14px;border:2px solid var(--f-focus);opacity:0;transform:scale(.985);pointer-events:none;transition:opacity .16s ease,transform .24s cubic-bezier(.2,.8,.2,1)}
.sfb-control:focus-within::after{opacity:.9;transform:none}
.sfb-control:has([aria-invalid="true"])::after{border-color:var(--f-danger)}
.sfb-input{display:block;width:100%;height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--f-input-border);background:var(--f-input-bg);color:var(--f-text);font:inherit;font-size:14px;outline:none;box-shadow:inset 0 1px 2px rgba(0,0,0,.08);-webkit-appearance:none;appearance:none}
.sfb-input::placeholder{color:var(--f-faint);opacity:1}
.sfb-control:hover .sfb-input{border-color:var(--f-input-border-hover)}
.sfb-input[aria-invalid="true"]{border-color:var(--f-danger)}
.sfb-input[type="number"]{font-variant-numeric:tabular-nums;-moz-appearance:textfield}
.sfb-control--select::before{content:"";position:absolute;right:16px;top:50%;width:7px;height:7px;margin-top:-6px;border-right:2px solid var(--f-muted);border-bottom:2px solid var(--f-muted);transform:rotate(45deg);pointer-events:none;z-index:1}
.sfb-control--select .sfb-input{padding-right:40px;cursor:pointer}
.sfb-msg{min-height:20px;font-size:12.5px;line-height:1.45}
.sfb-hint{margin:0;color:var(--f-faint)}
.sfb-error{margin:0;display:flex;gap:7px;align-items:flex-start;color:var(--f-danger);font-weight:550;animation:sfb-error-in .28s cubic-bezier(.2,.8,.2,1) both}
.sfb-error::before{content:"!";flex:none;display:grid;place-items:center;width:15px;height:15px;margin-top:1px;border-radius:50%;background:var(--f-danger);color:var(--f-surface);font-size:10px;font-weight:800;line-height:1}
.sfb-control:has([aria-invalid="true"]) .sfb-input{animation:sfb-nudge .34s cubic-bezier(.36,.07,.19,.97) both}
.sfb-switch{position:relative;display:inline-flex;align-items:center;gap:12px;min-height:44px;cursor:pointer;align-self:flex-start}
.sfb-switch input{position:absolute;opacity:0;width:44px;height:26px;margin:0;cursor:pointer}
.sfb-switch-track{position:relative;flex:none;width:46px;height:28px;border-radius:999px;background:var(--f-switch-off);box-shadow:inset 0 1px 2px rgba(0,0,0,.25)}
.sfb-switch-track::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--f-accent);opacity:0;transition:opacity .2s ease}
.sfb-switch-thumb{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .3s cubic-bezier(.3,1.35,.5,1)}
.sfb-switch input:checked + .sfb-switch-track::before{opacity:1}
.sfb-switch input:checked + .sfb-switch-track .sfb-switch-thumb{transform:translateX(18px)}
.sfb-switch input:focus-visible + .sfb-switch-track{outline:2px solid var(--f-focus);outline-offset:3px}
.sfb-switch-text{font-size:14px;font-weight:600}
.sfb-actions{grid-column:1/-1;display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:10px}
.sfb-submit{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:46px;padding:0 24px;border-radius:12px;border:1px solid var(--f-accent-edge);background:var(--f-accent);color:var(--f-accent-ink);font:inherit;font-size:14px;font-weight:650;letter-spacing:-.01em;cursor:pointer;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 8px 20px -10px rgba(90,130,0,.6);transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.sfb-submit::before{content:"";position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .18s ease;pointer-events:none}
.sfb-submit:hover:not(:disabled)::before{opacity:.28}
.sfb-submit:hover:not(:disabled){transform:translateY(-1px)}
.sfb-submit:active:not(:disabled){transform:scale(.96)}
.sfb-submit:focus-visible,.sfb-reset:focus-visible{outline:2px solid var(--f-focus);outline-offset:3px}
.sfb-submit:disabled{cursor:progress;opacity:.75}
.sfb-reset{height:46px;padding:0 14px;border:0;background:none;color:var(--f-muted);font:inherit;font-size:14px;font-weight:600;border-radius:10px;cursor:pointer}
.sfb-reset:hover{color:var(--f-text)}
.sfb-spinner{width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:sfb-spin .7s linear infinite}
.sfb-result{grid-column:1/-1;margin-top:6px;padding:14px 16px;border-radius:12px;border:1px solid;animation:sfb-error-in .32s cubic-bezier(.2,.8,.2,1) both}
.sfb-result--ok{background:var(--f-ok-bg);border-color:color-mix(in srgb,var(--f-ok) 45%,transparent);color:var(--f-ok)}
.sfb-result--error{background:var(--f-danger-bg);border-color:color-mix(in srgb,var(--f-danger) 45%,transparent);color:var(--f-danger)}
.sfb-result-title{margin:0;font-size:13.5px;font-weight:650}
.sfb-result-body{margin:10px 0 0;padding:12px;max-height:180px;overflow:auto;border-radius:8px;background:var(--f-pre-bg);color:var(--f-text);font-family:${MONO_STACK};font-size:12px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
@keyframes sfb-error-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
@keyframes sfb-nudge{0%,100%{transform:none}25%{transform:translateX(-3px)}60%{transform:translateX(2px)}}
@keyframes sfb-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.sfb-scope *,.sfb-scope *::before,.sfb-scope *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;

const SHELL_TOKENS_LIGHT =
  "--s-bg:#f3f2ee;--s-bg-2:#eae8e1;--s-surface:#fcfcfa;--s-surface-2:#f6f5f1;--s-surface-3:#eceae3;--s-border:rgba(28,27,20,.1);--s-border-2:rgba(28,27,20,.2);--s-text:#16170f;--s-text-2:#4a4c42;--s-text-3:#686b5f;--s-accent:#c9f35c;--s-accent-ink:#14180a;--s-accent-edge:rgba(62,98,0,.55);--s-accent-text:#3b6600;--s-accent-soft:rgba(110,160,0,.14);--s-spec:rgba(255,255,255,.95);--s-rim:rgba(255,255,255,1);--s-shadow:rgba(40,36,20,.18);--s-shadow-sm:rgba(40,36,20,.1);--s-danger:#b3261e;--s-danger-bg:#fdecea;--s-ok:#1b6e35;--s-code-bg:#f7f6f2;--s-code-text:#2a2c22;--s-dot:rgba(28,27,20,.12);--s-method-post:#3b6600;--s-method-post-bg:rgba(110,160,0,.16);--s-scrim:rgba(22,23,15,.42);color-scheme:light;";
const SHELL_TOKENS_DARK =
  "--s-bg:#08090b;--s-bg-2:#0d0f12;--s-surface:#101216;--s-surface-2:#15181d;--s-surface-3:#1b1f26;--s-border:rgba(255,255,255,.075);--s-border-2:rgba(255,255,255,.14);--s-text:#f4f5f7;--s-text-2:#a7aeb9;--s-text-3:#8189 96;--s-accent:#c9f35c;--s-accent-ink:#10140a;--s-accent-edge:rgba(255,255,255,.3);--s-accent-text:#c9f35c;--s-accent-soft:rgba(201,243,92,.12);--s-spec:rgba(255,255,255,.1);--s-rim:rgba(255,255,255,.3);--s-shadow:rgba(0,0,0,.6);--s-shadow-sm:rgba(0,0,0,.4);--s-danger:#ff8b84;--s-danger-bg:rgba(255,99,90,.1);--s-ok:#7ee08f;--s-code-bg:#0b0d10;--s-code-text:#d7dce4;--s-dot:rgba(255,255,255,.09);--s-method-post:#c9f35c;--s-method-post-bg:rgba(201,243,92,.12);--s-scrim:rgba(0,0,0,.6);color-scheme:dark;".replace("#8189 96", "#818996");

const SHELL_CSS = `
.sfb-root{${SHELL_TOKENS_LIGHT}}
.sfb-root[data-theme="dark"]{${SHELL_TOKENS_DARK}}
.sfb-root,.sfb-root *,.sfb-root *::before,.sfb-root *::after{box-sizing:border-box}
.sfb-root{position:relative;width:100%;min-height:100%;overflow-x:clip;background:var(--s-bg);color:var(--s-text);font-family:${FONT_STACK};font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;isolation:isolate}
.sfb-root button,.sfb-root input,.sfb-root select{font-family:inherit}
.sfb-root h1,.sfb-root h2,.sfb-root h3,.sfb-root p{margin:0}
.sfb-bg{position:absolute;inset:0 0 auto 0;height:520px;z-index:-1;pointer-events:none;background-image:radial-gradient(circle at 1px 1px,var(--s-dot) 1px,transparent 0);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse 75% 70% at 50% 0%,#000 0%,transparent 78%);mask-image:radial-gradient(ellipse 75% 70% at 50% 0%,#000 0%,transparent 78%)}
.sfb-content{position:relative;max-width:1240px;margin:0 auto;padding:0 28px 56px}
.sfb-root[data-layout="medium"] .sfb-content{padding:0 22px 48px}
.sfb-root[data-layout="compact"] .sfb-content{padding:0 14px 40px}
.sfb-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 0}
.sfb-brand{display:flex;align-items:center;gap:10px;min-width:0;font-weight:650;font-size:13.5px;letter-spacing:-.01em}
.sfb-brand-mark{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:var(--s-text);color:var(--s-bg);box-shadow:inset 0 1px 0 var(--s-spec)}
.sfb-brand-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sfb-brand-tag{font-family:${MONO_STACK};font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--s-text-3)}
.sfb-top-actions{display:flex;align-items:center;gap:8px;flex:none}
.sfb-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--s-border-2);background:var(--s-surface);color:var(--s-text);font-size:13px;font-weight:600;letter-spacing:-.005em;cursor:pointer;box-shadow:inset 0 1px 0 var(--s-spec),0 1px 2px var(--s-shadow-sm);transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.sfb-btn::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--s-text);opacity:0;transition:opacity .16s ease;pointer-events:none}
.sfb-btn:hover::before{opacity:.06}
.sfb-btn:active{transform:scale(.96)}
.sfb-btn:focus-visible,.sfb-chip:focus-visible,.sfb-seg button:focus-visible,.sfb-tab:focus-visible,.sfb-endpoint:focus-visible,.sfb-icon-btn:focus-visible,.sfb-link:focus-visible{outline:2px solid var(--s-accent-text);outline-offset:2px}
.sfb-btn:disabled{opacity:.55;cursor:not-allowed}
.sfb-btn--icon{width:38px;padding:0}
.sfb-btn--primary{border-color:var(--s-accent-edge);background:var(--s-accent);color:var(--s-accent-ink);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 8px 20px -10px rgba(90,130,0,.55)}
.sfb-btn--primary::before{background:#fff}
.sfb-btn--primary:hover::before{opacity:.28}
.sfb-btn--sm{height:32px;padding:0 11px;font-size:12.5px;border-radius:9px}
.sfb-hero{padding:34px 0 26px}
.sfb-root[data-layout="compact"] .sfb-hero{padding:18px 0 18px}
.sfb-eyebrow{font-family:${MONO_STACK};font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--s-text-3);margin-bottom:16px}
.sfb-h1{font-size:56px;line-height:1;font-weight:760;letter-spacing:-.045em;text-wrap:balance}
.sfb-root[data-layout="medium"] .sfb-h1{font-size:44px}
.sfb-root[data-layout="compact"] .sfb-h1{font-size:33px;letter-spacing:-.04em}
.sfb-h1 em{font-style:normal;color:var(--s-text-3);font-weight:500;padding:0 .08em}
.sfb-lede{max-width:560px;margin-top:16px;font-size:16px;line-height:1.55;color:var(--s-text-2);text-wrap:pretty}
.sfb-root[data-layout="compact"] .sfb-lede{font-size:14.5px;margin-top:12px}
.sfb-card{position:relative;border-radius:16px;background:var(--s-surface);border:1px solid var(--s-border);box-shadow:inset 0 1px 0 0 var(--s-spec),0 8px 32px -8px var(--s-shadow)}
.sfb-card::before{content:"";position:absolute;top:0;left:12%;right:12%;height:1px;background:linear-gradient(90deg,transparent,var(--s-rim),transparent);opacity:.7;pointer-events:none}
.sfb-bar{display:flex;align-items:center;gap:6px;padding:7px;border-radius:16px;margin-top:6px}
.sfb-bar-icon{display:grid;place-items:center;flex:none;width:34px;height:34px;color:var(--s-text-3)}
.sfb-bar-input{flex:1;min-width:0;height:42px;border:0;background:none;color:var(--s-text);font-family:${MONO_STACK};font-size:13.5px;outline:none}
.sfb-bar-input::placeholder{color:var(--s-text-3);opacity:1}
.sfb-bar:focus-within{border-color:var(--s-accent-text)}
.sfb-bar .sfb-btn{height:42px;padding:0 18px;border-radius:11px}
.sfb-kbd{display:inline-grid;place-items:center;height:20px;padding:0 6px;border-radius:6px;border:1px solid var(--s-border-2);background:var(--s-surface-2);font-family:${MONO_STACK};font-size:10.5px;color:var(--s-text-3);box-shadow:inset 0 -1px 0 var(--s-border)}
.sfb-samples{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:14px}
.sfb-samples-label{font-family:${MONO_STACK};font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--s-text-3);margin-right:2px}
.sfb-chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;border:1px solid var(--s-border-2);background:var(--s-surface);color:var(--s-text-2);font-size:12.5px;font-weight:550;cursor:pointer;transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.sfb-chip:hover{color:var(--s-text)}
.sfb-chip:active{transform:scale(.96)}
.sfb-chip[disabled],.sfb-chip[aria-disabled="true"]{opacity:.55;cursor:not-allowed}
.sfb-work{display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:20px;align-items:start;margin-top:30px}
.sfb-root[data-layout="medium"] .sfb-work{grid-template-columns:minmax(0,310px) minmax(0,1fr);gap:16px;margin-top:24px}
.sfb-root[data-layout="compact"] .sfb-work{display:block;margin-top:18px}
.sfb-col{display:flex;flex-direction:column;gap:20px;min-width:0}
.sfb-sticky{position:sticky;top:16px}
.sfb-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 18px 12px}
.sfb-panel-title{font-size:13px;font-weight:650;letter-spacing:-.01em}
.sfb-panel-meta{font-family:${MONO_STACK};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--s-text-3)}
.sfb-panel-body{padding:0 12px 14px}
.sfb-filter{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px 12px}
.sfb-chip--method{height:28px;padding:0 10px;font-family:${MONO_STACK};font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:650}
.sfb-chip--method[aria-pressed="true"]{border-color:var(--s-accent-edge);background:var(--s-method-post-bg);color:var(--s-method-post)}
.sfb-chip-count{color:var(--s-text-3);font-weight:600}
.sfb-search{position:relative;margin:0 12px 10px}
.sfb-search svg{position:absolute;left:12px;top:50%;margin-top:-7px;color:var(--s-text-3);pointer-events:none}
.sfb-search input{width:100%;height:36px;padding:0 12px 0 34px;border-radius:10px;border:1px solid var(--s-border-2);background:var(--s-surface-2);color:var(--s-text);font-size:13px;outline:none}
.sfb-search input:focus{border-color:var(--s-accent-text)}
.sfb-search input::placeholder{color:var(--s-text-3);opacity:1}
.sfb-list{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none;max-height:330px;overflow-y:auto;overscroll-behavior:contain}
.sfb-endpoint{position:relative;display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:0;border-radius:11px;background:none;color:var(--s-text);text-align:left;cursor:pointer;min-height:48px}
.sfb-endpoint:hover{background:var(--s-surface-2)}
.sfb-endpoint-active{position:absolute;inset:0;border-radius:11px;background:var(--s-surface-3);box-shadow:inset 0 1px 0 var(--s-spec),inset 0 0 0 1px var(--s-border-2)}
.sfb-endpoint > *:not(.sfb-endpoint-active){position:relative}
.sfb-method{flex:none;display:inline-grid;place-items:center;height:20px;padding:0 7px;border-radius:6px;background:var(--s-method-post-bg);color:var(--s-method-post);font-family:${MONO_STACK};font-size:10px;font-weight:700;letter-spacing:.06em}
.sfb-endpoint-text{min-width:0;flex:1}
.sfb-path{display:block;font-family:${MONO_STACK};font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sfb-path b{font-weight:600;color:var(--s-accent-text)}
.sfb-summary{display:block;margin-top:1px;font-size:12px;color:var(--s-text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sfb-endpoint-arrow{flex:none;color:var(--s-text-3)}
.sfb-note{margin:0 18px 14px;padding:10px 12px;border-radius:10px;background:var(--s-surface-2);border:1px solid var(--s-border);font-size:12.5px;color:var(--s-text-2)}
.sfb-seg{position:relative;display:inline-flex;padding:3px;border-radius:11px;background:var(--s-surface-3);border:1px solid var(--s-border);gap:2px}
.sfb-seg button{position:relative;height:30px;padding:0 13px;border:0;border-radius:8px;background:none;color:var(--s-text-2);font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.sfb-seg button[aria-checked="true"]{color:var(--s-text)}
.sfb-seg button > span{position:relative;z-index:1}
.sfb-seg-pill{position:absolute;inset:0;border-radius:8px;background:var(--s-surface);box-shadow:inset 0 1px 0 var(--s-spec),0 1px 3px var(--s-shadow-sm),0 0 0 1px var(--s-border-2)}
.sfb-fields{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.sfb-frow{padding:12px;border-radius:12px;background:var(--s-surface-2);border:1px solid var(--s-border)}
.sfb-frow-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.sfb-frow-name{min-width:0;flex:1;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px}
.sfb-frow-key{font-family:${MONO_STACK};font-size:12px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.sfb-frow-type{font-size:11.5px;color:var(--s-text-3)}
.sfb-icon-btn{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--s-border-2);border-radius:8px;background:var(--s-surface);color:var(--s-text-2);cursor:pointer;transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.sfb-icon-btn:hover:not(:disabled){color:var(--s-text)}
.sfb-icon-btn:active:not(:disabled){transform:scale(.92)}
.sfb-icon-btn:disabled{opacity:.35;cursor:not-allowed}
.sfb-frow-inputs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.sfb-root[data-layout="medium"] .sfb-frow-inputs{grid-template-columns:minmax(0,1fr)}
.sfb-root[data-layout="compact"] .sfb-frow-inputs{grid-template-columns:minmax(0,1fr)}
.sfb-mini{display:flex;flex-direction:column;gap:4px;min-width:0}
.sfb-mini span{font-size:11px;font-weight:600;color:var(--s-text-3)}
.sfb-mini input{height:34px;padding:0 10px;border-radius:8px;border:1px solid var(--s-border-2);background:var(--s-surface);color:var(--s-text);font-size:13px;outline:none;min-width:0}
.sfb-mini input:focus{border-color:var(--s-accent-text)}
.sfb-mini input:disabled{opacity:.5;cursor:not-allowed}
.sfb-req-dot{color:var(--s-accent-text);font-weight:700}
.sfb-settings-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.sfb-settings-label{font-size:12px;font-weight:600;color:var(--s-text-2)}
.sfb-skipped{margin-top:12px;border-radius:12px;border:1px dashed var(--s-border-2);padding:12px 14px}
.sfb-skipped summary{cursor:pointer;font-size:12.5px;font-weight:600;color:var(--s-text-2);list-style:none;display:flex;align-items:center;gap:8px}
.sfb-skipped summary::-webkit-details-marker{display:none}
.sfb-skipped ul{margin:10px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.sfb-skipped li{font-size:12.5px;color:var(--s-text-2)}
.sfb-skipped code{font-family:${MONO_STACK};font-size:11.5px;color:var(--s-text);background:var(--s-surface-3);padding:1px 6px;border-radius:5px}
.sfb-preview-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 22px 14px;border-bottom:1px solid var(--s-border)}
.sfb-preview-title{min-width:0;display:flex;align-items:center;gap:10px}
.sfb-preview-title .sfb-path{font-size:13px}
.sfb-preview-body{padding:26px 24px 28px}
.sfb-root[data-layout="compact"] .sfb-preview-body{padding:20px 16px 22px}
.sfb-preview-name{font-size:22px;font-weight:700;letter-spacing:-.03em;line-height:1.15;margin-bottom:6px}
.sfb-preview-sub{font-size:13.5px;color:var(--s-text-2);margin-bottom:22px;max-width:520px}
.sfb-live{background:var(--s-surface)}
.sfb-state{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:46px 26px}
.sfb-root[data-layout="compact"] .sfb-state{padding:34px 18px}
.sfb-state-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:15px;background:var(--s-surface-3);border:1px solid var(--s-border-2);color:var(--s-text-2);box-shadow:inset 0 1px 0 var(--s-spec)}
.sfb-state--error .sfb-state-icon{background:var(--s-danger-bg);color:var(--s-danger);border-color:color-mix(in srgb,var(--s-danger) 35%,transparent)}
.sfb-state-title{font-size:17px;font-weight:700;letter-spacing:-.025em;margin-top:4px}
.sfb-state-text{max-width:420px;font-size:13.5px;color:var(--s-text-2);text-wrap:pretty}
.sfb-state-hint{max-width:420px;font-size:12.5px;color:var(--s-text-3);text-wrap:pretty}
.sfb-state-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:8px}
.sfb-skeleton{display:flex;flex-direction:column;gap:12px;padding:18px}
.sfb-skel{height:44px;border-radius:11px;background:var(--s-surface-3);animation:sfb-pulse 1.3s ease-in-out infinite}
.sfb-skel--short{height:14px;width:38%;border-radius:6px}
.sfb-ghost{display:flex;flex-direction:column;gap:9px;width:min(320px,100%);margin-bottom:6px}
.sfb-ghost i{display:block;height:11px;border-radius:6px;background:var(--s-surface-3);border:1px solid var(--s-border)}
.sfb-ghost i:nth-child(2){width:82%}.sfb-ghost i:nth-child(3){width:64%;background:var(--s-accent-soft);border-color:transparent}.sfb-ghost i:nth-child(4){width:90%}
.sfb-tabs{position:sticky;top:0;z-index:20;display:flex;gap:2px;padding:4px;margin:0 0 14px;border-radius:14px;background:var(--s-surface);border:1px solid var(--s-border-2);box-shadow:inset 0 1px 0 var(--s-spec),0 8px 20px -10px var(--s-shadow)}
.sfb-tab{position:relative;flex:1;min-width:0;height:40px;border:0;border-radius:10px;background:none;color:var(--s-text-2);font-size:13px;font-weight:600;cursor:pointer}
.sfb-tab[aria-selected="true"]{color:var(--s-text)}
.sfb-tab > span{position:relative;z-index:1}
.sfb-tab-pill{position:absolute;inset:0;border-radius:10px;background:var(--s-surface-3);box-shadow:inset 0 1px 0 var(--s-spec),inset 0 0 0 1px var(--s-border-2)}
.sfb-overlay{position:fixed;inset:0;z-index:9999;pointer-events:none}
.sfb-scrim{position:fixed;inset:0;background:var(--s-scrim);will-change:opacity;pointer-events:auto}
.sfb-drawer{position:fixed;top:0;right:0;bottom:0;width:min(660px,100vw);height:100vh;display:flex;flex-direction:column;background:var(--s-surface);border-left:1px solid var(--s-border-2);box-shadow:inset 1px 0 0 0 var(--s-spec),-24px 0 60px -20px var(--s-shadow);will-change:transform;pointer-events:auto;z-index:10000}
.sfb-xp{display:flex;flex-direction:column;min-height:0;flex:1}
.sfb-xp-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--s-border)}
.sfb-xp-title{font-size:16px;font-weight:700;letter-spacing:-.025em}
.sfb-xp-sub{font-size:12px;color:var(--s-text-3);margin-top:2px}
.sfb-xp-controls{display:flex;flex-direction:column;gap:12px;padding:14px 20px;border-bottom:1px solid var(--s-border)}
.sfb-xp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.sfb-check{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:550;color:var(--s-text-2);cursor:pointer}
.sfb-check input{width:16px;height:16px;accent-color:var(--s-accent-text);margin:0}
.sfb-install{display:flex;align-items:center;gap:10px;min-width:0;padding:9px 10px 9px 12px;border-radius:10px;background:var(--s-code-bg);border:1px solid var(--s-border)}
.sfb-install code{flex:1;min-width:0;font-family:${MONO_STACK};font-size:12px;color:var(--s-code-text);overflow-x:auto;white-space:nowrap;scrollbar-width:none}
.sfb-install code::-webkit-scrollbar{display:none}
.sfb-install .sfb-prompt{color:var(--s-text-3);margin-right:8px;user-select:none}
.sfb-file{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 20px;border-bottom:1px solid var(--s-border);background:var(--s-surface-2)}
.sfb-file-name{min-width:0;font-family:${MONO_STACK};font-size:12.5px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sfb-file-meta{font-size:11.5px;color:var(--s-text-3);font-weight:500;margin-left:8px}
.sfb-file-actions{display:flex;align-items:center;gap:6px;flex:none}
.sfb-code{flex:1;min-height:0;overflow:auto;margin:0;padding:16px 0;background:var(--s-code-bg);color:var(--s-code-text);font-family:${MONO_STACK};font-size:12.5px;line-height:1.65;tab-size:2}
.sfb-code--inline{max-height:520px;border-radius:0 0 16px 16px}
.sfb-code code{display:block;min-width:max-content;font-family:inherit}
.sfb-code[data-wrap="true"] code{min-width:0}
.sfb-code[data-wrap="true"] .sfb-ln{white-space:pre-wrap;word-break:break-word}
.sfb-ln{display:block;padding:0 20px;white-space:pre}
.sfb-t-c{color:var(--s-text-3);font-style:italic}.sfb-t-s{color:#2f7a3b}.sfb-t-k{color:#a8325e}.sfb-t-n{color:#a25b00}.sfb-t-j{color:#1f5fa8}
.sfb-root[data-theme="dark"] .sfb-t-s{color:#9be4a4}.sfb-root[data-theme="dark"] .sfb-t-k{color:#ff9bb8}.sfb-root[data-theme="dark"] .sfb-t-n{color:#ffc88a}.sfb-root[data-theme="dark"] .sfb-t-j{color:#8cc4ff}
.sfb-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:var(--s-text);color:var(--s-bg);font-size:12.5px;font-weight:600;box-shadow:0 10px 30px -8px var(--s-shadow)}
.sfb-link{color:var(--s-accent-text);font-weight:600;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px;font-size:inherit}
.sfb-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.sfb-request{margin-top:18px;border-radius:12px;overflow:hidden;border:1px solid var(--s-border-2)}
.sfb-request-head{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--s-surface-2);border-bottom:1px solid var(--s-border);font-size:12.5px;font-weight:650}
.sfb-request-url{min-width:0;font-family:${MONO_STACK};font-size:12px;font-weight:550;color:var(--s-text-2);overflow-wrap:anywhere}
.sfb-request pre{margin:0;padding:12px 14px;max-height:220px;overflow:auto;background:var(--s-code-bg);color:var(--s-code-text);font-family:${MONO_STACK};font-size:12px;line-height:1.6}
.sfb-request-actions{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;border-top:1px solid var(--s-border);background:var(--s-surface-2)}
.sfb-spin{animation:sfb-spin .8s linear infinite}
@keyframes sfb-spin{to{transform:rotate(360deg)}}
@keyframes sfb-pulse{0%,100%{opacity:.55}50%{opacity:1}}
@media (prefers-reduced-motion: reduce){.sfb-root *,.sfb-root *::before,.sfb-root *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   10. UI HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;
const SOFT_SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 } as const;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

function downloadText(fileName: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime + ";charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const KEYWORDS =
  "import|from|export|default|const|let|function|return|if|else|async|await|try|catch|throw|new|type|interface|typeof|void|null|undefined|true|false|instanceof";
const TOKEN_RE = new RegExp(
  "(\\/\\/.*$|^\\s*#.*$)|(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')|(\\b(?:" + KEYWORDS + ")\\b)|(\\b\\d+(?:\\.\\d+)?\\b)|(<\\/?[A-Za-z][\\w.]*)",
  "g",
);

function highlightLine(line: string, key: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    const cls = match[1] ? "sfb-t-c" : match[2] ? "sfb-t-s" : match[3] ? "sfb-t-k" : match[4] ? "sfb-t-n" : "sfb-t-j";
    parts.push(
      <span key={match.index} className={cls}>
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
    if (match[0].length === 0) TOKEN_RE.lastIndex += 1;
  }
  if (last < line.length) parts.push(line.slice(last));
  return (
    <span key={key} className="sfb-ln">
      {parts.length ? parts : "\u200b"}
    </span>
  );
}

function CodeBlock({ code, wrap, inline }: { code: string; wrap: boolean; inline?: boolean }) {
  const rendered = useMemo(() => {
    const lines = code.split("\n");
    let inStyles = false;
    return lines.map((line, index) => {
      if (/^const styles = `/.test(line)) {
        inStyles = true;
        return highlightLine(line.slice(0, line.indexOf("`") + 1), index);
      }
      if (inStyles) {
        if (/^`;/.test(line)) {
          inStyles = false;
          return highlightLine(line, index);
        }
        return (
          <span key={index} className="sfb-ln sfb-t-c" style={{ fontStyle: "normal" }}>
            {line || "\u200b"}
          </span>
        );
      }
      return highlightLine(line, index);
    });
  }, [code]);

  return (
    <pre className={"sfb-code" + (inline ? " sfb-code--inline" : "")} data-wrap={wrap ? "true" : "false"} tabIndex={0} aria-label="Generated code">
      <code>{rendered}</code>
    </pre>
  );
}

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  group,
}: {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
  group: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const current = options.findIndex((o) => o.value === value);
    const at = enabled.indexOf(current);
    const nextIndex = enabled[(at + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length];
    onChange(options[nextIndex].value);
    refs.current[nextIndex]?.focus();
  };
  return (
    <div className="sfb-seg" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <motion.button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={option.disabled}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(option.value)}
          >
            {active ? <motion.span layoutId={"sfb-seg-" + group} className="sfb-seg-pill" transition={SPRING} /> : null}
            <span>{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function PathLabel({ path }: { path: string }) {
  const segments = path.split(/(\{[^}]+\})/g).filter(Boolean);
  return (
    <span className="sfb-path" title={path}>
      {segments.map((segment, index) => (segment.startsWith("{") ? <b key={index}>{segment}</b> : <span key={index}>{segment}</span>))}
    </span>
  );
}

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null;
  while (current) {
    const overflowY = window.getComputedStyle(current).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return current;
    current = current.parentElement;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. LIVE FORM  (React Hook Form + the same zod rules as the export)
   ═══════════════════════════════════════════════════════════════════════════ */

type LiveResult =
  | { kind: "ready"; request: RequestPreview }
  | { kind: "sending"; request: RequestPreview }
  | { kind: "sent"; request: RequestPreview; status: number; body: string }
  | { kind: "failed"; request: RequestPreview; message: string };

function LiveFieldShell({
  id,
  label,
  required,
  hint,
  error,
  index,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout="position"
      className="sfb-field"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SOFT_SPRING, delay: Math.min(index, 8) * 0.045 }}
    >
      <label className="sfb-label" htmlFor={id}>
        {label}
        {required ? (
          <span className="sfb-req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      <div className="sfb-msg" id={id + "-msg"}>
        {error ? (
          <p className="sfb-error" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="sfb-hint">{hint}</p>
        ) : null}
      </div>
    </motion.div>
  );
}

function LiveForm({
  spec,
  endpoint,
  fields,
  columns,
  theme,
  onExport,
}: {
  spec: LoadedSpec;
  endpoint: EndpointInfo;
  fields: FieldModel[];
  columns: 1 | 2;
  theme: ThemeName;
  onExport?: () => void;
}) {
  const [result, setResult] = useState<LiveResult | null>(null);
  const schema = useMemo(() => buildFormSchema(fields), [fields]);
  const resolver = useMemo(() => zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]) as unknown as Resolver<LiveValues>, [schema]);
  const defaults = useMemo(() => buildDefaults(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LiveValues>({ resolver, defaultValues: defaults, mode: "onTouched" });

  const onValid = (values: LiveValues) => {
    setResult({ kind: "ready", request: buildRequestPreview(spec, endpoint, fields, values) });
  };

  const send = async (request: RequestPreview) => {
    setResult({ kind: "sending", request });
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      const text = await response.text();
      setResult({ kind: "sent", request, status: response.status, body: text });
    } catch {
      setResult({
        kind: "failed",
        request,
        message: "The browser couldn't reach the API — usually CORS, or the server is offline.",
      });
    }
  };

  const prefix = "sfb-live";

  return (
    <div className="sfb-scope" data-theme={theme}>
      <style>{FORM_CSS}</style>
      <form className="sfb-form" data-columns={columns} noValidate onSubmit={handleSubmit(onValid)} id="sfb-live-form">
        {fields.map((field, index) => {
          const id = prefix + "-" + field.ident;
          const message = typeof errors[field.ident]?.message === "string" ? (errors[field.ident]?.message as string) : undefined;
          const invalid = message ? true : undefined;
          const describedBy = id + "-msg";

          if (field.kind === "switch") {
            return (
              <motion.div
                key={field.key}
                layout="position"
                className="sfb-field"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SOFT_SPRING, delay: Math.min(index, 8) * 0.045 }}
              >
                <label className="sfb-switch" htmlFor={id}>
                  <input id={id} type="checkbox" role="switch" aria-invalid={invalid} aria-describedby={describedBy} {...register(field.ident)} />
                  <span className="sfb-switch-track" aria-hidden="true">
                    <span className="sfb-switch-thumb" />
                  </span>
                  <span className="sfb-switch-text">{field.label}</span>
                </label>
                <div className="sfb-msg" id={describedBy}>
                  {field.description ? <p className="sfb-hint">{field.description}</p> : null}
                </div>
              </motion.div>
            );
          }

          if (field.kind === "select") {
            return (
              <LiveFieldShell key={field.key} id={id} label={field.label} required={field.required} hint={field.description} error={message} index={index}>
                <div className="sfb-control sfb-control--select">
                  <select className="sfb-input" id={id} aria-invalid={invalid} aria-describedby={describedBy} {...register(field.ident)}>
                    <option value="">{field.placeholder || "Select an option"}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </LiveFieldShell>
            );
          }

          const isNumber = field.kind === "number";
          const type = isNumber ? "number" : field.kind === "datetime" ? "datetime-local" : field.kind === "text" ? "text" : field.kind;
          const registration = isNumber ? register(field.ident, { setValueAs: toNumber }) : register(field.ident);
          return (
            <LiveFieldShell key={field.key} id={id} label={field.label} required={field.required} hint={field.description} error={message} index={index}>
              <div className="sfb-control">
                <input
                  className="sfb-input"
                  id={id}
                  type={type}
                  inputMode={isNumber ? (field.integer ? "numeric" : "decimal") : undefined}
                  step={isNumber ? (field.integer ? 1 : "any") : undefined}
                  min={isNumber ? field.minimum : undefined}
                  max={isNumber ? field.maximum : undefined}
                  maxLength={!isNumber ? field.maxLength : undefined}
                  placeholder={field.kind === "date" || field.kind === "datetime" ? undefined : field.placeholder || undefined}
                  autoComplete={autoCompleteFor(field) ?? undefined}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...registration}
                />
              </div>
            </LiveFieldShell>
          );
        })}

        <div className="sfb-actions">
          <motion.button type="submit" className="sfb-submit" whileTap={{ scale: 0.96 }} transition={SPRING} id="sfb-live-submit">
            Submit
          </motion.button>
          <button
            type="button"
            className="sfb-reset"
            onClick={() => {
              reset(defaults);
              setResult(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <AnimatePresence initial={false}>
        {result ? (
          <motion.div
            key="result"
            className="sfb-request"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={SOFT_SPRING}
            role="status"
            aria-live="polite"
          >
            <div className="sfb-request-head">
              <Check size={15} aria-hidden="true" style={{ color: "var(--s-ok)" }} />
              <span>
                {result.kind === "sent"
                  ? "Response · HTTP " + result.status
                  : result.kind === "failed"
                    ? "Request failed"
                    : result.kind === "sending"
                      ? "Sending…"
                      : "Valid — here is the request this form sends"}
              </span>
            </div>
            <pre>
              {result.request.method} {result.request.url}
              {result.request.body ? "\n\n" + JSON.stringify(result.request.body, null, 2) : ""}
              {result.kind === "sent" ? "\n\n← " + (result.body.slice(0, 500) || "(empty response)") : ""}
              {result.kind === "failed" ? "\n\n✕ " + result.message : ""}
            </pre>
            <div className="sfb-request-actions">
              {spec.isDemo ? (
                <span className="sfb-summary" style={{ whiteSpace: "normal" }}>
                  The demo API is fictional, so nothing is sent. Load a real spec to try live requests.
                </span>
              ) : (
                <motion.button
                  type="button"
                  className="sfb-btn sfb-btn--sm"
                  whileTap={{ scale: 0.96 }}
                  disabled={result.kind === "sending"}
                  onClick={() => void send(result.request)}
                >
                  {result.kind === "sending" ? <Loader2 size={14} className="sfb-spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
                  Send live request
                </motion.button>
              )}
              {onExport ? (
                <motion.button
                  type="button"
                  className="sfb-btn sfb-btn--primary sfb-btn--sm"
                  whileTap={{ scale: 0.96 }}
                  onClick={onExport}
                >
                  <Code2 size={14} aria-hidden="true" />
                  <span>Export this form code</span>
                </motion.button>
              ) : null}
              <button type="button" className="sfb-btn sfb-btn--sm" onClick={() => setResult(null)}>
                Dismiss
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. EXPORT PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

function ExportPanel({
  spec,
  model,
  fields,
  columns,
  transport,
  onTransportChange,
  useClient,
  onUseClientChange,
  onClose,
  inline,
  closeRef,
}: {
  spec: LoadedSpec;
  model: FormModel;
  fields: FieldModel[];
  columns: 1 | 2;
  transport: Transport;
  onTransportChange: (next: Transport) => void;
  useClient: boolean;
  onUseClientChange: (next: boolean) => void;
  onClose?: () => void;
  inline?: boolean;
  closeRef?: React.Ref<HTMLButtonElement>;
}) {
  const [copied, setCopied] = useState<"code" | "install" | null>(null);
  const [wrap, setWrap] = useState(false);
  const name = componentNameFor(model.endpoint);

  const output = useMemo(() => {
    if (transport === "curl") {
      return {
        code: generateCurlScript(model, spec, fields),
        fileName: toKebab(name.replace(/Form$/, "")) + ".sh",
        mime: "text/x-shellscript",
        install: "bash " + toKebab(name.replace(/Form$/, "")) + ".sh",
      };
    }
    return {
      code: generateComponentSource({ model, spec, fields, columns, transport, useClient }),
      fileName: name + ".tsx",
      mime: "text/typescript",
      install: "npm install react-hook-form zod @hookform/resolvers" + (transport === "axios" ? " axios" : ""),
    };
  }, [transport, model, spec, fields, columns, useClient, name]);

  const lineCount = output.code.split("\n").length - 1;

  const flash = (what: "code" | "install") => {
    setCopied(what);
    window.setTimeout(() => setCopied((current) => (current === what ? null : current)), 1800);
  };

  const onCopy = async (what: "code" | "install") => {
    const ok = await copyText(what === "code" ? output.code : output.install);
    if (ok) flash(what);
  };

  return (
    <div className="sfb-xp" id="sfb-export-panel">
      {!inline ? (
        <div className="sfb-xp-head">
          <div>
            <h2 className="sfb-xp-title" id="sfb-export-title">
              Export code
            </h2>
            <p className="sfb-xp-sub">
              {model.endpoint.method.toUpperCase()} {model.endpoint.path}
            </p>
          </div>
          <button type="button" className="sfb-icon-btn" onClick={onClose} aria-label="Close export panel" ref={closeRef}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="sfb-xp-controls">
        <div className="sfb-xp-row">
          <span className="sfb-settings-label" id="sfb-transport-label">
            Submit with
          </span>
          <Segmented<Transport>
            label="Submit with"
            group="transport"
            value={transport}
            onChange={onTransportChange}
            options={[
              { value: "fetch", label: "fetch" },
              { value: "axios", label: "axios" },
              { value: "curl", label: "curl" },
            ]}
          />
        </div>
        <div className="sfb-xp-row">
          <span className="sfb-settings-label">{transport === "curl" ? "Format · Shell script (bash)" : "Format · React Hook Form + zod"}</span>
          {transport !== "curl" ? (
            <label className="sfb-check">
              <input type="checkbox" checked={useClient} onChange={(event) => onUseClientChange(event.target.checked)} />
              Next.js “use client”
            </label>
          ) : null}
        </div>
        <div className="sfb-install">
          <code>
            <span className="sfb-prompt">$</span>
            {output.install}
          </code>
          <button type="button" className="sfb-icon-btn" onClick={() => void onCopy("install")} aria-label="Copy install command">
            {copied === "install" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="sfb-file">
        <div style={{ minWidth: 0, display: "flex", alignItems: "baseline" }}>
          <span className="sfb-file-name">{output.fileName}</span>
          <span className="sfb-file-meta">{pluralize(lineCount, "line")}</span>
        </div>
        <div className="sfb-file-actions">
          <button type="button" className="sfb-btn sfb-btn--sm" onClick={() => setWrap((v) => !v)} aria-pressed={wrap}>
            Wrap
          </button>
          <motion.button type="button" className="sfb-btn sfb-btn--sm" whileTap={{ scale: 0.96 }} onClick={() => downloadText(output.fileName, output.code, output.mime)} id="sfb-download">
            <Download size={14} aria-hidden="true" />
            <span>Download</span>
          </motion.button>
          <motion.button type="button" className="sfb-btn sfb-btn--sm sfb-btn--primary" whileTap={{ scale: 0.96 }} onClick={() => void onCopy("code")} id="sfb-copy">
            {copied === "code" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span>{copied === "code" ? "Copied" : "Copy"}</span>
          </motion.button>
        </div>
      </div>
      <span className="sfb-sr" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
      <CodeBlock code={output.code} wrap={wrap} inline={inline} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   13. FIELD SETTINGS PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

function FieldSettings({
  model,
  fields,
  settings,
  onChange,
  onReset,
}: {
  model: FormModel;
  fields: FieldModel[];
  settings: FormSettings;
  onChange: (next: FormSettings) => void;
  onReset: () => void;
}) {
  const baseOf = useMemo(() => new Map(model.fields.map((f) => [f.key, f] as const)), [model.fields]);

  const move = (key: string, delta: -1 | 1) => {
    const keys = fields.map((f) => f.key);
    const from = keys.indexOf(key);
    const to = from + delta;
    if (to < 0 || to >= keys.length) return;
    keys.splice(to, 0, keys.splice(from, 1)[0]);
    onChange({ ...settings, order: keys });
  };

  return (
    <div>
      <div className="sfb-settings-bar">
        <span className="sfb-settings-label" id="sfb-columns-label">
          Grid
        </span>
        <Segmented<"1" | "2">
          label="Form grid columns"
          group="columns"
          value={String(settings.columns) as "1" | "2"}
          onChange={(next) => onChange({ ...settings, columns: next === "2" ? 2 : 1 })}
          options={[
            { value: "1", label: "1 column" },
            { value: "2", label: "2 columns" },
          ]}
        />
      </div>

      <ul className="sfb-fields">
        {fields.map((field, index) => {
          const base = baseOf.get(field.key) as FieldModel;
          const noPlaceholder = field.kind === "switch" || field.kind === "date" || field.kind === "datetime";
          return (
            <motion.li key={field.key} layout="position" transition={SPRING} className="sfb-frow">
              <div className="sfb-frow-top">
                <div className="sfb-frow-name">
                  <span className="sfb-frow-key">
                    {field.apiName}
                    {field.required ? <span className="sfb-req-dot" title="Required"> *</span> : null}
                  </span>
                  <span className="sfb-frow-type">
                    {field.source !== "body" ? field.source + " · " : ""}
                    {describeField(field)}
                  </span>
                </div>
                <button type="button" className="sfb-icon-btn" disabled={index === 0} onClick={() => move(field.key, -1)} aria-label={"Move " + field.apiName + " up"}>
                  <ArrowUp size={14} aria-hidden="true" />
                </button>
                <button type="button" className="sfb-icon-btn" disabled={index === fields.length - 1} onClick={() => move(field.key, 1)} aria-label={"Move " + field.apiName + " down"}>
                  <ArrowDown size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="sfb-frow-inputs">
                <label className="sfb-mini">
                  <span>Label</span>
                  <input
                    type="text"
                    value={settings.labels[field.key] ?? field.label}
                    placeholder={base.label}
                    onChange={(event) => onChange({ ...settings, labels: { ...settings.labels, [field.key]: event.target.value } })}
                  />
                </label>
                <label className="sfb-mini">
                  <span>Placeholder</span>
                  <input
                    type="text"
                    disabled={noPlaceholder}
                    value={noPlaceholder ? "" : (settings.placeholders[field.key] ?? field.placeholder)}
                    placeholder={noPlaceholder ? "Not used for this type" : base.placeholder}
                    onChange={(event) => onChange({ ...settings, placeholders: { ...settings.placeholders, [field.key]: event.target.value } })}
                  />
                </label>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {model.skipped.length > 0 ? (
        <details className="sfb-skipped">
          <summary>
            <AlertTriangle size={14} aria-hidden="true" />
            {pluralize(model.skipped.length, "property") + " not supported yet"}
          </summary>
          <ul>
            {model.skipped.map((item) => (
              <li key={item.source + item.name}>
                <code>{item.name}</code> — {item.reason}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <button type="button" className="sfb-btn sfb-btn--sm" onClick={onReset}>
          <RotateCcw size={13} aria-hidden="true" />
          Reset to schema defaults
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   14. STATES
   ═══════════════════════════════════════════════════════════════════════════ */

function StateCard({
  icon,
  title,
  text,
  hint,
  tone,
  children,
  role,
}: {
  icon: React.ReactNode;
  title: string;
  text?: string;
  hint?: string;
  tone?: "error";
  children?: React.ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <motion.div
      className={"sfb-state" + (tone === "error" ? " sfb-state--error" : "")}
      role={role}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SOFT_SPRING}
    >
      <div className="sfb-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="sfb-state-title">{title}</h2>
      {text ? <p className="sfb-state-text">{text}</p> : null}
      {hint ? <p className="sfb-state-hint">{hint}</p> : null}
      {children ? <div className="sfb-state-actions">{children}</div> : null}
    </motion.div>
  );
}

function errorIcon(code: SpecErrorCode): React.ReactNode {
  if (code === "network" || code === "timeout") return <WifiOff size={22} />;
  if (code === "not-openapi" || code === "parse" || code === "empty") return <FileQuestion size={22} />;
  return <AlertTriangle size={22} />;
}

function errorTitle(code: SpecErrorCode): string {
  switch (code) {
    case "invalid-url":
      return "That link doesn't look right";
    case "network":
      return "Couldn't reach the document";
    case "timeout":
      return "The server took too long";
    case "http":
      return "The server said no";
    case "parse":
      return "Couldn't read the document";
    case "not-openapi":
      return "Not an OpenAPI document";
    case "swagger2":
      return "Swagger 2.0 isn't supported yet";
    case "refs":
      return "A reference couldn't be resolved";
    case "empty":
      return "No endpoints found";
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   15. MAIN TEMPLATE
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SwaggerFormBuilderProps {
  /** Initial color theme. The built-in toggle can still change it. */
  theme?: ThemeName;
  /** Pre-fill the OpenAPI URL field. */
  defaultUrl?: string;
  /** Unique ID prefix for accessibility attributes (defaults to "sfb"). */
  id?: string;
}

type CompactTab = "source" | "fields" | "preview" | "code";
type Layout = "wide" | "medium" | "compact";

export default function SwaggerFormBuilder({ theme = "dark", defaultUrl = "", id }: SwaggerFormBuilderProps) {
  const uid = id || "sfb";
  const [dark, setDark] = useState(theme === "dark");
  useEffect(() => setDark(theme === "dark"), [theme]);
  const themeName: ThemeName = dark ? "dark" : "light";

  /* responsive: container width, not viewport — works inside device frames */
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [viewportH, setViewportH] = useState(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const parent = getScrollParent(el);
    const measure = () => setViewportH(parent ? parent.clientHeight : window.innerHeight);
    measure();
    const observer = new ResizeObserver(measure);
    if (parent) observer.observe(parent);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const layout: Layout = width < 700 ? "compact" : width < 1060 ? "medium" : "wide";
  const compact = layout === "compact";

  /* spec loading */
  const [url, setUrl] = useState(defaultUrl);
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsMap, setSettingsMap] = useState<Record<string, FormSettings>>({});
  const [compactTab, setCompactTab] = useState<CompactTab>("source");
  const [exportOpen, setExportOpen] = useState(false);
  const [transport, setTransport] = useState<Transport>("fetch");
  const [useClient, setUseClient] = useState(true);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const finishLoad = useCallback((spec: LoadedSpec) => {
    const firstPost = spec.endpoints.find((e) => e.method === "post");
    setPhase({ status: "ready", spec });
    setSelectedId(firstPost ? firstPost.id : null);
    setSettingsMap({});
    setQuery("");
    setExportOpen(false);
  }, []);

  const handleFetch = useCallback(
    async (override?: string) => {
      const target = (override ?? url).trim();
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase({ status: "loading", url: target });
      try {
        const spec = await loadSpecFromUrl(target, controller.signal);
        if (controller.signal.aborted) return;
        finishLoad(spec);
      } catch (error) {
        if (controller.signal.aborted) return;
        const specError =
          error instanceof SpecError
            ? error
            : new SpecError("network", "Something unexpected went wrong while loading the spec.", error instanceof Error ? error.message : "Try again.");
        setPhase({ status: "error", error: specError, url: target });
      }
    },
    [url, finishLoad],
  );

  const handleDemo = useCallback(async () => {
    abortRef.current?.abort();
    setPhase({ status: "loading", url: "demo" });
    try {
      const spec = await prepareSpec(DEMO_SPEC, "https://api.northwind.example/openapi.json", true);
      setUrl("");
      finishLoad(spec);
    } catch (error) {
      setPhase({
        status: "error",
        error: error instanceof SpecError ? error : new SpecError("parse", "The demo spec failed to load.", "Reload the page."),
        url: "demo",
      });
    }
  }, [finishLoad]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const spec = phase.status === "ready" ? phase.spec : null;
  const postEndpoints = useMemo(() => (spec ? spec.endpoints.filter((e) => e.method === "post") : []), [spec]);
  const visibleEndpoints = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return postEndpoints;
    return postEndpoints.filter((e) => (e.path + " " + e.summary + " " + (e.operationId ?? "")).toLowerCase().includes(needle));
  }, [postEndpoints, query]);

  const endpoint = useMemo(() => postEndpoints.find((e) => e.id === selectedId) ?? null, [postEndpoints, selectedId]);
  const model = useMemo(() => (endpoint ? buildFormModel(endpoint) : null), [endpoint]);
  const settings: FormSettings | null = model && endpoint ? (settingsMap[endpoint.id] ?? defaultSettings(model)) : null;
  const fields = useMemo(() => (model && settings ? resolveFields(model, settings) : []), [model, settings]);

  const updateSettings = (next: FormSettings) => {
    if (!endpoint) return;
    setSettingsMap((current) => ({ ...current, [endpoint.id]: next }));
  };

  const openExport = () => {
    if (compact) setCompactTab("code");
    else setExportOpen(true);
  };
  const closeExport = useCallback(() => {
    setExportOpen(false);
    window.setTimeout(() => exportButtonRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!exportOpen) return;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExport();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exportOpen, closeExport]);

  useEffect(() => {
    if (!compact && compactTab === "code") setCompactTab("preview");
  }, [compact, compactTab]);

  const selectEndpoint = (id: string) => {
    setSelectedId(id);
    if (compact) setCompactTab("preview");
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button.sfb-endpoint"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  };

  const canExport = Boolean(model && endpoint && spec && fields.length > 0);
  const methodOrder: HttpMethod[] = ["post", "get", "put", "patch", "delete"];

  /* ── Source panel (URL result: endpoints) ── */
  const endpointsPanel = (
    <section className="sfb-card" aria-labelledby={uid + "-ep"}>
      <div className="sfb-panel-head">
        <h2 className="sfb-panel-title" id={uid + "-ep"}>
          Endpoints
        </h2>
        <span className="sfb-panel-meta">{spec ? spec.title : "No spec"}</span>
      </div>

      {phase.status === "loading" ? (
        <div className="sfb-skeleton" aria-busy="true" aria-label="Loading endpoints">
          <div className="sfb-skel sfb-skel--short" />
          <div className="sfb-skel" />
          <div className="sfb-skel" />
          <div className="sfb-skel" />
        </div>
      ) : spec ? (
        <>
          <div className="sfb-filter" role="group" aria-label="Filter by HTTP method">
            {methodOrder.map((method) => {
              const count = spec.methodCounts[method] ?? 0;
              const active = method === "post";
              return (
                <button
                  key={method}
                  type="button"
                  className="sfb-chip sfb-chip--method"
                  aria-pressed={active}
                  aria-disabled={!active}
                  title={active ? "Showing POST endpoints" : method.toUpperCase() + " arrives in the second wave"}
                  onClick={() => undefined}
                >
                  {!active ? <Lock size={10} aria-hidden="true" /> : null}
                  {method}
                  <span className="sfb-chip-count">{count}</span>
                </button>
              );
            })}
          </div>

          {postEndpoints.length > 5 ? (
            <div className="sfb-search">
              <Search size={14} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter endpoints"
                aria-label="Filter endpoints by path or summary"
                id="sfb-endpoint-search"
              />
            </div>
          ) : null}

          {postEndpoints.length === 0 ? (
            <p className="sfb-note">This spec has no POST endpoints. Only POST is available in this version.</p>
          ) : visibleEndpoints.length === 0 ? (
            <p className="sfb-note">No POST endpoint matches “{query}”.</p>
          ) : (
            <div className="sfb-panel-body">
              <ul className="sfb-list" onKeyDown={onListKeyDown} aria-label="POST endpoints">
                {visibleEndpoints.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="sfb-endpoint"
                        aria-current={active ? "true" : undefined}
                        onClick={() => selectEndpoint(item.id)}
                      >
                        {active ? <motion.span layoutId={"sfb-endpoint-active-" + uid} className="sfb-endpoint-active" transition={SPRING} /> : null}
                        <span className="sfb-method">POST</span>
                        <span className="sfb-endpoint-text">
                          <PathLabel path={item.path} />
                          {item.summary ? <span className="sfb-summary">{item.summary}</span> : null}
                        </span>
                        <ChevronRight size={14} className="sfb-endpoint-arrow" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="sfb-note">Load an OpenAPI 3 document to see its endpoints here.</p>
      )}
    </section>
  );

  const fieldsPanel = (
    <section className="sfb-card" aria-labelledby={uid + "-fields"}>
      <div className="sfb-panel-head">
        <h2 className="sfb-panel-title" id={uid + "-fields"}>
          Form settings
        </h2>
        <span className="sfb-panel-meta">{model ? pluralize(fields.length, "field") : "—"}</span>
      </div>
      <div className="sfb-panel-body" style={{ padding: "0 18px 18px" }}>
        {model && settings && fields.length > 0 ? (
          <FieldSettings
            model={model}
            fields={fields}
            settings={settings}
            onChange={updateSettings}
            onReset={() => {
              if (!endpoint) return;
              setSettingsMap((current) => {
                const next = { ...current };
                delete next[endpoint.id];
                return next;
              });
            }}
          />
        ) : (
          <p className="sfb-state-hint" style={{ textAlign: "left", maxWidth: "none" }}>
            Pick an endpoint to reorder fields, rename labels and set placeholders.
          </p>
        )}
      </div>
    </section>
  );

  /* ── Preview panel ── */
  let previewBody: React.ReactNode;
  if (phase.status === "idle") {
    previewBody = (
      <StateCard
        key="idle"
        icon={<Link2 size={22} />}
        title="Paste a Swagger link to begin"
        text="We read your OpenAPI 3 document, resolve every $ref and turn a POST endpoint into a working, validated form."
        hint="No account, no upload — the document is fetched straight from your browser."
      >
        <div className="sfb-ghost" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <button type="button" className="sfb-btn sfb-btn--primary" onClick={() => void handleDemo()}>
          Try the built-in demo
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </StateCard>
    );
  } else if (phase.status === "loading") {
    previewBody = (
      <div key="loading" className="sfb-skeleton" aria-busy="true" aria-label="Loading specification">
        <div className="sfb-skel sfb-skel--short" />
        <div className="sfb-skel" />
        <div className="sfb-skel" />
        <div className="sfb-skel" />
      </div>
    );
  } else if (phase.status === "error") {
    previewBody = (
      <StateCard key="error" role="alert" tone="error" icon={errorIcon(phase.error.code)} title={errorTitle(phase.error.code)} text={phase.error.message} hint={phase.error.hint}>
        <button type="button" className="sfb-btn" onClick={() => void handleFetch(phase.url)} disabled={phase.url === "demo"}>
          <RotateCcw size={14} aria-hidden="true" />
          Try again
        </button>
        <button type="button" className="sfb-btn sfb-btn--primary" onClick={() => void handleDemo()}>
          Use the demo spec
        </button>
      </StateCard>
    );
  } else if (!endpoint || !model || !settings) {
    previewBody = (
      <StateCard
        key="choose"
        icon={<ArrowRight size={22} />}
        title={postEndpoints.length === 0 ? "No POST endpoints here" : "Choose an endpoint"}
        text={
          postEndpoints.length === 0
            ? "This document only defines " + Object.keys(phase.spec.methodCounts).map((m) => m.toUpperCase()).join(", ") + " operations. POST is the only supported method in this version."
            : "Select a POST endpoint and its form appears here instantly."
        }
      />
    );
  } else if (fields.length === 0) {
    previewBody = (
      <StateCard
        key={"empty-" + endpoint.id}
        icon={<FileQuestion size={22} />}
        title="Nothing to build a form from"
        text={model.notices[0] ?? "Every property of this endpoint uses a type that isn't supported yet."}
        hint={model.skipped.length ? "Skipped: " + model.skipped.map((s) => s.name).join(", ") : "This endpoint takes no body or parameters."}
      />
    );
  } else {
    previewBody = (
      <motion.div key={"form-" + endpoint.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={SOFT_SPRING}>
        <div className="sfb-preview-body">
          <h2 className="sfb-preview-name">{endpoint.summary || componentNameFor(endpoint).replace(/Form$/, "")}</h2>
          <p className="sfb-preview-sub">
            Live preview — validation, labels and layout behave exactly like the exported code.
          </p>
          {model.notices.map((notice) => (
            <p key={notice} className="sfb-note" style={{ margin: "0 0 16px" }}>
              {notice}
            </p>
          ))}
          <LiveForm key={endpoint.id} spec={phase.spec} endpoint={endpoint} fields={fields} columns={settings.columns} theme={themeName} onExport={openExport} />
        </div>
      </motion.div>
    );
  }

  const previewPanel = (
    <section className="sfb-card sfb-live" aria-label="Live form preview">
      <div className="sfb-preview-head">
        <div className="sfb-preview-title">
          {endpoint ? (
            <>
              <span className="sfb-method">POST</span>
              <PathLabel path={endpoint.path} />
            </>
          ) : (
            <span className="sfb-panel-title">Live preview</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {canExport ? (
            <motion.button
              type="button"
              className="sfb-btn sfb-btn--primary sfb-btn--sm"
              whileTap={{ scale: 0.96 }}
              onClick={openExport}
              title="Open export code panel"
              style={{ height: "30px", padding: "0 12px", fontSize: "12px", fontWeight: 650 }}
            >
              <Code2 size={13} aria-hidden="true" />
              <span>Export Code</span>
            </motion.button>
          ) : null}
          <span className="sfb-panel-meta">{fields.length ? "Interactive" : "Waiting"}</span>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {previewBody}
      </AnimatePresence>
    </section>
  );

  const codePanel =
    spec && model && canExport ? (
      <section className="sfb-card" aria-label="Exported code" style={{ overflow: "hidden" }}>
        <ExportPanel
          inline
          spec={spec}
          model={model}
          fields={fields}
          columns={settings?.columns ?? 1}
          transport={transport}
          onTransportChange={setTransport}
          useClient={useClient}
          onUseClientChange={setUseClient}
        />
      </section>
    ) : (
      <section className="sfb-card">
        <StateCard icon={<Code2 size={22} />} title="No code yet" text="Choose an endpoint with at least one supported field, then export React Hook Form + zod code you can paste into any project." />
      </section>
    );

  const tabs: { id: CompactTab; label: string }[] = [
    { id: "source", label: "Source" },
    { id: "fields", label: "Fields" },
    { id: "preview", label: "Preview" },
    { id: "code", label: "Code" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={uid}>
        <div
          ref={rootRef}
          className="sfb-root"
          data-theme={themeName}
          data-layout={layout}
          style={{ ["--sfb-vh" as string]: viewportH ? viewportH + "px" : undefined }}
        >
          <style>{SHELL_CSS}</style>
          <div className="sfb-bg" aria-hidden="true" />

          <div className="sfb-content" inert={exportOpen && !compact ? true : undefined}>
            <header className="sfb-top">
              <div className="sfb-brand">
                <span className="sfb-brand-mark" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h7M2 8h12M2 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M11.5 2.5 14 4l-2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="sfb-brand-name">NexoreUI</span>
                {!compact ? <span className="sfb-brand-tag">Templates</span> : null}
              </div>
              <div className="sfb-top-actions">
                <motion.button
                  type="button"
                  className="sfb-btn sfb-btn--icon"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setDark((value) => !value)}
                  aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                  id="sfb-theme-toggle"
                >
                  {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                </motion.button>
                <motion.button
                  ref={exportButtonRef}
                  type="button"
                  className="sfb-btn sfb-btn--primary"
                  whileTap={{ scale: 0.96 }}
                  disabled={!canExport}
                  onClick={openExport}
                  id="sfb-export-btn"
                  aria-haspopup={compact ? undefined : "dialog"}
                >
                  <Code2 size={15} aria-hidden="true" />
                  Export
                </motion.button>
              </div>
            </header>

            <section className="sfb-hero" aria-labelledby={uid + "-h1"}>
              <p className="sfb-eyebrow">OpenAPI 3 · POST → React Hook Form</p>
              <h1 className="sfb-h1" id={uid + "-h1"}>
                Swagger <em>→</em> Form Builder
              </h1>
              <p className="sfb-lede">
                Paste a link to your API spec, pick an endpoint, and get a validated, production-ready form with live preview and clean, copy-paste code.
              </p>

              <form
                className="sfb-card sfb-bar"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleFetch();
                }}
              >
                <span className="sfb-bar-icon" aria-hidden="true">
                  <Link2 size={17} />
                </span>
                <label className="sfb-sr" htmlFor="sfb-url-input">
                  OpenAPI document URL
                </label>
                <input
                  ref={urlInputRef}
                  id="sfb-url-input"
                  className="sfb-bar-input"
                  type="text"
                  inputMode="url"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="https://petstore3.swagger.io/api/v3/openapi.json"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  aria-describedby={phase.status === "error" ? "sfb-url-help" : undefined}
                />
                {!compact && url ? <span className="sfb-kbd" aria-hidden="true">↵</span> : null}
                <motion.button type="submit" className="sfb-btn sfb-btn--primary" whileTap={{ scale: 0.96 }} disabled={phase.status === "loading" || !url.trim()} id="sfb-fetch-btn">
                  {phase.status === "loading" ? <Loader2 size={15} className="sfb-spin" aria-hidden="true" /> : null}
                  {phase.status === "loading" ? "Fetching" : "Fetch"}
                </motion.button>
              </form>
              {phase.status === "error" ? (
                <span className="sfb-sr" id="sfb-url-help">
                  {phase.error.message}
                </span>
              ) : null}

              <div className="sfb-samples">
                <span className="sfb-samples-label">Try</span>
                {SAMPLE_LINKS.map((sample) => (
                  <motion.button
                    key={sample.id}
                    type="button"
                    className="sfb-chip"
                    whileTap={{ scale: 0.96 }}
                    disabled={phase.status === "loading"}
                    onClick={() => {
                      setUrl(sample.url);
                      void handleFetch(sample.url);
                    }}
                  >
                    {sample.label}
                  </motion.button>
                ))}
                <motion.button type="button" className="sfb-chip" whileTap={{ scale: 0.96 }} disabled={phase.status === "loading"} onClick={() => void handleDemo()}>
                  Built-in demo
                </motion.button>
              </div>
            </section>

            {compact ? (
              <div className="sfb-work">
                <div className="sfb-tabs" role="tablist" aria-label="Workspace sections">
                  {tabs.map((tab) => {
                    const selected = compactTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={uid + "-tab-" + tab.id}
                        aria-selected={selected}
                        aria-controls={uid + "-panel"}
                        tabIndex={selected ? 0 : -1}
                        className="sfb-tab"
                        onClick={() => setCompactTab(tab.id)}
                        onKeyDown={(event) => {
                          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                          event.preventDefault();
                          const index = tabs.findIndex((t) => t.id === tab.id);
                          const next = tabs[(index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
                          setCompactTab(next.id);
                          document.getElementById(uid + "-tab-" + next.id)?.focus();
                        }}
                      >
                        {selected ? <motion.span layoutId={"sfb-tab-pill-" + uid} className="sfb-tab-pill" transition={SPRING} /> : null}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div role="tabpanel" id={uid + "-panel"} aria-labelledby={uid + "-tab-" + compactTab}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={compactTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                      {compactTab === "source" ? endpointsPanel : compactTab === "fields" ? fieldsPanel : compactTab === "preview" ? previewPanel : codePanel}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="sfb-work">
                <div className="sfb-col">
                  {endpointsPanel}
                  {fieldsPanel}
                </div>
                <div className="sfb-col sfb-sticky">{previewPanel}</div>
              </div>
            )}
          </div>

          {/* Export drawer (tablet & desktop). On mobile the Code tab replaces it. */}
          <div className="sfb-overlay">
            <AnimatePresence>
              {exportOpen && !compact && spec && model ? (
                <>
                  <motion.div
                    key="scrim"
                    className="sfb-scrim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeExport}
                    aria-hidden="true"
                  />
                  <motion.aside
                    key="drawer"
                    className="sfb-drawer"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sfb-export-title"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={SOFT_SPRING}
                  >
                    <ExportPanel
                      spec={spec}
                      model={model}
                      fields={fields}
                      columns={settings?.columns ?? 1}
                      transport={transport}
                      onTransportChange={setTransport}
                      useClient={useClient}
                      onUseClientChange={setUseClient}
                      onClose={closeExport}
                      closeRef={closeButtonRef}
                    />
                  </motion.aside>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
