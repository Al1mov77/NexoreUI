import React from "react";
import { Metadata } from "next";
import { TOOL_THEME_STYLE_CSS } from "../../lib/generator/design-tokens";
import GeneratorClient from "./GeneratorClient";

export const metadata: Metadata = {
  title: "Nexore Landing Generator · Procedural Industry Website Engine",
  description:
    "Describe your business and watch the engine assemble a clean automotive landing page from real photography and validated specifications.",
  alternates: {
    canonical: "/generator",
  },
};

const PRE_PAINT_THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("nexore-generator-theme")||localStorage.getItem("theme");var m=(s==="dark"||s==="light")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");localStorage.setItem("nexore-generator-theme",m);localStorage.setItem("theme",m);var d=document.documentElement;d.classList.toggle("dark",m==="dark");d.classList.toggle("light",m==="light");d.setAttribute("data-tool-theme",m);d.style.colorScheme=m;}catch(e){}})();`;

export default function GeneratorPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_THEME_SCRIPT }} />
      <style dangerouslySetInnerHTML={{ __html: TOOL_THEME_STYLE_CSS }} />
      <GeneratorClient />
    </>
  );
}
