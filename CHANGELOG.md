# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 🧹 Audit & Cleanups Done
NexoreUI went through a thorough audit to consolidate duplicate files into core atomic variants:
- **Loaders**: Unified Wifi, Hourglass, Battery, Clock, BouncingBalls, and Box loaders into a single `<Loader>` component.
- **Buttons**: Merged special button styles into `<Button>` variants.
- **Cards**: Consolidates Spotlight, Hover, Glass, Glow, and Tilt cards.
- **Inputs**: Unified Floating labels, outline designs, and more into `<Input>` variants.
- **Special Effects**: Merged TypingAnimation into special animations helper.
