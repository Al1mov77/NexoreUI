"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, ExternalLink, Settings, Play } from "lucide-react";
import { Button } from "nexoreui";

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
}

const fileMapping: Record<string, string> = {
  Button: "button.tsx",
  Card: "card.tsx",
  Input: "input.tsx",
  Alert: "alert.tsx",
  Modal: "dialog.tsx",
  Badge: "badge.tsx",
};

export function PropsEditor({
  component: Component,
  controls,
  componentName,
  importFrom,
}: PropsEditorProps) {
  // Initialize values state from defaultValues
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    controls.forEach((ctrl) => {
      initial[ctrl.name] = ctrl.defaultValue;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);

  const handlePropChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Generate code snippet dynamically based on current values
  const generatedCode = useMemo(() => {
    const importStatement = `import { ${componentName} } from "${importFrom}"\n\n`;

    if (componentName === "Avatar") {
      const src = values["src"] || "";
      const fallback = values["fallback"] || "";
      return `import { Avatar, AvatarImage, AvatarFallback } from "${importFrom}"\n\n<Avatar>\n  <AvatarImage src="${src}" />\n  <AvatarFallback>${fallback}</AvatarFallback>\n</Avatar>`;
    }

    if (componentName === "Tooltip") {
      const content = values["content"] || "Tooltip text";
      const side = values["side"] || "top";
      const variant = values["variant"] || "default";
      const sideStr = side !== "top" ? ` side="${side}"` : "";
      const variantStr = variant !== "default" ? ` variant="${variant}"` : "";
      return `import { Tooltip, Button } from "${importFrom}"\n\n<Tooltip content="${content}"${sideStr}${variantStr}>\n  <Button variant="outline">Hover me</Button>\n</Tooltip>`;
    }

    if (componentName === "StatCard") {
      const title = values["title"] || "";
      const value = values["value"] || "";
      const description = values["description"] || "";
      const titleStr = title ? ` title="${title}"` : "";
      const valueStr = value ? ` value="${value}"` : "";
      const descStr = description ? ` description="${description}"` : "";
      return `import { StatCard } from "${importFrom}"\n\n<StatCard${titleStr}${valueStr}${descStr} />`;
    }

    if (componentName === "Breadcrumb") {
      return `import { Breadcrumb } from "${importFrom}"\n\n<Breadcrumb\n  items={[\n    { label: "Home", href: "#" },\n    { label: "Components", href: "#" },\n    { label: "Breadcrumb" }\n  ]}\n/>`;
    }

    const propStrings = Object.entries(values)
      .filter(([key, val]) => {
        if (key === "children") return false;
        const ctrl = controls.find((c) => c.name === key);
        if (!ctrl) return false;
        
        // Don't generate props that are set to their default values (cleaner JSX output)
        if (val === ctrl.defaultValue) return false;
        return true;
      })
      .map(([key, val]) => {
        if (typeof val === "boolean") {
          return val ? `${key}` : `${key}={${val}}`;
        }
        if (typeof val === "number") {
          return `${key}={${val}}`;
        }
        return `${key}="${val}"`;
      });

    const propsStr = propStrings.length > 0 ? " " + propStrings.join(" ") : "";
    const childrenVal = values["children"];

    if (childrenVal !== undefined && childrenVal !== null && childrenVal !== "") {
      return `${importStatement}<${componentName}${propsStr}>\n  ${childrenVal}\n</${componentName}>`;
    } else {
      return `${importStatement}<${componentName}${propsStr} />`;
    }
  }, [values, controls, componentName, importFrom]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gitHubLink = useMemo(() => {
    const file = fileMapping[componentName] || `${componentName.toLowerCase()}.tsx`;
    return `https://github.com/Al1mov77/NexoreUI/blob/main/packages/ui/src/components/${file}`;
  }, [componentName]);

  // Adjust props for Component invocation
  const componentProps = { ...values };
  
  // If component is Modal, intercept onOpenChange to keep panel state in sync
  if (componentName === "Modal") {
    componentProps.onOpenChange = (open: boolean) => {
      handlePropChange("isOpen", open);
    };
  }

  // If component is Switch, intercept onCheckedChange to keep checked state in sync
  if (componentName === "Switch") {
    componentProps.onCheckedChange = (checked: boolean) => {
      handlePropChange("checked", checked);
    };
  }

  // If component is Slider, intercept onChange to keep internal state in sync
  if (componentName === "Slider") {
    componentProps.onChange = (val: number) => {
      handlePropChange("value", val);
    };
  }

  const { children, ...restProps } = componentProps;

  return (
    <div className="border border-border/80 rounded-2xl bg-card/40 backdrop-blur-md overflow-hidden shadow-xl animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-border/60 bg-muted/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm tracking-tight">{componentName} Playground</span>
        </div>
        <div className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
          {importFrom}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {/* Live Preview Panel (3/5 width on large screen) */}
        <div className="lg:col-span-3 flex flex-col min-h-[300px]">
          <div className="bg-muted/10 px-4 py-2 border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Live Preview
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-grid-white/[0.02] bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden">
            {componentName === "Modal" && !values.isOpen ? (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">The modal is closed. Click the button below or check the "isOpen" control to open it.</p>
                <Button 
                  onClick={() => handlePropChange("isOpen", true)}
                  className="inline-flex items-center gap-2"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Open Modal
                </Button>
              </div>
            ) : componentName === "Modal" ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Modal is rendering in an overlay...</p>
                <Button variant="outline" onClick={() => handlePropChange("isOpen", false)}>
                  Close Programmatically
                </Button>
                {/* Actually render the Modal component in the DOM so the portal is mounted */}
                <Component {...restProps}>
                  {children}
                </Component>
              </div>
            ) : (
              <Component {...restProps}>
                {children}
              </Component>
            )}
          </div>
        </div>

        {/* Props Controls Panel (2/5 width on large screen) */}
        <div className="lg:col-span-2 flex flex-col max-h-[450px] lg:max-h-none overflow-y-auto">
          <div className="bg-muted/10 px-4 py-2 border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Props Panel
          </div>
          <div className="p-5 space-y-5">
            {controls.map((ctrl) => (
              <div key={ctrl.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground/90 font-mono">
                    {ctrl.name}
                  </label>
                  <span className="text-[10px] text-muted-foreground/60 italic">
                    {ctrl.type}
                  </span>
                </div>

                {ctrl.type === "select" && (
                  <select
                    value={values[ctrl.name]}
                    onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                    className="w-full bg-background/50 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    {ctrl.options?.map((opt) => (
                      <option key={opt} value={opt} className="bg-card text-foreground">
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {ctrl.type === "text" && (
                  <input
                    type="text"
                    value={values[ctrl.name]}
                    onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                    className="w-full bg-background/50 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                )}

                {ctrl.type === "boolean" && (
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!values[ctrl.name]}
                        onChange={(e) => handlePropChange(ctrl.name, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                )}

                {ctrl.type === "number" && (
                  <input
                    type="number"
                    value={values[ctrl.name]}
                    onChange={(e) => handlePropChange(ctrl.name, Number(e.target.value))}
                    className="w-full bg-background/50 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                )}

                {ctrl.type === "color" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="w-7 h-7 rounded border border-border/80 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="flex-1 bg-background/50 border border-border/80 rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground leading-normal pl-0.5">
                  {ctrl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Generation Section */}
      <div className="border-t border-border/60 bg-muted/10">
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-border/40">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Generated Code
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-background border border-border/80 px-2.5 py-1 rounded-md transition-all active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Copied</span>
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-background border border-border/80 px-2.5 py-1 rounded-md transition-all active:scale-95"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Open in GitHub</span>
            </a>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-xs text-violet-400 dark:text-violet-300 leading-relaxed pl-2 select-all">
            {generatedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
