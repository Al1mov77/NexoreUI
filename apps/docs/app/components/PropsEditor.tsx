"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Settings2,
  RotateCcw,
  Code2,
  Eye,
  Sliders,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  Avatar: "avatar.tsx",
  Tooltip: "tooltip.tsx",
  Progress: "progress.tsx",
  Skeleton: "skeleton.tsx",
  Loader: "loader.tsx",
  Toaster: "toaster.tsx",
  Drawer: "premium-overlays.tsx",
  CommandPalette: "premium-overlays.tsx",
  ChatMessage: "premium-social.tsx",
  DarkModeToggle: "dark-mode.tsx",
  CustomizableTable: "table.tsx",
  Switch: "switch.tsx",
  Slider: "slider.tsx",
  Rating: "rating.tsx",
  Modal: "dialog.tsx",
  Dock: "dock.tsx",
  ScrollArea: "scroll-area.tsx",
  FileUpload: "file-upload.tsx",
  Checkbox: "checkbox.tsx",
  Select: "select.tsx",
  Stepper: "stepper.tsx",
  StatCard: "data-display.tsx",
};

export function PropsEditor({
  component: Component,
  controls,
  componentName,
  importFrom,
  defaultProps = {},
}: PropsEditorProps) {
  const prefersReducedMotion = useReducedMotion();

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

  const generatedCode = useMemo(() => {
    if (componentName === "Tabs") {
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const tab1 = values["tab1"] || "Account";
      const tab2 = values["tab2"] || "Password";
      const content1 = values["content1"] || "Make changes to your account here.";
      const content2 = values["content2"] || "Change your password here.";

      return `import { Tabs, TabsList, TabsTrigger, TabsContent } from "${importFrom}";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="tab1" className="w-full max-w-md">
      <TabsList${variant}>
        <TabsTrigger${variant} value="tab1">${tab1}</TabsTrigger>
        <TabsTrigger${variant} value="tab2">${tab2}</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">${content1}</TabsContent>
      <TabsContent value="tab2">${content2}</TabsContent>
    </Tabs>
  );
}`;
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

      return `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "${importFrom}";

export default function AccordionDemo() {
  return (
    <Accordion type="${type}"${collapsible}${variant} className="w-full max-w-md">
      <AccordionItem value="item-1"${itemVariant}>
        <AccordionTrigger${iconType}>${title1}</AccordionTrigger>
        <AccordionContent>${content1}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2"${itemVariant}>
        <AccordionTrigger${iconType}>${title2}</AccordionTrigger>
        <AccordionContent>${content2}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;
    }

    if (componentName === "Card") {
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const hover = values["hover"] && values["hover"] !== "lift" ? ` hover="${values["hover"]}"` : "";
      const animate = values["animate"] === false ? " animate={false}" : "";
      const title = values["title"] || "Workspace Overview";
      const description = values["description"] || "Manage API keys, billing alerts, and team access.";
      const body = values["children"] || "Changes take effect across all edge regions immediately.";

      return `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "${importFrom}";

export default function CardDemo() {
  return (
    <Card${variant}${hover}${animate} className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>${title}</CardTitle>
        <CardDescription>${description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">${body}</p>
      </CardContent>
    </Card>
  );
}`;
    }

    if (componentName === "Dock") {
      const variant = values["variant"] && values["variant"] !== "expanding" ? `\n      variant="${values["variant"]}"` : "";
      const orientation = values["orientation"] && values["orientation"] !== "horizontal" ? `\n      orientation="${values["orientation"]}"` : "";

      return `import { useState } from "react";
import { Dock } from "${importFrom}";
import { Home, FolderGit2, Layers, Settings, Terminal } from "lucide-react";

const items = [
  { id: "home", icon: <Home className="h-4 w-4" />, label: "Overview", shortcut: "1" },
  { id: "projects", icon: <FolderGit2 className="h-4 w-4" />, label: "Projects", badge: 4, shortcut: "2" },
  { id: "components", icon: <Layers className="h-4 w-4" />, label: "Components", shortcut: "3", dividerAfter: true },
  { id: "console", icon: <Terminal className="h-4 w-4" />, label: "Console", shortcut: "4" },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings", shortcut: "5" },
];

export default function DockDemo() {
  const [activeId, setActiveId] = useState("home");

  return (
    <Dock
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}${variant}${orientation}
    />
  );
}`;
    }

    if (componentName === "ScrollArea") {
      const type = values["type"] && values["type"] !== "auto" ? ` type="${values["type"]}"` : "";
      const delay = values["scrollHideDelay"] !== undefined && values["scrollHideDelay"] !== 600
        ? ` scrollHideDelay={${values["scrollHideDelay"]}}`
        : "";

      return `import { ScrollArea } from "${importFrom}";

const releases = [
  "v2.4.0 — Keyboard navigation and ARIA improvements",
  "v2.3.1 — Token-aligned border and surface states",
  "v2.3.0 — Responsive container query adjustments",
  "v2.2.0 — Reduced motion support across transitions",
  "v2.1.4 — Horizontal scrollbar orientation fixes",
  "v2.1.0 — Initial release with Radix primitive",
];

export default function ScrollAreaDemo() {
  return (
    <ScrollArea${type}${delay} className="h-48 w-full max-w-xs rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-semibold mb-3 text-foreground">Release Notes</div>
      <div className="space-y-2">
        {releases.map((entry) => (
          <div key={entry} className="text-xs text-muted-foreground py-1.5 border-b border-border/60 last:border-0">
            {entry}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`;
    }

    if (componentName === "FileUpload") {
      const variant = values["variant"] && values["variant"] !== "default" ? `\n        variant="${values["variant"]}"` : "";
      const multiple = values["multiple"] ? "\n        multiple" : "";
      const accept = values["accept"] ? `\n        accept="${values["accept"]}"` : "";
      const maxSize = values["maxSize"] && values["maxSize"] !== 10485760 ? `\n        maxSize={${values["maxSize"]}}` : "";

      return `import { useState } from "react";
import { FileUpload } from "${importFrom}";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md space-y-2">
      <FileUpload${variant}${multiple}${accept}${maxSize}
        onUpload={setFiles}
      />
      {files.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Selected {files.length} file(s)
        </p>
      )}
    </div>
  );
}`;
    }

    if (componentName === "Slider") {
      const initialVal = values["value"] ?? 50;
      const min = values["min"] !== undefined && values["min"] !== 0 ? ` min={${values["min"]}}` : "";
      const max = values["max"] !== undefined && values["max"] !== 100 ? ` max={${values["max"]}}` : "";
      const step = values["step"] !== undefined && values["step"] !== 1 ? ` step={${values["step"]}}` : "";
      const showValue = values["showValue"] ? " showValue" : "";

      return `import { useState } from "react";
import { Slider } from "${importFrom}";

export default function SliderDemo() {
  const [value, setValue] = useState(${initialVal});

  return (
    <div className="w-full max-w-sm">
      <Slider
        value={value}
        onChange={setValue}${min}${max}${step}${showValue}
      />
    </div>
  );
}`;
    }

    if (componentName === "Rating") {
      const variant = values["variant"] && values["variant"] !== "primary" ? `\n      variant="${values["variant"]}"` : "";
      const icon = values["icon"] && values["icon"] !== "star" ? `\n      icon="${values["icon"]}"` : "";
      const size = values["size"] && values["size"] !== "md" ? `\n      size="${values["size"]}"` : "";
      const max = values["max"] !== undefined && values["max"] !== 5 ? `\n      max={${values["max"]}}` : "";
      const allowHalf = values["allowHalf"] ? "\n      allowHalf" : "";
      const showScore = values["showScore"] ? "\n      showScore" : "";
      const readonly = values["readonly"] ? "\n      readonly" : "";

      return `import { useState } from "react";
import { Rating } from "${importFrom}";

export default function RatingDemo() {
  const [rating, setRating] = useState(4.5);

  return (
    <Rating
      value={rating}
      onChange={setRating}${variant}${icon}${size}${max}${allowHalf}${showScore}${readonly}
    />
  );
}`;
    }

    if (componentName === "Checkbox") {
      const initialChecked = values["checked"] !== false;
      const disabled = values["disabled"] ? " disabled" : "";

      return `import { useState } from "react";
import { Checkbox } from "${importFrom}";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(${initialChecked});

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms-checkbox"
        checked={checked}
        onCheckedChange={setChecked}${disabled}
      />
      <label htmlFor="terms-checkbox" className="text-sm font-medium cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  );
}`;
    }

    if (componentName === "Switch") {
      const initialChecked = Boolean(values["checked"]);
      const disabled = values["disabled"] ? " disabled" : "";

      return `import { useState } from "react";
import { Switch } from "${importFrom}";

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(${initialChecked});

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="airplane-mode"
        checked={enabled}
        onCheckedChange={setEnabled}${disabled}
      />
      <label htmlFor="airplane-mode" className="text-sm font-medium cursor-pointer">
        Airplane Mode
      </label>
    </div>
  );
}`;
    }

    if (componentName === "CustomizableTable") {
      const rawHeaders = values["headers"] || "User, Role, Status, Uptime";
      const headersArr =
        typeof rawHeaders === "string"
          ? rawHeaders.split(",").map((s: string) => s.trim())
          : rawHeaders;
      const rowsArr: string[][] = [];
      ["row1", "row2", "row3", "row4"].forEach((key) => {
        if (values[key]) {
          rowsArr.push(values[key].split(",").map((s: string) => s.trim()));
        }
      });
      if (rowsArr.length === 0) {
        rowsArr.push(
          ["Mina Kato", "Systems Engineer", "Active", "99.98%"],
          ["Tomas Lind", "Operations Lead", "Offline", "94.12%"],
          ["Nadia Okafor", "Frontend Lead", "Active", "100.00%"]
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
      const size = values["size"] && values["size"] !== "md" ? ` size="${values["size"]}"` : "";

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
      steps={steps}${orientation}${variant}${size}
    />
  );
}`;
    }

    if (componentName === "Dialog" || componentName === "Modal") {
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const size = values["size"] && values["size"] !== "lg" ? ` size="${values["size"]}"` : "";
      const scrollable = values["scrollable"] ? " scrollable" : "";
      const showEscHint = values["showEscHint"] !== false ? " showEscHint" : "";
      const title = values["title"] || "Workspace Settings";
      const description = values["description"] || "Update runtime limits and webhook targets for this environment.";
      const confirmText = values["confirmText"] || "Save changes";
      const cancelText = values["cancelText"] || "Cancel";
      const body = values["children"] || "All configuration changes synchronize across edge nodes immediately.";

      return `import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from "${importFrom}";

export default function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Live Dialog</Button>
      </DialogTrigger>
      <DialogContent${variant}${size}${scrollable}${showEscHint}>
        <DialogHeader>
          <DialogTitle>${title}</DialogTitle>
          <DialogDescription>${description}</DialogDescription>
        </DialogHeader>
        <DialogBody>${body}</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">${cancelText}</Button>
          </DialogClose>
          <Button
            variant="${values["variant"] === "destructive" ? "destructive" : "default"}"
            onClick={() => setOpen(false)}
          >
            ${confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;
    }

    if (componentName === "Drawer") {
      const side = values["side"] || "right";
      const size = values["size"] || "md";
      const title = values["title"] || "Deployment Settings";
      const description = values["description"] || "Configure edge cache headers and webhook signatures.";

      return `import { useState } from "react";
import { Drawer, Button } from "${importFrom}";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open ${side} drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="${side}"
        size="${size}"
        title=${JSON.stringify(title)}
        description=${JSON.stringify(description)}
      >
        <p className="text-xs text-muted-foreground">
          Propagation across 4 edge clusters completes in under 300ms.
        </p>
      </Drawer>
    </div>
  );
}`;
    }

    if (componentName === "Alert") {
      const variant = values["variant"] && values["variant"] !== "default" ? `\n      variant="${values["variant"]}"` : "";
      const title = values["title"] || "Cluster sync complete";
      const description = values["description"] || "Configuration snapshots replicated across all regional nodes.";
      const meta = values["meta"] ? `\n      meta=${JSON.stringify(values["meta"])}` : "";
      const dismissible = values["dismissible"] ? "\n      dismissible" : "";
      const animate = values["animate"] === false ? "\n      animate={false}" : "";

      return `import { Alert } from "${importFrom}";

export default function AlertDemo() {
  return (
    <Alert${variant}
      title=${JSON.stringify(title)}
      description=${JSON.stringify(description)}${meta}${dismissible}${animate}
    />
  );
}`;
    }

    if (componentName === "Badge") {
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const size = values["size"] && values["size"] !== "default" ? ` size="${values["size"]}"` : "";
      const shape = values["shape"] && values["shape"] !== "pill" ? ` shape="${values["shape"]}"` : "";
      const dot = values["dot"] ? " dot" : "";
      const label = values["children"] || "Production";

      return `import { Badge } from "${importFrom}";

export default function BadgeDemo() {
  return (
    <Badge${variant}${size}${shape}${dot}>
      ${label}
    </Badge>
  );
}`;
    }

    if (componentName === "Avatar") {
      const size = values["size"] && values["size"] !== "default" ? ` size="${values["size"]}"` : "";
      const variant = values["variant"] && values["variant"] !== "default" ? ` variant="${values["variant"]}"` : "";
      const status = values["status"] ? ` status="${values["status"]}"` : "";
      const src = values["src"] || "";
      const fallback = values["fallback"] || "MK";

      return `import { Avatar, AvatarImage, AvatarFallback } from "${importFrom}";

export default function AvatarDemo() {
  return (
    <Avatar${size}${variant}${status}>
      <AvatarImage src=${JSON.stringify(src)} alt="Member avatar" />
      <AvatarFallback>${fallback}</AvatarFallback>
    </Avatar>
  );
}`;
    }

    if (componentName === "Tooltip") {
      const content = values["content"] || "Copy production webhook endpoint";
      const side = values["side"] && values["side"] !== "top" ? `\n      side="${values["side"]}"` : "";
      const variant = values["variant"] && values["variant"] !== "default" ? `\n      variant="${values["variant"]}"` : "";
      const shortcut = values["shortcut"] ? `\n      shortcut=${JSON.stringify(values["shortcut"])}` : "";
      const showArrow = values["showArrow"] === false ? "\n      showArrow={false}" : "";

      return `import { Tooltip, Button } from "${importFrom}";

export default function TooltipDemo() {
  return (
    <Tooltip
      content=${JSON.stringify(content)}${side}${variant}${shortcut}${showArrow}
    >
      <Button variant="outline">Hover or focus trigger</Button>
    </Tooltip>
  );
}`;
    }

    if (componentName === "Progress") {
      const value = values["value"] ?? 62;
      const variant = values["variant"] && values["variant"] !== "default" ? `\n      variant="${values["variant"]}"` : "";
      const size = values["size"] && values["size"] !== "default" ? `\n      size="${values["size"]}"` : "";
      const showLabel = values["showLabel"] ? "\n      showLabel" : "";
      const progressLabel = values["progressLabel"] && values["progressLabel"] !== "Progress"
        ? `\n      progressLabel=${JSON.stringify(values["progressLabel"])}`
        : "";
      const isIndeterminate = values["isIndeterminate"] ? "\n      isIndeterminate" : "";

      return `import { Progress } from "${importFrom}";

export default function ProgressDemo() {
  return (
    <div className="w-full max-w-md">
      <Progress
        value={${value}}${variant}${size}${showLabel}${progressLabel}${isIndeterminate}
      />
    </div>
  );
}`;
    }

    if (componentName === "Skeleton") {
      const variant = values["variant"] && values["variant"] !== "rect" ? `\n      variant="${values["variant"]}"` : "";
      const count = values["count"] !== undefined && values["count"] !== 1 ? `\n      count={${values["count"]}}` : "";
      const width = values["width"] ? `\n      width=${JSON.stringify(values["width"])}` : "";
      const height = values["height"] ? `\n      height=${JSON.stringify(values["height"])}` : "";
      const animated = values["animated"] === false ? "\n      animated={false}" : "";

      return `import { Skeleton } from "${importFrom}";

export default function SkeletonDemo() {
  return (
    <div className="w-full max-w-sm">
      <Skeleton${variant}${count}${width}${height}${animated} />
    </div>
  );
}`;
    }

    if (componentName === "Loader") {
      const variant = values["variant"] || "matrix";
      const size = values["size"] && values["size"] !== "md" ? ` size="${values["size"]}"` : "";
      const text = variant === "text" && values["text"] ? ` text=${JSON.stringify(values["text"])}` : "";
      const progress = variant === "progress-ring" && values["progress"] !== undefined ? ` progress={${values["progress"]}}` : "";

      return `import { Loader } from "${importFrom}";

export default function LoaderDemo() {
  return <Loader variant="${variant}"${size}${text}${progress} />;
}`;
    }

    if (componentName === "Toaster") {
      const position = values["position"] && values["position"] !== "bottom-right" ? `\n        position="${values["position"]}"` : "";
      const variant = values["variant"] && values["variant"] !== "default" ? `\n        variant="${values["variant"]}"` : "";
      const expand = values["expand"] ? "\n        expand" : "";
      const closeButton = values["closeButton"] ? "\n        closeButton" : "";
      const visibleToasts = values["visibleToasts"] !== undefined && values["visibleToasts"] !== 3
        ? `\n        visibleToasts={${values["visibleToasts"]}}`
        : "";
      const duration = values["duration"] !== undefined && values["duration"] !== 4000
        ? `\n        duration={${values["duration"]}}`
        : "";

      return `import { Toaster, toast, Button } from "${importFrom}";

export default function ToasterDemo() {
  return (
    <div>
      <Toaster${position}${variant}${expand}${closeButton}${visibleToasts}${duration}
      />
      <Button
        variant="outline"
        onClick={() =>
          toast("Deployment queued", {
            description: "Building production edge bundle #484.",
          })
        }
      >
        Trigger Toast
      </Button>
    </div>
  );
}`;
    }

    if (componentName === "ChatMessage") {
      const variant = values["variant"] || "received";
      const sender = values["sender"] || "Mina Kato";
      const message = values["message"] || "Schema migration #184 passed CI checks across all 4 clusters.";
      const time = values["time"] || "10:42";
      const status = values["status"] || "read";
      const isOnline = Boolean(values["isOnline"]);

      return `import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBody,
  ChatMessageHeader,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageContent,
  ChatMessageStatus,
} from "${importFrom}";

export default function ChatMessageDemo() {
  return (
    <ChatMessage variant="${variant}">
      <ChatMessageAvatar fallback=${JSON.stringify(sender.charAt(0).toUpperCase() || "M")}${isOnline ? " isOnline" : ""} />
      <ChatMessageBody>
        <ChatMessageHeader>
          <ChatMessageSender>${sender}</ChatMessageSender>
          <ChatMessageTime>${time}</ChatMessageTime>
        </ChatMessageHeader>
        <ChatMessageContent>${message}</ChatMessageContent>${
          variant === "sent" ? `\n        <ChatMessageStatus status="${status}" />` : ""
        }
      </ChatMessageBody>
    </ChatMessage>
  );
}`;
    }

    if (componentName === "DarkModeToggle") {
      const variant = values["variant"] || "dial";
      const theme = values["theme"] || "dark";
      const size = values["size"] && values["size"] !== "md" && (variant === "pill" || variant === "icon")
        ? `\n      size="${values["size"]}"`
        : "";
      const showLabel = values["showLabel"] && (variant === "pill" || variant === "segmented")
        ? "\n      showLabel"
        : "";

      return `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "${importFrom}";

export default function DarkModeToggleDemo() {
  const [theme, setTheme] = useState<ThemeMode>("${theme}");

  return (
    <DarkModeToggle
      variant="${variant}"${size}${showLabel}
      theme={theme}
      onChange={setTheme}
    />
  );
}`;
    }

    const propsList: string[] = [];
    const childrenContent = values.children || "";

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
      return `import { ${componentName} } from "${importFrom}";

export default function ${componentName}Demo() {
  return (
    <${componentName}${propsString}>
      ${childrenContent}
    </${componentName}>
  );
}`;
    }

    return `import { ${componentName} } from "${importFrom}";

export default function ${componentName}Demo() {
  return <${componentName}${propsString} />;
}`;
  }, [componentName, importFrom, controls, values]);

  const handleCopy = async () => {
    await copyToClipboard(generatedCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileName = fileMapping[componentName] || `${componentName.toLowerCase()}.tsx`;
  const gitHubLink = `https://github.com/Al1mov77/NexoreUI/tree/main/packages/ui/src/components/${fileName}`;

  const interactiveHandlers: Record<string, any> = {};

  if ("checked" in values && (componentName === "Checkbox" || componentName === "Switch")) {
    interactiveHandlers.onCheckedChange = (checked: boolean) => {
      handlePropChange("checked", checked);
    };
  }

  if ("isOpen" in values && (componentName === "Modal" || componentName === "Dialog")) {
    interactiveHandlers.onOpenChange = (open: boolean) => {
      handlePropChange("isOpen", open);
    };
  }

  if ("open" in values && componentName === "Drawer") {
    interactiveHandlers.onOpen = () => {
      handlePropChange("open", true);
    };
    interactiveHandlers.onClose = () => {
      handlePropChange("open", false);
    };
  }

  if ("theme" in values && componentName === "DarkModeToggle") {
    interactiveHandlers.onChange = (nextTheme: string) => {
      handlePropChange("theme", nextTheme);
    };
  }

  if ("value" in values) {
    if (["Rating", "Input", "Select", "Slider"].includes(componentName)) {
      interactiveHandlers.onChange = (val: any) => {
        handlePropChange("value", typeof val === "number" ? val : val);
      };
    }
    if (["Slider", "RangeSlider", "Select", "Tabs"].includes(componentName)) {
      interactiveHandlers.onValueChange = (val: any) => {
        handlePropChange("value", Array.isArray(val) ? val[0] : val);
      };
    }
  }

  if ("currentStep" in values && componentName === "Stepper") {
    interactiveHandlers.onStepClick = (step: number) => {
      handlePropChange("currentStep", step);
    };
    interactiveHandlers.onStepChange = (step: number) => {
      handlePropChange("currentStep", step);
    };
  }

  return (
    <div id="playground" className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
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
                type="button"
                onClick={() => setActiveTab(tab.id as "preview" | "controls" | "code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold"
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
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/60 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-border ${
            activeTab === "controls" && "hidden lg:flex"
          } ${activeTab === "code" && "hidden lg:flex"}`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Live Canvas</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                Interactive
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setViewportMode("full")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewportMode === "full"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Desktop: 100% full width"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[11px]">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("tablet")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewportMode === "tablet"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Tablet: 768px frame"
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="text-[11px]">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewportMode === "mobile"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                title="Mobile: 375 × 667 frame"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-[11px]">Mobile</span>
              </button>
            </div>
          </div>

          <div
            data-demo-preview
            className="flex-1 flex items-center justify-center p-4 md:p-6 bg-background relative overflow-x-auto overflow-y-hidden demo-grid-pattern min-h-[360px]"
          >
            {viewportMode === "full" ? (
              <motion.div
                key="full-view"
                initial={prefersReducedMotion ? false : { opacity: 0.85 }}
                animate={{ opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                className="w-full flex items-center justify-center py-6"
              >
                <Component {...values} {...interactiveHandlers} />
              </motion.div>
            ) : viewportMode === "tablet" ? (
              <motion.div
                key="tablet-frame"
                initial={prefersReducedMotion ? false : { scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-[680px] h-[460px] flex flex-col rounded-[28px] border-[4px] border-zinc-800 dark:border-zinc-700 bg-background shadow-md overflow-hidden my-2 shrink-0"
              >
                <div className="h-7 shrink-0 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span>Tablet</span>
                  </div>
                  <span className="font-semibold text-zinc-300">768 × 1024</span>
                  <div className="w-10" />
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 flex flex-col items-center bg-background">
                  <div className="w-full my-auto flex items-center justify-center">
                    <Component {...values} {...interactiveHandlers} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile-frame"
                initial={prefersReducedMotion ? false : { scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                className="w-[320px] sm:w-[375px] h-[580px] sm:h-[640px] max-w-full flex flex-col rounded-[40px] border-[5px] border-zinc-800 dark:border-zinc-700 bg-background shadow-md overflow-hidden my-2 shrink-0"
              >
                <div className="shrink-0 pt-2.5 pb-2 px-5 bg-zinc-950 text-zinc-300 border-b border-zinc-800 flex items-center justify-between text-[10px] font-mono tabular-nums">
                  <span>9:41</span>
                  <div className="w-16 h-3 rounded-full bg-zinc-800 border border-zinc-700/60" />
                  <span className="text-[9px] text-zinc-400">375×667</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 flex flex-col items-center bg-background">
                  <div className="w-full my-auto flex items-center justify-center">
                    <Component {...values} {...interactiveHandlers} />
                  </div>
                </div>
                <div className="shrink-0 h-5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-center">
                  <div className="w-24 h-1 rounded-full bg-zinc-700" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div
          className={`lg:col-span-5 xl:col-span-4 flex flex-col min-w-0 bg-card/40 ${
            activeTab !== "controls" && "hidden lg:flex"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Controls
              </span>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                ({controls.length})
              </span>
            </div>

            {isModified && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-4 space-y-3.5 max-h-[520px] overflow-y-auto">
            {controls.map((ctrl) => {
              const isDifferent = values[ctrl.name] !== ctrl.defaultValue;

              return (
                <div
                  key={ctrl.name}
                  className={`p-3 rounded-xl border transition-colors ${
                    isDifferent
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {ctrl.name}
                      </span>
                      {isDifferent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {ctrl.type}
                    </span>
                  </div>

                  {ctrl.type === "select" && (
                    <select
                      aria-label={ctrl.name}
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
                    >
                      {ctrl.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-background text-foreground">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {ctrl.type === "text" && (
                    <input
                      aria-label={ctrl.name}
                      type="text"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  )}

                  {ctrl.type === "boolean" && (
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] text-muted-foreground">Toggle state:</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values[ctrl.name])}
                        aria-label={ctrl.name}
                        onClick={() => handlePropChange(ctrl.name, !values[ctrl.name])}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border ${
                          values[ctrl.name]
                            ? "bg-foreground border-foreground"
                            : "bg-muted border-border hover:bg-muted/80"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform duration-200 ${
                            values[ctrl.name]
                              ? "translate-x-4 bg-background"
                              : "translate-x-0 bg-foreground/60"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {ctrl.type === "number" && (
                    <input
                      aria-label={ctrl.name}
                      type="number"
                      value={values[ctrl.name]}
                      onChange={(e) => handlePropChange(ctrl.name, Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors tabular-nums"
                    />
                  )}

                  {ctrl.type === "color" && (
                    <div className="flex items-center gap-2">
                      <input
                        aria-label={`${ctrl.name} color picker`}
                        type="color"
                        value={values[ctrl.name]}
                        onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                        className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        aria-label={`${ctrl.name} hex value`}
                        type="text"
                        value={values[ctrl.name]}
                        onChange={(e) => handlePropChange(ctrl.name, e.target.value)}
                        className="flex-1 bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
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

      <div
        className={`border-t border-border bg-muted/20 ${
          activeTab === "preview" && "hidden lg:block"
        } ${activeTab === "controls" && "hidden lg:block"}`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-foreground" />
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider font-mono">
              Generated JSX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background hover:bg-muted text-xs font-medium text-foreground border border-border transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-success" />
                  <span className="text-success font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-muted-foreground" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <a
              href={gitHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Source</span>
            </a>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-60 bg-background/60">
          <pre className="font-mono text-xs text-foreground leading-relaxed select-all">
            {generatedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
