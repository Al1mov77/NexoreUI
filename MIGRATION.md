# NexoreUI Migration Guide

## 0.3.0 Migration (Badge Consolidation)

In `0.3.0`, 20 redundant wrapper exports were removed from `badge.tsx`. All badge styles are now provided via the unified `<Badge>` component using `cva` variants (`variant`, `size`) and boolean flags (`dot`, `pulse`).

### Badge Migration Table (Old Component → New Usage)

| Old Component Name | New Equivalent Usage |
| :--- | :--- |
| `<GlowBadge>` | `<Badge variant="neon">` |
| `<GlassBadge>` | `<Badge variant="outline">` |
| `<DotBadge>` | `<Badge dot>` |
| `<GradientBadge>` | `<Badge variant="gradient">` |
| `<OutlineGlowBadge>` | `<Badge variant="neon">` |
| `<PulseBadge>` | `<Badge pulse>` |
| `<SoftBadge>` | `<Badge variant="secondary">` |
| `<TagBadge>` | `<Badge className="rounded-md">` |
| `<PremiumBadge>` | `<Badge variant="gradient">` |
| `<MinimalBadge>` | `<Badge size="sm" variant="outline">` |
| `<NotificationBadge count={5}>` | `<Badge variant="destructive" size="sm">5</Badge>` |
| `<RibbonBadge text="SALE">` | `<Badge variant="default" className="absolute top-0 right-0 rounded-bl-xl rounded-none">SALE</Badge>` |
| `<OutlineDotBadge status="online">` | `<Badge variant="outline" dot pulse>Online</Badge>` |
| `<GradientOutlineBadge>` | `<Badge variant="gradient">` |
| `<IconBadge icon="star">` | `<Badge variant="outline">★ Featured</Badge>` |
| `<FloatingBadge>` | `<Badge className="absolute -top-2 -right-2">` |
| `<ProgressBadge progress={75}>` | `<Badge variant="secondary" pulse>Uploading 75%</Badge>` |
| `<StatusRingBadge status="success">` | `<Badge variant="success" dot>` |
| `<NeonOutlineBadge>` | `<Badge variant="outline">` |
| `<TagLabel>` | `<Badge variant="secondary">` |

---

# NexoreUI Migration Guide (0.1.x → 0.2.0)


Version `0.2.0` introduces a major architectural shift for four core components: **Card, Dialog, Accordion, and Tabs**. 

We have completely removed the monolithic legacy APIs (which relied heavily on large prop objects or arrays like `items={...}`) in favor of a strict, highly composable **Compound Component Pattern**.

If you are upgrading from `0.1.x`, you will need to update the usage of these components in your application. This guide provides before/after examples for each component to help you migrate quickly.

---

## 1. Card

### What Changed
- Monolithic components such as `ProfileCard`, `PricingCardBasic`, `StatCard`, etc., were removed.
- The base `<Card>` no longer accepts props like `title`, `description`, `image`, or `footer`.
- **New API:** Compose your card using `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, and `<CardFooter>`.
- Style variants (`variant`, `hover`, `animate`) are preserved on the root `<Card>` component.

### Migration Example

**Before (0.1.x - Monolithic)**
```tsx
import { Card } from "nexoreui"

<Card 
  title="Project Alpha"
  description="Main workspace dashboard."
  image="/assets/cover.png"
  variant="glass"
  hover="lift"
>
  <p>Main content inside the card.</p>
</Card>
```

**After (0.2.0 - Compound)**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "nexoreui"

<Card variant="glass" hover="lift">
  <img src="/assets/cover.png" alt="Cover" className="w-full h-48 object-cover rounded-t-2xl" />
  <CardHeader>
    <CardTitle>Project Alpha</CardTitle>
    <CardDescription>Main workspace dashboard.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content inside the card.</p>
  </CardContent>
</Card>
```

---

## 2. Dialog

### What Changed
- Monolithic variants like `Modal`, `BasicModal`, `DangerModal`, `GlassModal` have been removed.
- The generic `<Modal>` export was completely removed. Use `<Dialog>` instead.
- **New API:** Compose your modal using `<Dialog>`, `<DialogTrigger>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogDescription>`, `<DialogFooter>`, and `<DialogClose>`.
- Style variations are now applied via `cva` directly on `<DialogContent>` using the `variant` prop (`default`, `glass`, `destructive`, etc.).

### Migration Example

**Before (0.1.x - Monolithic)**
```tsx
import { GlassModal } from "nexoreui"

<GlassModal 
  title="Delete Project?" 
  description="This action cannot be undone."
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleDelete}
/>
```

**After (0.2.0 - Compound)**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button } from "nexoreui"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent variant="glass">
    <DialogHeader>
      <DialogTitle>Delete Project?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. Accordion

### What Changed
- Legacy components (`SimpleAccordion`, `PlusAccordion`, `NeonAccordion`) were removed.
- The `<Accordion>` component no longer accepts an `items` array.
- **New API:** Compose using `<Accordion>`, `<AccordionItem>`, `<AccordionTrigger>`, and `<AccordionContent>`.
- Visual variants (`default`, `glass`, `outline`, `neon`) are supported via `cva` directly on the `<Accordion>` (for structural changes) and `<AccordionItem>`/`<AccordionTrigger>` (for inner changes like `variant="neon"`).

### Migration Example

**Before (0.1.x - Monolithic)**
```tsx
import { Accordion } from "nexoreui"

const myItems = [
  { title: "Item 1", content: "Content 1" },
  { title: "Item 2", content: "Content 2" }
];

<Accordion items={myItems} type="single" variant="glass" />
```

**After (0.2.0 - Compound)**
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "nexoreui"

<Accordion type="single" collapsible variant="glass">
  <AccordionItem value="item-1">
    <AccordionTrigger>Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Item 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 4. Tabs

### What Changed
- The monolithic `<Tabs>` component no longer accepts an `items` array.
- **New API:** Pure compound implementation using `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, and `<TabsContent>`.
- Added strict `cva` variants (`default`, `pill`, `underline`) natively available on `<TabsList>` and `<TabsTrigger>`.

### Migration Example

**Before (0.1.x - Monolithic)**
```tsx
import { Tabs } from "nexoreui"

const myTabs = [
  { label: "Account", value: "account", content: "Account Settings" },
  { label: "Password", value: "password", content: "Password Settings" }
];

<Tabs items={myTabs} defaultValue="account" />
```

**After (0.2.0 - Compound)**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui"

<Tabs defaultValue="account">
  {/* Add variant="pill" or "underline" if desired */}
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account Settings</TabsContent>
  <TabsContent value="password">Password Settings</TabsContent>
</Tabs>
```
