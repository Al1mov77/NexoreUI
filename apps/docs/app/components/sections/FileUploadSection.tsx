"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { FileUpload, Button } from "nexoreui"

function FileUploadDemo(props: any) {
  const [uploaded, setUploaded] = useState<File[]>([])
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <FileUpload {...props} onUpload={setUploaded} />
      {uploaded.length > 0 && (
        <div className="text-xs text-emerald-500 font-semibold text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
          Successfully loaded {uploaded.length} file(s) for submission.
        </div>
      )}
    </div>
  )
}

const examples = [
  {
    name: "Default Drag & Drop Zone",
    component: <FileUploadDemo />,
    code: `import React, { useState } from "react"\nimport { FileUpload } from "nexoreui"\n\nexport function Demo() {\n  const [files, setFiles] = useState<File[]>([])\n  return (\n    <FileUpload onUpload={setFiles} />\n  )\n}`
  },
  {
    name: "Large Dropzone Variant",
    component: <FileUploadDemo variant="dropzone" maxSize={5 * 1024 * 1024} />,
    code: `import { FileUpload } from "nexoreui"\n\n<FileUpload variant="dropzone" maxSize={5 * 1024 * 1024} onUpload={setFiles} />`
  },
  {
    name: "Simple Button Trigger",
    component: <FileUploadDemo variant="button" />,
    code: `import { FileUpload } from "nexoreui"\n\n<FileUpload variant="button" onUpload={setFiles} />`
  },
  {
    name: "Multiple File Selection",
    component: <FileUploadDemo multiple={true} />,
    code: `import { FileUpload } from "nexoreui"\n\n<FileUpload multiple onUpload={setFiles} />`
  },
  {
    name: "Images & PDF Formats Only",
    component: <FileUploadDemo accept="image/*,application/pdf" />,
    code: `import { FileUpload } from "nexoreui"\n\n<FileUpload accept="image/*,application/pdf" onUpload={setFiles} />`
  }
]

const fileUploadPropsData = [
  { name: "onUpload", type: "(files: File[]) => void", defaultValue: "—", description: "Callback fired when files are validated and uploaded.", required: true },
  { name: "accept", type: "string", defaultValue: "—", description: "Mime-type query string (e.g. \"image/*,.pdf\").", required: false },
  { name: "maxSize", type: "number", defaultValue: "10485760 (10MB)", description: "Maximum file size threshold in bytes.", required: false },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows uploading more than one item in sequence.", required: false },
  { name: "variant", type: '"default" | "dropzone" | "button"', defaultValue: '"default"', description: "Display variant for file collection component.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function FileUploadSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="file-upload" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">File Upload</h2>
          <p className="text-muted-foreground mt-1">Drag and drop file upload region with automatic validation checking for size, count and support extensions.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default layout", "Inline form blocks requesting a fast document upload or receipt scanner"],
            ["dropzone variant", "Dedicated media or content drop areas where rich instructions, drag alerts, and multi-file listings are expected"],
            ["button variant", "Compact dialog forms or profile picture triggers where a full drag zone is visually overwhelming"],
            ["accept type constraint", "Enforcing strict file extensions (e.g. only JPEG/PNG images or PDF documents) before browser selection opens"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <FileUploadDemo {...props} />
          )}
          componentName="FileUpload"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "dropzone", "button"],
              defaultValue: "default",
              description: "Visual container styling format option"
            },
            {
              name: "multiple",
              type: "boolean",
              defaultValue: false,
              description: "Allows uploading multiple items simultaneously"
            },
            {
              name: "accept",
              type: "text",
              defaultValue: "image/*,application/pdf",
              description: "Comma-separated string of accepted formats"
            },
            {
              name: "maxSize",
              type: "number",
              defaultValue: 10485760,
              description: "Maximum file size constraint limit in bytes (e.g. 10MB)"
            }
          ]}
        />
      </div>

      {/* Examples list */}
      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Table */}
      <PropsTable propsData={fileUploadPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Target clickable zones are focusable and can be activated using <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Space</kbd>.</li>
          <li><strong>Native Input:</strong> Employs a hidden native <code className="text-primary font-mono text-[10px]">&lt;input type="file"&gt;</code> element to guarantee full compatibility with mobile devices, voice command utilities, and standard screen readers.</li>
        </ul>
      </div>
    </section>
  )
}
