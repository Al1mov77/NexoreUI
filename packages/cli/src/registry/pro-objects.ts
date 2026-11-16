export const proObjects = {
  name: "pro-objects",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  componentsDependencies: [
  "live-object",
  "sound-pulse",
  "silk-unveil"
],
  fileName: "pro-objects.tsx",
  content: `"use client";

export * from "./live-object";
export * from "./sound-pulse";
export * from "./silk-unveil";
`
};
