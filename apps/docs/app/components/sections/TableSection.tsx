'use client';

import React, { useState } from 'react';
import { ComponentSource } from '../ComponentSource';
import { PropsEditor } from '../PropsEditor';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  CustomizableTable,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Progress,
  Button
} from 'nexoreui';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Globe, 
  TrendingUp, 
  Download, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Award,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowRight
} from 'lucide-react';

// Wrapper for the PropsEditor component so it has predefined data
const PlaygroundTableWrapper: React.FC<any> = (props) => {
  const headers = ["User", "Role", "Status", "Uptime"];
  const rows = [
    [
      <div className="flex items-center gap-2">
        <Avatar size="sm" variant="gradient">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground/90">Alice Vance</span>
      </div>,
      <span className="font-medium">System Architect</span>,
      <Badge variant="success" dot pulse>Active</Badge>,
      <span className="font-mono text-xs opacity-80">99.98%</span>
    ],
    [
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>BM</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground/90">Bob Marley</span>
      </div>,
      <span className="font-medium">Content Manager</span>,
      <Badge variant="secondary">Offline</Badge>,
      <span className="font-mono text-xs opacity-80">94.12%</span>
    ],
    [
      <div className="flex items-center gap-2">
        <Avatar size="sm" variant="glow">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground/90">Charlie Neon</span>
      </div>,
      <span className="font-medium">Lead Developer</span>,
      <Badge variant="neon" dot>Active</Badge>,
      <span className="font-mono text-xs opacity-80">100.00%</span>
    ]
  ];

  return (
    <div className="w-full max-w-2xl">
      <CustomizableTable headers={headers} rows={rows} {...props} />
    </div>
  );
};

export function TableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Real world table layouts
  const showcaseVariants = [
    {
      name: "1. Premium Glassmorphic Team Dashboard",
      description: "Uses a translucent overlay, subtle borders, and smooth backdrop blurs to display team project updates and real-time metrics.",
      component: (
        <Table variant="glass" hoverable striped={false} density="normal">
          <TableCaption>Glassmorphic active operations tracker</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Active Project</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" variant="gradient">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground/95">Sophia Diaz</div>
                    <div className="text-[11px] text-muted-foreground">sophia@nexore.ai</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">Cloud Migrate</TableCell>
              <TableCell className="min-w-[120px]">
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
                    <span>Migration</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} size="sm" variant="default" />
                </div>
              </TableCell>
              <TableCell><Badge variant="success" dot pulse>Running</Badge></TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="glass" className="h-7 px-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" variant="glow">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" />
                    <AvatarFallback>JH</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground/95">Jack Hughes</div>
                    <div className="text-[11px] text-muted-foreground">jack@nexore.ai</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">UI Redesign v2</TableCell>
              <TableCell className="min-w-[120px]">
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
                    <span>Deploy</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} size="sm" variant="success" />
                </div>
              </TableCell>
              <TableCell><Badge variant="neon">Completed</Badge></TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="glass" className="h-7 px-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground/95">Marcus Lin</div>
                    <div className="text-[11px] text-muted-foreground">marcus@nexore.ai</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">SEO Marketing</TableCell>
              <TableCell className="min-w-[120px]">
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
                    <span>Research</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} size="sm" variant="warning" />
                </div>
              </TableCell>
              <TableCell><Badge variant="secondary">Paused</Badge></TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="glass" className="h-7 px-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Avatar, Badge, Progress, Button } from "nexoreui"
import { ChevronRight } from "lucide-react"

<Table variant="glass" hoverable>
  <TableHeader>
    <TableRow>
      <TableHead>Team Member</TableHead>
      <TableHead>Active Project</TableHead>
      <TableHead>Progress</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar size="sm" variant="gradient">
            <AvatarImage src="/avatar1.png" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">Sophia Diaz</div>
            <div className="text-[11px] text-muted-foreground">sophia@nexore.ai</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">Cloud Migrate</TableCell>
      <TableCell className="min-w-[120px]">
        <Progress value={85} size="sm" />
      </TableCell>
      <TableCell><Badge variant="success" dot pulse>Running</Badge></TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="glass"><ChevronRight className="w-4 h-4" /></Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`
    },
    {
      name: "2. Neon Aurora Cyber-Leaderboard",
      description: "Electric design emphasizing dark theme rows, glowing active ranking numbers, and vibrant neon headers.",
      component: (
        <Table variant="neon" hoverable striped density="compact">
          <TableCaption>Nexore global developer leaderboard</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead>Developer</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Uptime Score</TableHead>
              <TableHead className="text-right">XP Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-l-2 border-l-yellow-500 bg-yellow-500/[0.02]">
              <TableCell className="text-center font-bold text-yellow-500 flex items-center justify-center gap-1">
                <Award className="w-4 h-4" /> #1
              </TableCell>
              <TableCell className="font-bold text-white flex items-center gap-2">
                <Avatar size="sm" variant="glow" className="w-6 h-6">
                  <AvatarFallback className="text-[10px]">ZE</AvatarFallback>
                </Avatar>
                Zack Evans
              </TableCell>
              <TableCell><Badge variant="neon">Kernel dev</Badge></TableCell>
              <TableCell className="font-mono text-purple-400">100.00%</TableCell>
              <TableCell className="text-right font-mono font-bold text-yellow-500">12,402 XP</TableCell>
            </TableRow>
            <TableRow className="border-l-2 border-l-slate-400 bg-slate-400/[0.01]">
              <TableCell className="text-center font-bold text-slate-400">#2</TableCell>
              <TableCell className="font-semibold text-purple-100 flex items-center gap-2">
                <Avatar size="sm" className="w-6 h-6">
                  <AvatarFallback className="text-[10px]">LM</AvatarFallback>
                </Avatar>
                Lucy Miller
              </TableCell>
              <TableCell><Badge variant="default" className="bg-purple-950/40 text-purple-300 border-purple-800/40">UI Architect</Badge></TableCell>
              <TableCell className="font-mono text-purple-400">99.94%</TableCell>
              <TableCell className="text-right font-mono font-semibold text-slate-300">10,850 XP</TableCell>
            </TableRow>
            <TableRow className="border-l-2 border-l-amber-700 bg-amber-700/[0.01]">
              <TableCell className="text-center font-bold text-amber-600">#3</TableCell>
              <TableCell className="font-semibold text-purple-100 flex items-center gap-2">
                <Avatar size="sm" className="w-6 h-6">
                  <AvatarFallback className="text-[10px]">TR</AvatarFallback>
                </Avatar>
                Toby Rix
              </TableCell>
              <TableCell><Badge variant="secondary">DevOps</Badge></TableCell>
              <TableCell className="font-mono text-purple-400">99.87%</TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">9,410 XP</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Avatar, Badge } from "nexoreui"
import { Award } from "lucide-react"

<Table variant="neon" hoverable striped density="compact">
  <TableHeader>
    <TableRow>
      <TableHead className="w-16 text-center">Rank</TableHead>
      <TableHead>Developer</TableHead>
      <TableHead>Specialty</TableHead>
      <TableHead>Uptime Score</TableHead>
      <TableHead className="text-right">XP Points</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-l-2 border-l-yellow-500 bg-yellow-500/[0.02]">
      <TableCell className="text-center font-bold text-yellow-500 flex items-center justify-center gap-1">
        <Award className="w-4 h-4" /> #1
      </TableCell>
      <TableCell className="font-bold text-white flex items-center gap-2">
        <Avatar size="sm" variant="glow" className="w-6 h-6"><AvatarFallback>ZE</AvatarFallback></Avatar>
        Zack Evans
      </TableCell>
      <TableCell><Badge variant="neon">Kernel dev</Badge></TableCell>
      <TableCell className="font-mono text-purple-400">100.00%</TableCell>
      <TableCell className="text-right font-mono font-bold text-yellow-500">12,402 XP</TableCell>
    </TableRow>
  </TableBody>
</Table>`
    },
    {
      name: "3. Industrial Cyberpunk Terminal Grid",
      description: "High-tech grid using raw monospace text, cyber borders, flashing activity indicators, and glowing corners.",
      component: (
        <Table variant="cyberpunk" hoverable bordered density="compact">
          <TableCaption>System logs live server matrix</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead><Cpu className="w-3.5 h-3.5 inline mr-1" /> Node ID</TableHead>
              <TableHead><Globe className="w-3.5 h-3.5 inline mr-1" /> Domain / IP</TableHead>
              <TableHead><Activity className="w-3.5 h-3.5 inline mr-1" /> Load</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-green-300">NEX-01_SYS</TableCell>
              <TableCell>192.168.10.88</TableCell>
              <TableCell className="text-yellow-400">76.4% CPU</TableCell>
              <TableCell><span className="text-green-500 animate-pulse font-bold">[ONLINE]</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-green-300">NEX-02_DB</TableCell>
              <TableCell>10.0.4.152</TableCell>
              <TableCell className="text-green-500">14.1% CPU</TableCell>
              <TableCell><span className="text-green-500 animate-pulse font-bold">[ONLINE]</span></TableCell>
            </TableRow>
            <TableRow className="bg-red-950/20">
              <TableCell className="font-bold text-red-500">NEX-03_GPU</TableCell>
              <TableCell>192.168.20.90</TableCell>
              <TableCell className="text-red-500">99.8% OVERLOAD</TableCell>
              <TableCell><span className="text-red-500 animate-ping font-bold">[WARN_CRIT]</span></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "nexoreui"
import { Cpu, Globe, Activity } from "lucide-react"

<Table variant="cyberpunk" hoverable bordered density="compact">
  <TableHeader>
    <TableRow>
      <TableHead><Cpu className="w-3.5 h-3.5 inline mr-1" /> Node ID</TableHead>
      <TableHead><Globe className="w-3.5 h-3.5 inline mr-1" /> Domain / IP</TableHead>
      <TableHead><Activity className="w-3.5 h-3.5 inline mr-1" /> Load</TableHead>
      <TableHead>State</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-bold text-green-300">NEX-01_SYS</TableCell>
      <TableCell>192.168.10.88</TableCell>
      <TableCell className="text-yellow-400">76.4% CPU</TableCell>
      <TableCell><span className="text-green-500 animate-pulse">[ONLINE]</span></TableCell>
    </TableRow>
  </TableBody>
</Table>`
    },
    {
      name: "4. E-commerce Minimal Orders Registry",
      description: "A clean, minimalist invoice history list with borderless grids, clean metrics layout, and download actions.",
      component: (
        <Table variant="minimal" hoverable density="spacious">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-primary font-mono">#NX-9051</TableCell>
              <TableCell className="text-muted-foreground text-xs">May 21, 2026</TableCell>
              <TableCell className="font-medium text-foreground/90">Emin Alimov</TableCell>
              <TableCell className="font-bold text-foreground">$249.99</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-primary font-mono">#NX-9050</TableCell>
              <TableCell className="text-muted-foreground text-xs">May 19, 2026</TableCell>
              <TableCell className="font-medium text-foreground/90">Sarah Connor</TableCell>
              <TableCell className="font-bold text-foreground">$1,200.00</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "nexoreui"
import { Download } from "lucide-react"

<Table variant="minimal" hoverable density="spacious">
  <TableHeader>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Total Amount</TableHead>
      <TableHead className="text-right">Receipt</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-bold text-primary font-mono">#NX-9051</TableCell>
      <TableCell className="text-muted-foreground text-xs">May 21, 2026</TableCell>
      <TableCell className="font-medium text-foreground/90">Emin Alimov</TableCell>
      <TableCell className="font-bold">$249.99</TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`
    },
    {
      name: "5. Gradient Dashboard Admin Panel",
      description: "A functional management layout with gradient headers, grid controls, and user pagination options.",
      component: (
        <div className="w-full">
          <Table variant="gradient" hoverable density="normal">
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Data Transferred</TableHead>
                <TableHead>Billing State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="font-semibold text-foreground/95 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                    Vercel Sync
                  </div>
                </TableCell>
                <TableCell><Badge variant="neon">Enterprise</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">4.82 TB / 10 TB</TableCell>
                <TableCell><span className="text-emerald-500 font-semibold flex items-center gap-1 text-xs"><Check className="w-3.5 h-3.5" /> Paid</span></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="outline" className="h-7 w-7 rounded-lg p-0"><Edit2 className="w-3 h-3" /></Button>
                    <Button variant="destructive" className="h-7 w-7 rounded-lg p-0"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-semibold text-foreground/95 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    Supabase Link
                  </div>
                </TableCell>
                <TableCell><Badge variant="default" className="bg-indigo-950/40 text-indigo-300 border-indigo-800/40">Developer</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">1.12 TB / 2 TB</TableCell>
                <TableCell><span className="text-emerald-500 font-semibold flex items-center gap-1 text-xs"><Check className="w-3.5 h-3.5" /> Paid</span></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="outline" className="h-7 w-7 rounded-lg p-0"><Edit2 className="w-3 h-3" /></Button>
                    <Button variant="destructive" className="h-7 w-7 rounded-lg p-0"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-semibold text-foreground/95 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    AWS Node Gateway
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">Free Sandbox</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">0.05 TB / 0.1 TB</TableCell>
                <TableCell><span className="text-amber-500 font-semibold flex items-center gap-1 text-xs"><Activity className="w-3.5 h-3.5" /> Overdue</span></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="outline" className="h-7 w-7 rounded-lg p-0"><Edit2 className="w-3 h-3" /></Button>
                    <Button variant="destructive" className="h-7 w-7 rounded-lg p-0"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground px-1">
            <span>Showing 3 of 12 gateways</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 text-[11px] py-0 px-2" disabled>Previous</Button>
              <span className="font-medium font-mono text-[10px]">Page 1 / 4</span>
              <Button size="sm" variant="outline" className="h-7 text-[11px] py-0 px-2">Next <ArrowRight className="w-3 h-3 inline ml-0.5" /></Button>
            </div>
          </div>
        </div>
      ),
      code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from "nexoreui"
import { Check, Edit2, Trash2, Activity } from "lucide-react"

<div className="w-full">
  <Table variant="gradient" hoverable density="normal">
    <TableHeader>
      <TableRow>
        <TableHead>Organization</TableHead>
        <TableHead>Tier</TableHead>
        <TableHead>Data Transferred</TableHead>
        <TableHead>Billing State</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <div className="font-semibold flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
            Vercel Sync
          </div>
        </TableCell>
        <TableCell><Badge variant="neon">Enterprise</Badge></TableCell>
        <TableCell className="font-mono text-xs">4.82 TB / 10 TB</TableCell>
        <TableCell><span className="text-emerald-500 font-semibold flex items-center gap-1 text-xs"><Check className="w-3.5 h-3.5" /> Paid</span></TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1.5">
            <Button variant="outline" className="h-7 w-7 rounded-lg p-0"><Edit2 className="w-3 h-3" /></Button>
            <Button variant="destructive" className="h-7 w-7 rounded-lg p-0"><Trash2 className="w-3 h-3" /></Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`
    }
  ];

  const totalPages = Math.ceil(showcaseVariants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = showcaseVariants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="tables-section" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tables</h2>
          <p className="text-muted-foreground">Beautiful layouts using HTML table subcomponents with premium animation, glassmorphism, and neon styles.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={PlaygroundTableWrapper}
          componentName="CustomizableTable"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              defaultValue: "default",
              options: ["default", "glass", "neon", "minimal", "cyberpunk", "aurora", "gradient"],
              description: "Visual preset theme of the table"
            },
            {
              name: "density",
              type: "select",
              defaultValue: "normal",
              options: ["compact", "normal", "spacious"],
              description: "Cell padding density of rows"
            },
            {
              name: "hoverable",
              type: "boolean",
              defaultValue: true,
              description: "Highlight rows on mouse hover"
            },
            {
              name: "striped",
              type: "boolean",
              defaultValue: false,
              description: "Alternate row colors dynamically"
            },
            {
              name: "bordered",
              type: "boolean",
              defaultValue: false,
              description: "Add grid boundaries to all table cells"
            },
            {
              name: "animateRows",
              type: "boolean",
              defaultValue: true,
              description: "Enable spring-based slide-in animations for rows on mount"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        <div className="border-b border-border/60 pb-2">
          <h3 className="text-xl font-bold tracking-tight">Showcase Pre-styled Templates</h3>
          <p className="text-sm text-muted-foreground">Selectable real-world configurations that demonstrate styling versatility.</p>
        </div>

        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div>
              <h4 className="text-base font-semibold text-foreground/90">{item.name}</h4>
              <p className="text-sm text-muted-foreground/80 mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-border/80 bg-card/10 backdrop-blur-sm p-6 relative overflow-hidden">
                {/* Background glow effects for premium feeling */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/[0.01] to-pink-500/[0.01] pointer-events-none" />
                <div className="w-full">
                  {item.component}
                </div>
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
