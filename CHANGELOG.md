# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0]

### 💥 BREAKING CHANGES

#### Card Component (`card.tsx`)
- **Removed Monolithic Props**: `Card` no longer accepts `title`, `description`, `footer`, or `image` props. It is now a strict compound component container. Use `<CardHeader>`, `<CardTitle>`, `<CardContent>`, and `<CardFooter>` for internal composition.
- **Removed Legacy Cards**: Deleted `ImageCard`, `ProfileCard`, `ProductCard`, `ArticleCard`, `StatCardSimple`, `PricingCardBasic`, `WeatherCard`, `EventCard`, `TestimonialCardBasic`, and `InteractiveCard`. These monolithic wrappers have been entirely removed in favor of explicit compound implementations.

#### `dialog.tsx`
- Removed monolithic components: `Modal`, `BasicModal`, `DangerModal`, `InteractiveGlassModal`, `GlassModal`, `AlertModal`, `SuccessModal`, `CommandPaletteModal`, `BottomSheetSimulated`.
- Enforced strict compound pattern: use `<Dialog>`, `<DialogTrigger>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogDescription>`, `<DialogFooter>`, `<DialogClose>`.
- Preserved style variations via `cva` directly on `<DialogContent>` (`variant`, `size`, `scrollable` props).
- Standardized `DialogContent` exports in line with `@radix-ui/react-dialog`.

#### `accordion.tsx`
- Removed monolithic legacy components: `SimpleAccordion`, `PlusAccordion`, `NeonAccordion`.
- Removed `items` array prop from `<Accordion>`.
- Enforced strict compound pattern: use `<Accordion>`, `<AccordionItem>`, `<AccordionTrigger>`, `<AccordionContent>`.
- Added support for style variants via `cva` (`variant` prop on `<Accordion>`, `iconType` prop on `<AccordionTrigger>`).

#### `tabs.tsx`
- Removed `items` array prop from monolithic `<Tabs>` component.
- Enforced pure compound pattern: use `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`.
- Added strict `cva` variants (`default`, `pill`, `underline`) natively available on `<TabsList>` and `<TabsTrigger>`.

## [Unreleased]

### 🧹 Audit & Cleanups Done
NexoreUI went through a thorough audit to consolidate duplicate files into core atomic variants:
- **Loaders**: Unified Wifi, Hourglass, Battery, Clock, BouncingBalls, and Box loaders into a single `<Loader>` component.
- **Buttons**: Merged special button styles into `<Button>` variants.
- **Cards**: Consolidates Spotlight, Hover, Glass, Glow, and Tilt cards.
- **Inputs**: Unified Floating labels, outline designs, and more into `<Input>` variants.
- **Special Effects**: Merged TypingAnimation into special animations helper.
