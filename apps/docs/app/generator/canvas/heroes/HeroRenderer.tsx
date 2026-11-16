"use client";

import React from "react";
import { HeroEditorial } from "./HeroEditorial";
import { HeroMonolith } from "./HeroMonolith";
import { HeroRenderProps } from "./HeroShared";
import { HeroShowroom } from "./HeroShowroom";
import { HeroTrack } from "./HeroTrack";

export function HeroRenderer(props: HeroRenderProps) {
  switch (props.payload.tokens.archetype) {
    case "monolith":
      return <HeroMonolith {...props} />;
    case "track":
      return <HeroTrack {...props} />;
    case "editorial":
      return <HeroEditorial {...props} />;
    case "showroom":
      return <HeroShowroom {...props} />;
  }
}
