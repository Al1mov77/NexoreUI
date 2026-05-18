"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent, Button } from "nexoreui";

const variants = [
  {
    name: "Default Tabs",
    component: (
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-4 bg-secondary/20 rounded-b-lg border border-border/50">Make changes to your account here.</TabsContent>
        <TabsContent value="password" className="p-4 bg-secondary/20 rounded-b-lg border border-border/50">Change your password here.</TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui"\n\n<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">...</TabsContent>\n</Tabs>`
  },
  {
    name: "Pill Style Tabs",
    component: (
      <Tabs defaultValue="all" className="w-[400px]">
        <TabsList className="bg-transparent gap-2">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">All</TabsTrigger>
          <TabsTrigger value="unread" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="p-4">All messages</TabsContent>
        <TabsContent value="unread" className="p-4">Unread messages</TabsContent>
      </Tabs>
    ),
    code: `<TabsList className="bg-transparent gap-2">\n  <TabsTrigger className="rounded-full border" value="all">All</TabsTrigger>\n</TabsList>`
  },
  {
    name: "Underline Tabs",
    component: (
      <Tabs defaultValue="music" className="w-[400px]">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger value="music" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 pt-2">Music</TabsTrigger>
          <TabsTrigger value="podcasts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 pt-2">Podcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="music" className="p-4">Music library</TabsContent>
        <TabsContent value="podcasts" className="p-4">Podcast episodes</TabsContent>
      </Tabs>
    ),
    code: `<TabsList className="bg-transparent border-b rounded-none">\n  <TabsTrigger className="border-b-2 border-transparent data-[state=active]:border-primary" value="music">Music</TabsTrigger>\n</TabsList>`
  },
  {
    name: "Vertical Tabs",
    component: (
      <Tabs defaultValue="general" className="flex w-[400px] gap-4">
        <TabsList className="flex flex-col h-auto w-[120px] items-start bg-transparent">
          <TabsTrigger value="general" className="w-full justify-start data-[state=active]:bg-secondary">General</TabsTrigger>
          <TabsTrigger value="billing" className="w-full justify-start data-[state=active]:bg-secondary">Billing</TabsTrigger>
        </TabsList>
        <div className="flex-1 border p-4 rounded-lg">
          <TabsContent value="general" className="mt-0">General settings</TabsContent>
          <TabsContent value="billing" className="mt-0">Billing settings</TabsContent>
        </div>
      </Tabs>
    ),
    code: `<Tabs orientation="vertical" className="flex">\n  <TabsList className="flex flex-col">\n    <TabsTrigger value="general">General</TabsTrigger>\n  </TabsList>\n  <TabsContent value="general">...</TabsContent>\n</Tabs>`
  },
  {
    name: "Tabs with Icons",
    component: (
      <Tabs defaultValue="home" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" className="gap-2"><span>🏠</span> Home</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><span>⚙️</span> Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="p-4 border rounded-b-lg mt-0">Home dashboard</TabsContent>
        <TabsContent value="settings" className="p-4 border rounded-b-lg mt-0">App settings</TabsContent>
      </Tabs>
    ),
    code: `<TabsTrigger value="home" className="gap-2">\n  <Icon /> Home\n</TabsTrigger>`
  },
  {
    name: "Full Width Tabs",
    component: (
      <Tabs defaultValue="one" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger value="one" className="flex-1">One</TabsTrigger>
          <TabsTrigger value="two" className="flex-1">Two</TabsTrigger>
          <TabsTrigger value="three" className="flex-1">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="p-4 border rounded-b-lg mt-0">Panel One</TabsContent>
        <TabsContent value="two" className="p-4 border rounded-b-lg mt-0">Panel Two</TabsContent>
        <TabsContent value="three" className="p-4 border rounded-b-lg mt-0">Panel Three</TabsContent>
      </Tabs>
    ),
    code: `<TabsList className="flex w-full">\n  <TabsTrigger value="one" className="flex-1">One</TabsTrigger>\n</TabsList>`
  },
  {
    name: "Card Tabs",
    component: (
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="p-6 border rounded-lg mt-2 bg-card text-card-foreground shadow-sm">Login form here</TabsContent>
        <TabsContent value="register" className="p-6 border rounded-lg mt-2 bg-card text-card-foreground shadow-sm">Register form here</TabsContent>
      </Tabs>
    ),
    code: `<TabsContent value="login" className="p-6 border rounded-lg mt-2 shadow-sm">\n  Login form\n</TabsContent>`
  },
  {
    name: "Minimal Tabs",
    component: (
      <Tabs defaultValue="preview" className="w-[400px]">
        <TabsList className="bg-transparent p-0 gap-4">
          <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold p-0">Preview</TabsTrigger>
          <TabsTrigger value="code" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold p-0 text-muted-foreground">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-4 mt-4 bg-muted rounded-md">Visual preview</TabsContent>
        <TabsContent value="code" className="p-4 mt-4 bg-muted rounded-md font-mono text-sm">Source code</TabsContent>
      </Tabs>
    ),
    code: `<TabsList className="bg-transparent p-0 gap-4">\n  <TabsTrigger className="data-[state=active]:bg-transparent p-0" value="preview">Preview</TabsTrigger>\n</TabsList>`
  },
  {
    name: "Disabled Tab",
    component: (
      <Tabs defaultValue="active" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="p-4">Active content</TabsContent>
        <TabsContent value="other" className="p-4">Other content</TabsContent>
      </Tabs>
    ),
    code: `<TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>`
  },
  {
    name: "Animated Tabs",
    component: (
      <Tabs defaultValue="tab1" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tab1" className="transition-all duration-300">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" className="transition-all duration-300">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="p-4 animate-in fade-in zoom-in-95">Animated content 1</TabsContent>
        <TabsContent value="tab2" className="p-4 animate-in fade-in zoom-in-95">Animated content 2</TabsContent>
      </Tabs>
    ),
    code: `<TabsContent value="tab1" className="animate-in fade-in zoom-in-95">\n  Content\n</TabsContent>`
  }
];

export function TabsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="tabs" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tabs</h2>
          <p className="text-muted-foreground">A set of layered sections of content, known as tab panels, that display one panel of content at a time.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-background p-6">
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
