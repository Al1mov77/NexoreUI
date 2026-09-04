"use client";

import React, { useState, useMemo } from "react";
import {
  Copy, Check, ExternalLink, Settings2, RotateCcw,
  Sparkles, Code2, Eye, Sliders, Smartphone, Monitor, Tablet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "../utils/clipboard";

export interface PropControl {
  name: string;
  type: "select" | "text" | "boolean" | "number" | "color";
  options?: string[];
  defaultValue: string | boolean | number;
  description: string;
}

export interface PropsEditorProps {
  component: React.ComponentType<any>;
  controls: PropControl[];
  componentName: string;
  importFrom: string;
  defaultProps?: Record<string, any>;
}

const fileMapping: Record<string, string> = {
  Button: "button.tsx",
  Card: "card.tsx",
  Input: "input.tsx",
  Alert: "alert.tsx",
  Dialog: "dialog.tsx",
  Accordion: "accordion.tsx",
  Tabs: "tabs.tsx",
  Badge: "badge.tsx",
  CustomizableTable: "table.tsx",
  Switch: "switch.tsx",
  Slider: "slider.tsx",
  Rating: "rating.tsx",
  Modal: "modal.tsx",
};

export function PropsEditor({
  component: Component,
  controls,
  componentName,
  importFrom,
  defaultProps = {},
}: PropsEditorProps) {
  // Initialize values state from defaultValues
  const initialValues = useMemo(() => {
    const initial: Record<string, any> = {};
    controls.forEach((ctrl) => {
      initial[ctrl.name] = ctrl.defaultValue;
    });
    return { ...initial, ...defaultProps };
  }, [controls, defaultProps]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "controls" | "code">("preview");
  const [viewportMode, setViewportMode] = useState<"full" | "tablet" | "mobile">("full");

  const handlePropChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setValues(initialValues);
  };

  const isModified = useMemo(() => {
    return controls.some((ctrl) => values[ctrl.name] !== ctrl.defaultValue);
  }, [controls, values]);

  // Generate code snippet dynamically based on current values
  const generatedCode = useMemo(() => {
    if (componentName === "Tabs") {
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const tab1 = values["tab1"] || "Account";
      const tab2 = values["tab2"] || "Password";
      const content1 = values["content1"] || "Make changes to your account here.";
      const content2 = values["content2"] || "Change your password here.";

      return `import { Tabs, TabsList, TabsTrigger, TabsContent } from "${importFrom}"

<Tabs defaultValue="tab1" className="w-full">
  <TabsList${variant}>
    <TabsTrigger${variant} value="tab1">${tab1}</TabsTrigger>
    <TabsTrigger${variant} value="tab2">${tab2}</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">${content1}</TabsContent>
  <TabsContent value="tab2">${content2}</TabsContent>
</Tabs>`;
    }

    if (componentName === "Accordion") {
      const type = values["type"] || "single";
      const collapsible = type === "single" && values["collapsible"] !== false ? " collapsible" : "";
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const itemVariant = values["itemVariant"] && values["itemVariant"] !== "default" ? ` variant="${values["itemVariant"]}"` : "";
      const iconType = values["iconType"] && values["iconType"] !== "chevron" ? ` iconType="${values["iconType"]}"` : "";

      const title1 = values["title1"] || "Is it accessible?";
      const content1 = values["content1"] || "Yes. It adheres to the WAI-ARIA design pattern.";
      const title2 = values["title2"] || "Is it styled?";
      const content2 = values["content2"] || "Yes. It comes with default styles.";

      return `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "${importFrom}"

<Accordion type="${type}"${collapsible}${variant} className="w-full">
  <AccordionItem value="item-1"${itemVariant}>
    <AccordionTrigger${iconType}>${title1}</AccordionTrigger>
    <AccordionContent>${content1}</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2"${itemVariant}>
    <AccordionTrigger${iconType}>${title2}</AccordionTrigger>
    <AccordionContent>${content2}</AccordionContent>
  </AccordionItem>
</Accordion>`;
    }

    if (componentName === "CustomizableTable") {
      const rawHeaders = values["headers"] || "User, Role, Status, Uptime";
      const headersArr = typeof rawHeaders === "string" ? rawHeaders.split(",").map((s: string) => s.trim()) : rawHeaders;
      const rowsArr: string[][] = [];
      ["row1", "row2", "row3", "row4"].forEach(key => {
        if (values[key]) {
          rowsArr.push(values[key].split(",").map((s: string) => s.trim()));
        }
      });
      if (rowsArr.length === 0) {
        rowsArr.push(
          ["Alice Vance", "System Architect", "Active", "99.98%"],
          ["Bob Marley", "Content Manager", "Offline", "94.12%"],
          ["Charlie Neon", "Lead Developer", "Active", "100.00%"]
        );
      }
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const density = values["density"] && values["density"] !== "normal" ? ` density="${values["density"]}"` : "";
      const hoverable = values["hoverable"] ? " hoverable" : "";
      const striped = values["striped"] ? " striped" : "";
      const bordered = values["bordered"] ? " bordered" : "";

      return `import { CustomizableTable } from "${importFrom}";

const headers = ${JSON.stringify(headersArr)};
const rows = ${JSON.stringify(rowsArr, null, 2)};

export default function TableDemo() {
  return (
    <CustomizableTable
      headers={headers}
      rows={rows}${variant}${density}${hoverable}${striped}${bordered}
    />
  );
}`;
    }

    if (componentName === "Stepper") {
      const currentStep = values["currentStep"] ?? 1;
      const orientation = values["orientation"] && values["orientation"] !== "horizontal" ? ` orientation="${values["orientation"]}"` : "";
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";

      return `import { Stepper } from "${importFrom}";

const steps = [
  { title: "Account", description: "Create credentials" },
  { title: "Payment", description: "Link payment card" },
  { title: "Review", description: "Final confirmation" },
];

export default function StepperDemo() {
  return (
    <Stepper
      currentStep={${currentStep}}
      steps={steps}${orientation}${variant}
    />
  );
}`;
    }

    // Default component code generator
    const propsList: string[] = [];
    let childrenContent = values.children || "";

    controls.forEach((ctrl) => {
      if (ctrl.name === "children") return;
      const val = values[ctrl.name];

      if (val === ctrl.defaultValue) return;

      if (ctrl.type === "boolean") {
        if (val) propsList.push(ctrl.name);
      } else if (ctrl.type === "number") {
        propsList.push(`${ctrl.name}={${val}}`);
      } else if (ctrl.type === "color") {
        propsList.push(`${ctrl.name}="${val}"`);
      } else if (val) {
        propsList.push(`${ctrl.name}="${val}"`);
      }
    });

    const propsString = propsList.length > 0 ? " " + propsList.join(" ") : "";

    if (childrenContent) {
      return `import { ${componentName} } from "${importFrom}"\n\n<${componentName}${propsString}>\n  ${childrenContent}\n</${componentName}>`;
    }

    return `import { ${componentName} } from "${importFrom}"\n\n<${componentName}${propsString} />`;
  }, [componentName, importFrom, controls, values]);

  const handleCopy = async () => {
    await copyToClipboard(generatedCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileName = fileMapping[componentName] || `${componentName.toLowerCase()}.tsx`;
  const gitHubLink = `https://github.com/Al1mov77/NexoreUI/tree/main/packages/ui/src/components/${fileName}`;

  return (
    <div id="playground" className="rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden shadow-lg space-y-0">
      {/* Mobile Navigation Tabs (Preview / Controls / Code) - Visible < lg */}
      <div className="flex lg:hidden items-center justify-between border-b border-border bg-muted/30 p-2">
        <div className="flex items-center gap-1">
          {[
            { id: "preview", label: "Preview", icon: Eye },
            { id: "controls", label: "Controls", icon: Sliders },
            { id: "code", label: "Code", icon: Code2 },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {isModified && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/60"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Container: 2-column on desktop, tabbed on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Left Area: Interactive Live Canvas (Col 1-8) */}
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-border ${
            activeTab === "controls" && "hidden lg:flex"
          } ${activeTab === "code" && "hidden lg:flex"}`}
        >
          {/* Top Bar with Viewport options & actions */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Live Canvas</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Interactive
              </span>
            </div>

            {/* Viewport Width Controls for Desktop with clear tooltips and dimensions */}
            <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/80 shadow-xs">
              <button
                onClick={() => setViewportMode("full")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewportMode === "full"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Desktop: 100% full width"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[11px]">Desktop</span>
              </button>
              <button
                onClick={() => setViewportMode("tablet")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewportMode === "tablet"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Tablet: 768px width"
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="text-[11px]">Tablet</span>
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewportMode === "mobile"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Mobile: 375px width"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-[11px]">Mobile</span>
              </button>
            </div>
          </div>

          {/* Dynamic event handlers for interactive components */}
          {(() => {
            const interactiveHandlers: Record<string, any> = {};

            if ("checked" in values) {
              interactiveHandlers.onCheckedChange = (checked: boolean) => {
                handlePropChange("checked", checked);
              };
            }

            if ("value" in values) {
              interactiveHandlers.onChange = (val: any) => {
                handlePropChange("value", typeof val === "number" ? val : val);
              };
              interactiveHandlers.onValueChange = (val: any) => {
                handlePropChange("value", Array.isArray(val) ? val[0] : val);
              };
            }

            if ("currentStep" in values) {
              interactiveHandlers.onStepClick = (step: number) => {
                handlePropChange("currentStep", step);
              };
              interactiveHandlers.onStepChange = (step: number) => {
                handlePropChange("currentStep", step);
              };
            }

            return (
              <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-zinc-50/90 dark:bg-zinc-950/60 relative overflow-hidden demo-grid-pattern min-h-[340px]">
                {viewportMode === "full" ? (
                  <motion.div
                    key="full-view"
                    layout
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex items-center justify-center py-8"
                  >
                    <Component {...values} {...interactiveHandlers} />
                  </motion.div>
                ) : viewportMode === "tablet" ? (
                  <motion.div
                    key="tablet-frame"
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full max-w-[768px] rounded-3xl border-4 border-zinc-800 bg-background shadow-2xl overflow-hidden my-4"
                  >
                    {/* Tablet Device Header */}
                    <div className="h-7 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                        <span>Tablet Canvas</span>
                      </div>
                      <span className="font-semibold text-zinc-300">768 × 1024 px</span>
                      <div className="w-10" />
                    </div>
                    {/* Screen Content */}
                    <div className="p-8 min-h-[220px] flex items-center justify-center bg-card/40">
                      <Component {...values} {...interactiveHandlers} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="mobile-frame"
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full max-w-[375px] rounded-[36px] border-4 border-zinc-800 bg-background shadow-2xl overflow-hidden my-4"
                  >
                    {/* Phone Notch & Header */}
                    <div className="pt-3 pb-2 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span>9:41</span>
                      {/* Dynamic Island / Notch */}
                      <div className="w-16 h-3 rounded-full bg-zinc-800 border border-zinc-700/60" />
                      <span className="text-[9px] text-zinc-400">375px</span>
                    </div>
                    {/* Phone Screen Area */}
                    <div className="p-6 min-h-[240px] flex items-center justify-center bg-card/40">
                      <Component {...values} {...interactiveHandlers} />
                    </div>
                    {/* Home Indicator Bar */}
                    <div className="h-4 bg-zinc-900 flex items-center justify-center">
                      <div className="w-24 h-1 rounded-full bg-zinc-700" />
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Right Sidebar: Props / Controls Panel (Col 9-12) */}
        <div
          className={`lg:col-span-5 xl:col-span-4 flex flex-col bg-card/40 ${
            activeTab !== "controls" && "hidden lg:flex"
          }`}
        >
          {/* Controls Panel Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Controls
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                ({controls.length})
              </span>
            </div>

            {isModified && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline transition-all"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Controls List */}
          <div className="flex-1 p-4 space-y-4 max-h-[460px] overflow-y-auto">
            {controls.map((ctrl) => {
              const isDifferent = values[ctrl.name] !== ctrl.defaultValue;

              return (
                <div
                  key={ctrl.name}
                  className={`p-3 rounded-xl border transition-all ${
                    isDifferent
                      ? "border-primary/50 bg-primary/5 shadow-xs"
                      : "border-zinc-200/90 dark:border-border/60 bg-zinc-50/60 dark:bg-card/60 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-foreground">
                        {ctrl.name}
                      </span>
                      {isDifferent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-muted-foreground/70 uppercase">
                      {ctrl.type}
                    </span>
                  </div>

                  {/* Select Control */}
                  {ctrl.type === "select" && (
                    <select
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="w-full bg-white dark:bg-background border border-zinc-300 dark:border-border rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                    >
                      {ctrl.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-white dark:bg-card text-foreground">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Text Control */}
                  {ctrl.type === "text" && (
                    <input
                      type="text"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="w-full bg-white dark:bg-background border border-zinc-300 dark:border-border rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  )}

                  {/* Boolean Switch Control */}
                  {ctrl.type === "boolean" && (
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] text-zinc-600 dark:text-muted-foreground">Toggle state:</span>
                      <button
                        type="button"
                        onClick={() => handlePropChange(ctrl.name, !values[ctrl.name])}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border ${
                          values[ctrl.name]
                            ? "bg-primary border-primary"
                            : "bg-zinc-300 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                            values[ctrl.name] ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Number Control */}
                  {ctrl.type === "number" && (
                    <input
                      type="number"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  )}

                  {/* Color Control */}
                  {ctrl.type === "color" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={values[ctrl.name]}
                        onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                        className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={values[ctrl.name]}
                        onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                        className="flex-1 bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground leading-tight mt-1.5">
                    {ctrl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code Generation Section (Bottom Bar on Desktop, Tab on Mobile) */}
      <div
        className={`border-t border-zinc-200 dark:border-border bg-zinc-50/80 dark:bg-[#0c0d12] ${
          activeTab === "preview" && "hidden lg:block"
        } ${activeTab === "controls" && "hidden lg:block"}`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-100/90 dark:bg-[#0e0f16]">
          <div className="flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Generated JSX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <a
              href={gitHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Source</span>
            </a>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-52 bg-white/60 dark:bg-[#090a0d]">
          <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed select-all">
            {generatedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
