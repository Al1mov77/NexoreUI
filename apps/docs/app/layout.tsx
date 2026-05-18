import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NexoreUI — Beautiful React Components",
  description: "Modern, animated, production-ready React 19 components. Built with Tailwind CSS, Framer Motion and Radix UI. Free and open source.",
  keywords: ["react components", "ui library", "tailwind css", "framer motion", "nextjs", "radix ui", "typescript", "open source"],
  authors: [{ name: "NexoreUI Team" }],
  creator: "NexoreUI",
  publisher: "NexoreUI",
  metadataBase: new URL("https://nexoreui.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexoreui.vercel.app",
    title: "NexoreUI — Beautiful React Components",
    description: "Modern, animated, production-ready React 19 components.",
    siteName: "NexoreUI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NexoreUI" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "NexoreUI — Beautiful React Components",
    description: "Modern, animated, production-ready React 19 components.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
