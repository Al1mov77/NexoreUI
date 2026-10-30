# Nexore Pizza — assets

Unzip into `src/assets/` of the React project (folders keep their names).
All PNG-style cut-outs are WebP with transparent background. Brand: Nexore Pizza (AI-generated, Gemini).

| File | What it is | Used for |
|---|---|---|
| scene/counter.jpg | steel counter with flour (1600×1600) | page background, `background-size: cover` |
| scene/box-closed.webp | closed pizza box, top view | the lid; lifts off and flies away, closes again at the end |
| scene/box-base.webp | open box bottom with parchment | sits under the pizza |
| scene/box-ajar.webp | box with lid slightly open | spare (not used in the demo) |
| scene/timer.webp | red kitchen timer | shown while baking |
| pizza/dough.webp | raw dough circle | layer 1 of the pizza |
| pizza/sauce.webp | tomato sauce swirl (same canvas as dough) | layer 2, revealed with a circular clip |
| pizza/crust-baked.webp | charred crust ring (same canvas) | fades in over the dough while baking |
| pizza/pizza-baked-full.webp | whole baked pizza | spare / marketing |
| toppings/mozzarella-1,2.webp | torn mozzarella pieces | scattered on the pizza |
| toppings/pepperoni-1,2.webp | pepperoni slices | scattered |
| toppings/mushroom-1,2.webp | mushroom slices | scattered |
| toppings/basil-1,2,3.webp | basil leaves | scattered |
| toppings/olive-1.webp | olive ring | scattered (cloned, rotated) |
| toppings/onion-1,2.webp | red onion arcs | scattered |
| trays/tray-*.webp | steel trays: mozzarella, pepperoni, mushrooms, basil, olives, onion | ingredient picker (labels are HTML) |
| hands/hand-open.webp | black glove, open hand | idle / release |
| hands/hand-pinch.webp | glove pinching | carrying a topping |
| hands/hand-ok.webp | glove "OK" | shown while baking |
| hands/hand-point.webp | glove pointing | first-time hint |

Hand photos point left; the code rotates them ~24° so fingers aim up-left.
"Hotspot" (fingertip) for each hand is set in `src/data/menu.ts → HAND_HOTSPOT`.
