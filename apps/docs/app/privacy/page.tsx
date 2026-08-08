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
          <p className="text-muted-foreground">Last updated: August 8, 2026</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Controller and Contact Information</h2>
            <p>
              This Privacy Policy explains how <strong>NexoreUI</strong> ("we", "us", or "our") 
              collects, uses, and protects your information. This policy applies to all users of NexoreUI regardless of location. 
              For any questions regarding your data or this policy, please contact us at <strong>nexoreuiteam@mail.ru</strong>.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data Collected vs. Not Collected</h2>
            <p>
              We prioritize your privacy and practice strictly anonymized data collection. When you visit our website, 
              we collect basic technical metrics (browser, operating system, device type, pages visited, session duration, and referrer).
              <strong> We do not collect or store your full IP address.</strong> Your IP is immediately anonymized (e.g., <code>187.85.xxx.xxx</code>) before being temporarily saved in our database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Session and Local Storage</h2>
            <p>
              We do not use invasive third-party tracking cookies. To understand how visitors navigate our components, 
              we use your browser's <code>sessionStorage</code> and <code>localStorage</code> to generate a temporary, anonymous Session ID. 
              Under EU laws such as the ePrivacy Directive, the use of local storage for session tracking requires disclosure similar to a cookie policy. 
              This ID cannot be linked to your identity, and you are never personally identified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Geolocation</h2>
            <p>
              We determine your general location (<strong>country and city</strong>) by analyzing incoming IP request headers. 
              While this constitutes a form of geolocation, it is strictly used at an aggregate level. We do not use third-party GPS services, 
              and the underlying IP addresses used to determine this location are anonymized and not stored long-term.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We adhere to strict data retention limits to minimize our data footprint:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Session Records:</strong> Retained for <strong>30 days</strong>.</li>
              <li><strong>Aggregated Page Views:</strong> Retained for <strong>90 days</strong>.</li>
            </ul>
            <p className="mt-2">
              After these periods, the respective analytics data is automatically deleted from our databases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services & International Data Transfers</h2>
            <p>
              We use aggregated notification summaries sent internally via Telegram to monitor site health. 
              <strong>Only aggregated information (such as pages visited, country, and city) is transmitted to Telegram.</strong> 
              No personally identifiable information (PII) or raw IP addresses are ever sent.
            </p>
            <p className="mt-2">
              Please note that our database and third-party services (like Telegram) may be hosted on servers located 
              outside the European Economic Area (EEA). By using our services, you acknowledge this potential international transfer 
              of anonymized and aggregated data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Purpose of Analytics</h2>
            <p>
              Our analytics are used <strong>exclusively for improving the product</strong>. We use these metrics to understand which components are popular, ensure the site loads correctly across devices, and block malicious automated crawlers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Your Rights (Including GDPR)</h2>
            <p>
              Depending on your location, you may have specific rights regarding your data under the GDPR or other privacy laws. 
              Since we do not store personally identifiable information, we generally cannot identify you to delete specific historical records. 
              However, you can clear your browser's local storage at any time to instantly reset your anonymous session identifier.
            </p>
            <p className="mt-2">
              If you believe your data privacy rights have been violated, you have the right to lodge a complaint with the relevant 
              supervisory authority or data protection agency in your jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
