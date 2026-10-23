"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  DataTablePro,
  InvoiceTable,
  TransactionHistory,
  UserDirectoryTable,
} from "nexoreui";

export function ProTablesSection() {
  return (
    <SuiteSectionLayout
      id="pro-tables"
      title="Pro Tables"
      badge="Data Grids"
      description="Feature-complete administrative data tables: multi-column sorting, row selection checkboxes, invoice status badges, and transaction histories."
      cliCommand="npx nexoreui add pro-tables"
      items={[
        {
          name: "Interactive Data Table Pro",
          description: "Full-featured data grid with search filter, pagination controls, and row action triggers.",
          component: (
            <div className="w-full">
              <DataTablePro />
            </div>
          ),
          code: `import { DataTablePro } from "nexoreui"

<DataTablePro />`
        },
        {
          name: "Invoice & Billing Table",
          description: "Financial billing table displaying invoice identifiers, due dates, currency totals, and payment status badges.",
          component: (
            <div className="w-full">
              <InvoiceTable />
            </div>
          ),
          code: `import { InvoiceTable } from "nexoreui"

<InvoiceTable />`
        },
        {
          name: "Transaction History Table",
          description: "Ledger view displaying debit/credit entries, execution dates, and categorical tags.",
          component: (
            <div className="w-full">
              <TransactionHistory />
            </div>
          ),
          code: `import { TransactionHistory } from "nexoreui"

<TransactionHistory />`
        },
        {
          name: "User Management Directory",
          description: "Administrative team table with user avatars, permission roles, and active status indicators.",
          component: (
            <div className="w-full">
              <UserDirectoryTable />
            </div>
          ),
          code: `import { UserDirectoryTable } from "nexoreui"

<UserDirectoryTable />`
        }
      ]}
      a11yNotes={[
        "Table Accessibility: Uses semantic <table>, <thead>, <tbody>, <th> with scope='col' attributes.",
        "Keyboard Selection: Row selection checkboxes can be toggled using Space and navigated with Tab."
      ]}
    />
  );
}
