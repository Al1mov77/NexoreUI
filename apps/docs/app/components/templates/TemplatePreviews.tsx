"use client";

import React from "react";
import { AuraSoundProPreview } from "./previews/AuraSoundProPreview";
import { ChronoXTitaniumPreview } from "./previews/ChronoXTitaniumPreview";
import { LamborghiniRevueltoPreview } from "./previews/LamborghiniRevueltoPreview";
import { ZenithElixirPreview } from "./previews/ZenithElixirPreview";
import { VelvetGelatoPreview } from "./previews/VelvetGelatoPreview";
import { AuraNocturnePreview } from "./previews/AuraNocturnePreview";
import { AuraObsidianPreview } from "./previews/AuraObsidianPreview";
import { LevitasCryoPreview } from "./previews/LevitasCryoPreview";
import { MonolithCacaoPreview } from "./previews/MonolithCacaoPreview";
import { AmarenaRoyalePreview } from "./previews/AmarenaRoyalePreview";
import { AerovoidObsidianPreview } from "./previews/AerovoidObsidianPreview";
import { VortexApexPreview } from "./previews/VortexApexPreview";
import { FerrariNocturnePreview } from "./previews/FerrariNocturnePreview";
import { RoseNocturnePreview } from "./previews/RoseNocturnePreview";
import { PsycheObsidianPreview } from "./previews/PsycheObsidianPreview";
import { VaporObsidianPreview } from "./previews/VaporObsidianPreview";
import { VantrParticlePreview } from "./previews/VantrParticlePreview";
import { NexCoreAdminPreview } from "./previews/NexCoreAdminPreview";
import { NexAuthPreview } from "./previews/NexAuthPreview";
import { NexStorePreview } from "./previews/NexStorePreview";
import { NexUsersTablePreview } from "./previews/NexUsersTablePreview";
import { NexPortfolioPreview } from "./previews/NexPortfolioPreview";
import { SwaggerFormBuilderPreview } from "./previews/SwaggerFormBuilderPreview";
import { AiChatInterfacePreview } from "./previews/AiChatInterfacePreview";
import { StaylinePreview } from "./previews/StaylinePreview";
import { IronpawToolsPreview } from "./previews/IronpawToolsPreview";
import { BurlitCoffeePreview } from "./previews/BurlitCoffeePreview";
import { BearLiftPreview } from "./previews/BearLiftPreview";
import { CapySpaPreview } from "./previews/CapySpaPreview";
import { PandaBakeryPreview } from "./previews/PandaBakeryPreview";
import { FlipSkatePreview } from "./previews/FlipSkatePreview";
import { PullNoodlePreview } from "./previews/PullNoodlePreview";
import { VesuvioPizzaPreview } from "./previews/VesuvioPizzaPreview";
import { NexoreCasePreview } from "./previews/NexoreCasePreview";

export function RenderTemplatePreview({ templateId }: { templateId: string }) {
  switch (templateId) {
    case "template-nexore-case-pro":
    case "template-nexore-case":
    case "nexore-case":
      return <NexoreCasePreview />;
    case "template-vesuvio-pizza-pro":
    case "template-vesuvio-pizza":
    case "vesuvio-pizza":
    case "pizza":
      return <VesuvioPizzaPreview />;
    case "template-pull-noodle-pro":
    case "template-pull-noodle":
    case "pull-noodle":
      return <PullNoodlePreview />;
    case "template-flip-skate-pro":
    case "template-flip-skate":
    case "flip-skate":
      return <FlipSkatePreview />;
    case "template-panda-bakery-pro":
    case "template-panda-bakery":
    case "panda-bakery":
      return <PandaBakeryPreview />;
    case "template-capy-spa-pro":
    case "template-capy-spa":
    case "capy-spa":
      return <CapySpaPreview />;
    case "template-bear-lift-pro":
    case "template-bear-lift":
    case "bear-lift":
      return <BearLiftPreview />;
    case "template-burlit-coffee-pro":
    case "template-burlit-coffee":
    case "burlit-coffee":
      return <BurlitCoffeePreview />;
    case "template-ironpaw-tools-pro":
    case "template-ironpaw-tools":
    case "ironpaw-tools":
      return <IronpawToolsPreview />;
    case "template-stayline-pro":
    case "stayline":
      return <StaylinePreview />;
    case "template-aura-sound-pro":
    case "aura-sound-pro":
      return <AuraSoundProPreview />;
    case "template-chrono-x-pro":
    case "chrono-x-titanium":
    case "chrono-x-pro":
      return <ChronoXTitaniumPreview />;
    case "template-lamborghini-revuelto":
    case "lamborghini-revuelto":
      return <LamborghiniRevueltoPreview />;
    case "template-zenith-elixir-pro":
    case "zenith-botanical-elixir":
    case "zenith-elixir-pro":
      return <ZenithElixirPreview />;
    case "template-velvet-gelato-pro":
    case "velvet-cryo-gelato":
    case "velvet-gelato-pro":
      return <VelvetGelatoPreview />;
    case "template-aura-nocturne-pro":
    case "aura-nocturne-parfum":
    case "aura-nocturne-pro":
      return <AuraNocturnePreview />;
    case "template-aura-obsidian-pro":
    case "aura-obsidian-botanica":
    case "aura-obsidian-pro":
      return <AuraObsidianPreview />;
    case "template-levitas-cryo-pro":
    case "levitas-cryo-atelier":
    case "levitas-cryo-pro":
      return <LevitasCryoPreview />;
    case "template-monolith-cacao-pro":
    case "monolith-obsidian-cacao":
    case "monolith-cacao-pro":
      return <MonolithCacaoPreview />;
    case "template-amarena-royale-pro":
    case "amarena-royale-patisserie":
    case "amarena-royale-pro":
      return <AmarenaRoyalePreview />;
    case "template-aerovoid-obsidian-pro":
    case "aerovoid-obsidian-parka":
    case "aerovoid-obsidian-pro":
      return <AerovoidObsidianPreview />;
    case "template-vortex-apex-pro":
    case "vortex-apex-corse":
    case "vortex-apex-pro":
      return <VortexApexPreview />;
    case "template-ferrari-nocturne":
    case "ferrari-nocturne-atelier":
    case "ferrari-nocturne":
      return <FerrariNocturnePreview />;
    case "template-rose-nocturne":
    case "rose-nocturne-atelier":
    case "rose-nocturne":
      return <RoseNocturnePreview />;
    case "template-psyche-obsidian":
    case "psyche-obsidian-atelier":
    case "psyche-obsidian":
      return <PsycheObsidianPreview />;
    case "template-vapor-obsidian":
    case "vapor-obsidian-atelier":
    case "vapor-obsidian":
      return <VaporObsidianPreview />;
    case "template-vantr-particle":
    case "template-vantr-particle-pro":
    case "vantr-particle-reveal":
    case "vantr-particle":
      return <VantrParticlePreview />;
    case "template-nexcore-admin-pro":
    case "template-nexcore-admin":
    case "template-nexcore-pro":
    case "template-nexcore":
      return <NexCoreAdminPreview />;
    case "template-auth-pro":
    case "template-nexauth-pro":
      return <NexAuthPreview />;
    case "template-ecommerce-pro":
    case "template-nexstore-pro":
      return <NexStorePreview />;
    case "template-users-table-pro":
    case "template-table-users-pro":
    case "template-nexusers-table-pro":
    case "template-nexusers-pro":
      return <NexUsersTablePreview />;
    case "template-portfolio-pro":
    case "template-portfolio":
    case "template-nexportfolio-pro":
    case "template-nexportfolio":
      return <NexPortfolioPreview />;
    case "template-swagger-form-builder":
    case "template-form-builder":
    case "swagger-form-builder":
      return <SwaggerFormBuilderPreview />;
    case "template-ai-chat-interface":
    case "ai-chat-interface":
    case "template-ai-chat":
      return <AiChatInterfacePreview />;
    default:
      return <NexStorePreview />;
  }
}
