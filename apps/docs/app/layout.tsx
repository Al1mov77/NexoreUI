import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { LayoutClient } from "./LayoutClient";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "NexoreUI — Modern Animated UI Component Library for React & Next.js",
    template: "%s | NexoreUI",
  },
  description: "A dark-first, animated, aesthetic UI component library built on React, Tailwind CSS, and Framer Motion. 60+ components, themes, interactive playground, and AI assistant.",
  keywords: ["UI Library", "React Components", "Next.js", "Tailwind CSS", "Framer Motion", "Dark Theme", "Animated Components", "NexoreUI", "Design System"],
  authors: [{ name: "NexoreUI" }],
  creator: "NexoreUI",
  publisher: "NexoreUI",
  metadataBase: new URL("https://www.nexoreui.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nexoreui.com",
    title: "NexoreUI — Modern Animated UI Component Library for React & Next.js",
    description: "A dark-first, animated, aesthetic UI component library built on React, Tailwind CSS, and Framer Motion. 60+ components, themes, interactive playground, and AI assistant.",
    siteName: "NexoreUI"
  },
  twitter: {
    card: "summary_large_image",
    title: "NexoreUI — Beautiful React Components",
    description: "Modern, animated, production-ready React 19 components."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
