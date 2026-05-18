"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { DataTablePro, InvoiceTable, UserDirectoryTable, TransactionHistory, FileExplorerTable, LeaderboardTable, ProductInventoryTable, ScheduleTable, PricingComparisonTable, CompactDataList, Button } from "nexoreui";

const variants = [
  {
    name: "Data Table Pro",
    component: <div className="w-full max-w-2xl"><DataTablePro columns={[{header: "Name", accessorKey: "name"}, {header: "Role", accessorKey: "role"}]} data={[{id: 1, name: "Alice", role: "Admin"}, {id: 2, name: "Bob", role: "User"}]} /></div>,
    code: `import { DataTablePro } from "nexoreui"\n\n<DataTablePro \n  columns={[{header: "Name", accessorKey: "name"}, ...]} \n  data={[{name: "Alice", role: "Admin"}, ...]} \n/>`
  },
  {
    name: "Invoice Table",
    component: <div className="w-full max-w-2xl"><InvoiceTable invoices={[{id: "INV001", status: "Paid", amount: "$250.00"}, {id: "INV002", status: "Pending", amount: "$150.00"}]} /></div>,
    code: `import { InvoiceTable } from "nexoreui"\n\n<InvoiceTable \n  invoices={[{id: "INV001", status: "Paid", amount: "$250.00"}]} \n/>`
  },
  {
    name: "User Directory Table",
    component: <div className="w-full max-w-2xl"><UserDirectoryTable users={[{name: "John Doe", department: "Engineering", status: "Active"}]} /></div>,
    code: `import { UserDirectoryTable } from "nexoreui"\n\n<UserDirectoryTable \n  users={[{name: "John Doe", department: "Engineering", status: "Active"}]} \n/>`
  },
  {
    name: "Transaction History",
    component: <div className="w-full max-w-2xl"><TransactionHistory transactions={[{date: "2026-10-12", description: "AWS Hosting", amount: "-$124.50"}]} /></div>,
    code: `import { TransactionHistory } from "nexoreui"\n\n<TransactionHistory transactions={[...]} />`
  },
  {
    name: "File Explorer Table",
    component: <div className="w-full max-w-2xl"><FileExplorerTable files={[{name: "project.zip", size: "12 MB", type: "archive"}]} /></div>,
    code: `import { FileExplorerTable } from "nexoreui"\n\n<FileExplorerTable files={[...]} />`
  },
  {
    name: "Leaderboard Table",
    component: <div className="w-full max-w-sm"><LeaderboardTable players={[{rank: 1, name: "Player1", score: 9500}, {rank: 2, name: "Player2", score: 8400}]} /></div>,
    code: `import { LeaderboardTable } from "nexoreui"\n\n<LeaderboardTable players={[...]} />`
  },
  {
    name: "Product Inventory Table",
    component: <div className="w-full max-w-2xl"><ProductInventoryTable products={[{sku: "PROD-1", stock: 45, price: "$29.99"}]} /></div>,
    code: `import { ProductInventoryTable } from "nexoreui"\n\n<ProductInventoryTable products={[...]} />`
  },
  {
    name: "Schedule Table",
    component: <div className="w-full max-w-2xl"><ScheduleTable events={[{time: "10:00 AM", title: "Team Sync", duration: "1h"}]} /></div>,
    code: `import { ScheduleTable } from "nexoreui"\n\n<ScheduleTable events={[...]} />`
  },
  {
    name: "Pricing Comparison Table",
    component: <div className="w-full max-w-2xl"><PricingComparisonTable features={[{name: "API Access", free: false, pro: true}]} /></div>,
    code: `import { PricingComparisonTable } from "nexoreui"\n\n<PricingComparisonTable features={[...]} />`
  },
  {
    name: "Compact Data List",
    component: <div className="w-full max-w-md"><CompactDataList items={[{label: "Uptime", value: "99.9%"}, {label: "Latency", value: "45ms"}]} /></div>,
    code: `import { CompactDataList } from "nexoreui"\n\n<CompactDataList items={[...]} />`
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
