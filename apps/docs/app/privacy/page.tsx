"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collected vs. Not Collected</h2>
            <p>
              We prioritize your privacy and practice strictly anonymized data collection. When you visit our website, 
              we collect basic technical metrics (browser, operating system, device type, pages visited, session duration, and referrer).
              <strong> We do not collect or store your full IP address.</strong> Your IP is immediately anonymized (e.g., <code>187.85.xxx.xxx</code>) before being temporarily saved in our database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Session and Local Storage</h2>
            <p>
              We do not use invasive third-party tracking cookies. To understand how visitors navigate our components, 
              we use your browser's <code>sessionStorage</code> and <code>localStorage</code> to generate a temporary, anonymous Session ID. This ID cannot be linked 
              to your identity, and you are never personally identified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Geography</h2>
            <p>
              We display only your <strong>country and city</strong> using general platform headers. We do not use third-party geolocation services, nor do we perform exact location tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services (Telegram)</h2>
            <p>
              We use aggregated notification summaries sent internally via Telegram to monitor site health. 
              <strong>Only aggregated information (such as pages visited, country, and city) is transmitted to Telegram.</strong> 
              No personally identifiable information (PII) or raw IP addresses are ever sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Purpose of Analytics</h2>
            <p>
              Our analytics are used <strong>exclusively for improving the product</strong>. We use these metrics to understand which components are popular, ensure the site loads correctly across devices, and block malicious automated crawlers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>
              Since we do not store personally identifiable information, we cannot identify you to delete specific historical records. 
              However, you can clear your browser's local storage at any time to instantly reset your anonymous session identifier.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
