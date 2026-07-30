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
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We prioritize your privacy and minimize the data we collect. When you visit our website, we collect your IP address exclusively for analytics purposes. 
              This helps us understand how our website is used and allows us to improve our services and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              The IP address data collected is used solely for internal analytics. We use this information to analyze traffic patterns, site usage statistics, and to ensure the security and stability of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing and Disclosure</h2>
            <p>
              <strong>We will never sell, rent, or share your IP address or any other personal data with third parties.</strong> Your data is kept strictly confidential and is used internally by our team only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect the information we collect against unauthorized access, alteration, disclosure, or destruction. 
              While no method of transmission over the internet is 100% secure, we strive to use commercially acceptable means to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us through our GitHub repository or via our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
