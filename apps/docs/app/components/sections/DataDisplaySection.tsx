"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { StatCard, DataTablePro, InvoiceTable, UserDirectoryTable, TransactionHistory, FileExplorerTable, LeaderboardTable, ProductInventoryTable, ScheduleTable, PricingComparisonTable, CompactDataList, Button } from "nexoreui";

const variants = [
  {
    name: "Data Table Pro",
    component: <div className="w-full max-w-2xl"><DataTablePro /></div>,
    code: `import { DataTablePro } from "nexoreui"\n\n<DataTablePro />`
  },
  {
    name: "Invoice Table",
    component: <div className="w-full max-w-2xl"><InvoiceTable /></div>,
    code: `import { InvoiceTable } from "nexoreui"\n\n<InvoiceTable />`
  },
  {
    name: "User Directory Table",
    component: <div className="w-full max-w-2xl"><UserDirectoryTable /></div>,
    code: `import { UserDirectoryTable } from "nexoreui"\n\n<UserDirectoryTable />`
  },
  {
    name: "Transaction History",
    component: <div className="w-full max-w-2xl"><TransactionHistory /></div>,
    code: `import { TransactionHistory } from "nexoreui"\n\n<TransactionHistory />`
  },
  {
    name: "File Explorer Table",
    component: <div className="w-full max-w-2xl"><FileExplorerTable /></div>,
    code: `import { FileExplorerTable } from "nexoreui"\n\n<FileExplorerTable />`
  },
  {
    name: "Leaderboard Table",
    component: <div className="w-full max-w-sm"><LeaderboardTable /></div>,
    code: `import { LeaderboardTable } from "nexoreui"\n\n<LeaderboardTable />`
  },
  {
    name: "Product Inventory Table",
    component: <div className="w-full max-w-2xl"><ProductInventoryTable /></div>,
    code: `import { ProductInventoryTable } from "nexoreui"\n\n<ProductInventoryTable />`
  },
  {
    name: "Schedule Table",
    component: <div className="w-full max-w-2xl"><ScheduleTable /></div>,
    code: `import { ScheduleTable } from "nexoreui"\n\n<ScheduleTable />`
  },
  {
    name: "Pricing Comparison Table",
    component: <div className="w-full max-w-2xl"><PricingComparisonTable /></div>,
    code: `import { PricingComparisonTable } from "nexoreui"\n\n<PricingComparisonTable />`
  },
  {
    name: "Compact Data List",
    component: <div className="w-full max-w-md"><CompactDataList /></div>,
    code: `import { CompactDataList } from "nexoreui"\n\n<CompactDataList />`
  }
];

export function DataDisplaySection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="data-display" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Display</h2>
          <p className="text-muted-foreground">Tables, lists, and complex data representations.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={StatCard}
          componentName="StatCard"
          importFrom="nexoreui"
          controls={[
            {
              name: "title",
              type: "text",
              defaultValue: "Active Users",
              description: "The header title of the stat card"
            },
            {
              name: "value",
              type: "text",
              defaultValue: "+12,450",
              description: "The main numeric/text value of the metric"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "from last month",
              description: "Subtext descriptive label for contextualizing the value"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-border bg-background/50 p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}
    </section>
  );
}
