"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  FilterBar,
  LanguageSelector,
  UserMenuDropdown,
  TreeNavigation,
  ContextActionBar,
  PaginationPro,
} from "nexoreui";

export function ProNavigationSection() {
  return (
    <SuiteSectionLayout
      id="pro-navigation"
      title="Pro Navigation"
      badge="Wayfinding Primitives"
      description="Advanced navigation and filtering controls: segmented filter bars, locale pickers, user menus, hierarchical file trees, and floating context action bars."
      cliCommand="npx nexoreui add pro-navigation"
      items={[
        {
          name: "Segmented Filter Bar",
          description: "Horizontal filter pills with search input and sorting trigger.",
          component: (
            <div className="w-full max-w-lg p-2">
              <FilterBar />
            </div>
          ),
          code: `import { FilterBar } from "nexoreui"

<FilterBar />`
        },
        {
          name: "Context Action Bar",
          description: "Floating action toolbar appearing when rows or assets are selected.",
          component: (
            <div className="w-full max-w-md p-4">
              <ContextActionBar />
            </div>
          ),
          code: `import { ContextActionBar } from "nexoreui"

<ContextActionBar />`
        },
        {
          name: "Hierarchical File Tree Navigation",
          description: "Collapsible tree view for folder directories, document hierarchies, and code repositories.",
          component: (
            <div className="w-full max-w-xs">
              <TreeNavigation />
            </div>
          ),
          code: `import { TreeNavigation } from "nexoreui"

<TreeNavigation />`
        },
        {
          name: "User Profile & Settings Menu",
          description: "Header avatar dropdown menu with quick account navigation links.",
          component: (
            <div className="p-4 flex justify-center">
              <UserMenuDropdown />
            </div>
          ),
          code: `import { UserMenuDropdown } from "nexoreui"

<UserMenuDropdown />`
        },
        {
          name: "Pagination Bar Pro",
          description: "Numbered page selector with previous/next triggers and per-page limits.",
          component: (
            <div className="p-4">
              <PaginationPro />
            </div>
          ),
          code: `import { PaginationPro } from "nexoreui"

<PaginationPro />`
        }
      ]}
      a11yNotes={[
        "Keyboard Traversal: Tree items support Arrow Up/Down and Arrow Right/Left for expand/collapse actions.",
        "ARIA Roles: Filter bar uses role='toolbar' and aria-orientation='horizontal'."
      ]}
    />
  );
}
