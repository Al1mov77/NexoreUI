"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  CustomizableTable,
  DataTable,
  Avatar,
  AvatarFallback,
  Badge,
  Progress,
  Button,
} from "nexoreui";
import { Download } from "lucide-react";

const PlaygroundTableWrapper: React.FC<any> = ({
  headers = "User, Role, Status, Uptime",
  row1 = "Mina Kato, Systems Engineer, Active, 99.98%",
  row2 = "Tomas Lind, Operations Lead, Offline, 94.12%",
  row3 = "Nadia Okafor, Frontend Lead, Active, 100.00%",
  row4,
  ...props
}) => {
  const parsedHeaders =
    typeof headers === "string"
      ? headers
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : Array.isArray(headers)
      ? headers
      : [];

  const rawRows = [row1, row2, row3, row4].filter(Boolean);
  const parsedRows = rawRows.map((r, rowIdx) => {
    const rawCells =
      typeof r === "string"
        ? r.split(",").map((s: string) => s.trim())
        : Array.isArray(r)
        ? r
        : [r];
    const targetLength = Math.max(parsedHeaders.length, rawCells.length);
    const cells = Array.from({ length: targetLength }, (_, i) => {
      const val = rawCells[i];
      return val !== undefined && val !== "" ? val : "-";
    });
    return cells.map((cell: string, cellIdx: number) => {
      if (cellIdx === 0) {
        const initials =
          cell
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";
        return (
          <div key={`cell-${rowIdx}-${cellIdx}`} className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground whitespace-nowrap">{cell}</span>
          </div>
        );
      }
      const lower = cell.toLowerCase();
      if (lower === "active" || lower === "online" || lower === "success" || lower === "paid") {
        return (
          <Badge key={`cell-${rowIdx}-${cellIdx}`} variant="success">
            {cell}
          </Badge>
        );
      }
      if (lower === "offline" || lower === "inactive" || lower === "failed") {
        return (
          <Badge key={`cell-${rowIdx}-${cellIdx}`} variant="secondary">
            {cell}
          </Badge>
        );
      }
      if (lower === "pending" || lower === "warning") {
        return (
          <Badge key={`cell-${rowIdx}-${cellIdx}`} variant="warning">
            {cell}
          </Badge>
        );
      }
      if (cell.includes("%") || cell.startsWith("$") || !isNaN(Number(cell))) {
        return (
          <span
            key={`cell-${rowIdx}-${cellIdx}`}
            className="font-mono text-xs text-muted-foreground tabular-nums"
          >
            {cell}
          </span>
        );
      }
      return (
        <span key={`cell-${rowIdx}-${cellIdx}`} className="text-muted-foreground">
          {cell}
        </span>
      );
    });
  });

  return (
    <div className="w-full max-w-2xl overflow-x-auto">
      <CustomizableTable headers={parsedHeaders} rows={parsedRows} {...props} />
    </div>
  );
};

interface DeploymentRow extends Record<string, unknown> {
  service: string;
  region: string;
  commit: string;
  duration: string;
  status: "Healthy" | "Degraded" | "Deploying";
}

const deploymentData: DeploymentRow[] = [
  { service: "billing-api", region: "us-east-1", commit: "a4f92c1", duration: "38s", status: "Healthy" },
  { service: "auth-gateway", region: "eu-central-1", commit: "8d11e04", duration: "24s", status: "Healthy" },
  { service: "webhook-worker", region: "ap-northeast-1", commit: "c20b71a", duration: "51s", status: "Deploying" },
  { service: "search-indexer", region: "us-west-2", commit: "7f4919e", duration: "44s", status: "Healthy" },
  { service: "edge-proxy", region: "eu-west-1", commit: "9b83d12", duration: "19s", status: "Degraded" },
  { service: "cron-scheduler", region: "us-east-1", commit: "3e6120b", duration: "29s", status: "Healthy" },
];

const tablePropsData = [
  { name: "headers", type: "React.ReactNode[] | string[]", defaultValue: "-", description: "Array of header cell elements or strings (CustomizableTable).", required: true },
  { name: "rows", type: "React.ReactNode[][]", defaultValue: "-", description: "Two-dimensional array representing rows and cell content (CustomizableTable).", required: true },
  { name: "variant", type: '"default" | "glass" | "minimal" | "gradient"', defaultValue: '"default"', description: "Visual surface configuration of the table container.", required: false },
  { name: "density", type: '"compact" | "normal" | "spacious"', defaultValue: '"normal"', description: "Vertical and horizontal cell padding scale.", required: false },
  { name: "hoverable", type: "boolean", defaultValue: "true", description: "Enables subtle row background highlight on hover.", required: false },
  { name: "striped", type: "boolean", defaultValue: "false", description: "Applies alternating row tinting.", required: false },
  { name: "bordered", type: "boolean", defaultValue: "false", description: "Adds vertical borders between columns.", required: false },
  { name: "animateRows", type: "boolean", defaultValue: "false", description: "Triggers entrance fade for table rows respecting reduced motion.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
];

export function TableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showcaseVariants = [
    {
      name: "Team Directory",
      description: "Compound table combining user initials, project assignments, progress bars, and status badges.",
      component: (
        <Table variant="default" hoverable density="normal">
          <TableCaption>Active engineering roster · 3 members</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">Mina Kato</div>
                    <div className="text-[11px] font-mono text-muted-foreground">mina@nexore.dev</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Schema Migration</TableCell>
              <TableCell className="min-w-[120px]">
                <Progress value={85} size="sm" variant="default" />
              </TableCell>
              <TableCell>
                <Badge variant="success">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>TL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">Tomas Lind</div>
                    <div className="text-[11px] font-mono text-muted-foreground">tomas@nexore.dev</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Edge Routing</TableCell>
              <TableCell className="min-w-[120px]">
                <Progress value={100} size="sm" variant="success" />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Complete</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>NO</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">Nadia Okafor</div>
                    <div className="text-[11px] font-mono text-muted-foreground">nadia@nexore.dev</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Billing Audit</TableCell>
              <TableCell className="min-w-[120px]">
                <Progress value={40} size="sm" variant="warning" />
              </TableCell>
              <TableCell>
                <Badge variant="warning">In Review</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Avatar,
  AvatarFallback,
  Badge,
  Progress,
} from "nexoreui";

export default function TeamDirectoryTable() {
  return (
    <Table variant="default" hoverable density="normal">
      <TableCaption>Active engineering roster · 3 members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Mina Kato</div>
                <div className="text-[11px] font-mono text-muted-foreground">mina@nexore.dev</div>
              </div>
            </div>
          </TableCell>
          <TableCell>Schema Migration</TableCell>
          <TableCell className="min-w-[120px]">
            <Progress value={85} size="sm" />
          </TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
    },
    {
      name: "Searchable & Paginated DataTable",
      description: "Client-side filtering and pagination built directly into DataTable.",
      component: (
        <DataTable<DeploymentRow>
          data={deploymentData}
          searchable
          searchPlaceholder="Filter services or regions..."
          pagination
          pageSize={3}
          columns={[
            {
              header: "Service",
              cell: (item) => <span className="font-medium text-foreground">{item.service}</span>,
            },
            {
              header: "Region",
              cell: (item) => (
                <span className="font-mono text-xs text-muted-foreground">{item.region}</span>
              ),
            },
            {
              header: "Commit",
              cell: (item) => (
                <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted border border-border">
                  {item.commit}
                </code>
              ),
            },
            {
              header: "Status",
              cell: (item) => (
                <Badge
                  variant={
                    item.status === "Healthy"
                      ? "success"
                      : item.status === "Deploying"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {item.status}
                </Badge>
              ),
            },
          ]}
        />
      ),
      code: `import { DataTable, Badge } from "nexoreui";

interface Deployment {
  service: string;
  region: string;
  commit: string;
  status: "Healthy" | "Degraded" | "Deploying";
}

const deployments: Deployment[] = [
  { service: "billing-api", region: "us-east-1", commit: "a4f92c1", status: "Healthy" },
  { service: "auth-gateway", region: "eu-central-1", commit: "8d11e04", status: "Healthy" },
  { service: "webhook-worker", region: "ap-northeast-1", commit: "c20b71a", status: "Deploying" },
  { service: "edge-proxy", region: "eu-west-1", commit: "9b83d12", status: "Degraded" },
];

export default function DeploymentsDataTable() {
  return (
    <DataTable<Deployment>
      data={deployments}
      searchable
      searchPlaceholder="Filter services or regions..."
      pagination
      pageSize={3}
      columns={[
        { header: "Service", accessorKey: "service" },
        { header: "Region", accessorKey: "region" },
        { header: "Commit", accessorKey: "commit" },
        {
          header: "Status",
          cell: (item) => (
            <Badge variant={item.status === "Healthy" ? "success" : "warning"}>
              {item.status}
            </Badge>
          ),
        },
      ]}
    />
  );
}`,
    },
    {
      name: "Invoices & Summary Footer",
      description: "Minimal table layout with right-aligned currency columns and a summary footer.",
      component: (
        <Table variant="minimal" hoverable density="normal">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium">INV-2026-041</TableCell>
              <TableCell className="text-xs text-muted-foreground">Oct 01, 2026</TableCell>
              <TableCell>Northstar Logistics</TableCell>
              <TableCell className="text-right font-mono font-medium tabular-nums">$420.00</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Download INV-2026-041">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium">INV-2026-040</TableCell>
              <TableCell className="text-xs text-muted-foreground">Sep 01, 2026</TableCell>
              <TableCell>Northstar Logistics</TableCell>
              <TableCell className="text-right font-mono font-medium tabular-nums">$420.00</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Download INV-2026-040">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Billed</TableCell>
              <TableCell className="text-right font-mono font-semibold text-foreground tabular-nums">
                $840.00
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      ),
      code: `import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from "nexoreui";
import { Download } from "lucide-react";

export default function InvoiceTableDemo() {
  return (
    <Table variant="minimal" hoverable density="normal">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Account</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-mono text-xs font-medium">INV-2026-041</TableCell>
          <TableCell className="text-xs text-muted-foreground">Oct 01, 2026</TableCell>
          <TableCell>Northstar Logistics</TableCell>
          <TableCell className="text-right font-mono font-medium tabular-nums">$420.00</TableCell>
          <TableCell className="text-right">
            <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Download receipt">
              <Download className="w-4 h-4 text-muted-foreground" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Billed</TableCell>
          <TableCell className="text-right font-mono font-semibold tabular-nums">$420.00</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}`,
    },
    {
      name: "Compact Striped & Bordered Matrix",
      description: "High-density grid suited for telemetry records, usage quotas, and rate cards.",
      component: (
        <CustomizableTable
          density="compact"
          striped
          bordered
          headers={["Region", "vCPU", "Memory", "p95 Latency", "State"]}
          rows={[
            ["us-east-1", "16", "64 GB", "11 ms", <Badge key="1" variant="success">Healthy</Badge>],
            ["eu-central-1", "8", "32 GB", "18 ms", <Badge key="2" variant="success">Healthy</Badge>],
            ["ap-south-1", "8", "32 GB", "42 ms", <Badge key="3" variant="warning">Warm</Badge>],
            ["sa-east-1", "4", "16 GB", "61 ms", <Badge key="4" variant="secondary">Standby</Badge>],
          ]}
        />
      ),
      code: `import { CustomizableTable, Badge } from "nexoreui";

const headers = ["Region", "vCPU", "Memory", "p95 Latency", "State"];
const rows = [
  ["us-east-1", "16", "64 GB", "11 ms", <Badge key="1" variant="success">Healthy</Badge>],
  ["eu-central-1", "8", "32 GB", "18 ms", <Badge key="2" variant="success">Healthy</Badge>],
  ["ap-south-1", "8", "32 GB", "42 ms", <Badge key="3" variant="warning">Warm</Badge>],
  ["sa-east-1", "4", "16 GB", "61 ms", <Badge key="4" variant="secondary">Standby</Badge>],
];

export default function CompactMatrixTable() {
  return (
    <CustomizableTable
      density="compact"
      striped
      bordered
      headers={headers}
      rows={rows}
    />
  );
}`,
    },
    {
      name: "Spacious Workspace Quotas",
      description: "Comfortable row spacing with clear separation for settings and billing portals.",
      component: (
        <Table variant="default" density="spacious" hoverable>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Included</TableHead>
              <TableHead>Used</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Edge Bandwidth</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">1.0 TB</TableCell>
              <TableCell className="font-mono text-xs tabular-nums">412 GB</TableCell>
              <TableCell className="text-right">
                <Badge variant="success">Nominal</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Build Minutes</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">6,000 min</TableCell>
              <TableCell className="font-mono text-xs tabular-nums">4,920 min</TableCell>
              <TableCell className="text-right">
                <Badge variant="warning">82% Used</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "nexoreui";

export default function WorkspaceQuotaTable() {
  return (
    <Table variant="default" density="spacious" hoverable>
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead>Included</TableHead>
          <TableHead>Used</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Edge Bandwidth</TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">1.0 TB</TableCell>
          <TableCell className="font-mono text-xs tabular-nums">412 GB</TableCell>
          <TableCell className="text-right">
            <Badge variant="success">Nominal</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Build Minutes</TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">6,000 min</TableCell>
          <TableCell className="font-mono text-xs tabular-nums">4,920 min</TableCell>
          <TableCell className="text-right">
            <Badge variant="warning">82% Used</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
    },
  ];

  const totalPages = Math.ceil(showcaseVariants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = showcaseVariants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="tables-section" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Table</h2>
        <p className="text-muted-foreground mt-1">
          Structured data layouts supporting compound table primitives, customizable arrays, search, and pagination.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "compound table", description: "Custom row layouts embedding avatars, inline progress bars, or action buttons." },
          { label: "DataTable", description: "Arrays of structured records needing built-in search filtering and pagination." },
          { label: "compact + striped", description: "Dense technical logs, infrastructure matrices, or audit tables with many columns." },
          { label: "minimal", description: "Billing history and invoice summaries embedded inside clean settings pages." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={PlaygroundTableWrapper}
          componentName="CustomizableTable"
          importFrom="nexoreui"
          controls={[
            {
              name: "headers",
              type: "text",
              defaultValue: "User, Role, Status, Uptime",
              description: "Comma-separated column header titles"
            },
            {
              name: "row1",
              type: "text",
              defaultValue: "Mina Kato, Systems Engineer, Active, 99.98%",
              description: "Row 1 values (comma-separated)"
            },
            {
              name: "row2",
              type: "text",
              defaultValue: "Tomas Lind, Operations Lead, Offline, 94.12%",
              description: "Row 2 values (comma-separated)"
            },
            {
              name: "row3",
              type: "text",
              defaultValue: "Nadia Okafor, Frontend Lead, Active, 100.00%",
              description: "Row 3 values (comma-separated)"
            },
            {
              name: "row4",
              type: "text",
              defaultValue: "Hanna Berg, DevOps Engineer, Active, 99.95%",
              description: "Row 4 values (comma-separated)"
            },
            {
              name: "variant",
              type: "select",
              defaultValue: "default",
              options: ["default", "minimal", "glass", "gradient"],
              description: "Visual surface style of the table"
            },
            {
              name: "density",
              type: "select",
              defaultValue: "normal",
              options: ["compact", "normal", "spacious"],
              description: "Cell padding density"
            },
            {
              name: "hoverable",
              type: "boolean",
              defaultValue: true,
              description: "Highlight rows on hover"
            },
            {
              name: "striped",
              type: "boolean",
              defaultValue: false,
              description: "Alternate row shading"
            },
            {
              name: "bordered",
              type: "boolean",
              defaultValue: false,
              description: "Show vertical borders between columns"
            },
            {
              name: "animateRows",
              type: "boolean",
              defaultValue: false,
              description: "Trigger entrance transition for rows"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold tracking-tight">Examples</h3>
          <p className="text-sm text-muted-foreground">
            Production table configurations for directories, deployments, invoices, and metrics.
          </p>
        </div>

        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-background p-4 sm:p-6 overflow-hidden">
                <div className="w-full min-w-0">{item.component}</div>
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

      <PropsTable propsData={tablePropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Semantic markup:</strong> Renders standard <code className="text-primary font-mono text-[10px]">&lt;table&gt;</code>, <code className="text-primary font-mono text-[10px]">&lt;thead&gt;</code>, <code className="text-primary font-mono text-[10px]">&lt;tbody&gt;</code>, <code className="text-primary font-mono text-[10px]">&lt;tr&gt;</code>, and <code className="text-primary font-mono text-[10px]">&lt;th&gt;</code> structure.</li>
          <li><strong>Horizontal overflow:</strong> Scroll container wraps the table cleanly on narrow viewports without breaking page layout.</li>
        </ul>
      </div>
    </section>
  );
}
