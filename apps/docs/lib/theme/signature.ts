export const SIGNATURE_THEME = {
  color: "slate",
  radius: "0.625",
  font: "geist",
  density: "default",
  animation: "subtle",
  mode: "system",
} as const;

export type SignatureTheme = typeof SIGNATURE_THEME;
