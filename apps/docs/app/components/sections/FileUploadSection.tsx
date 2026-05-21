"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
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

export function FileUploadSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="file-upload" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">File Upload</h2>
          <p className="text-muted-foreground">Drag and drop file upload region with automatic validation checking for size, count and support extensions.</p>
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

      {/* Props Table */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">API Reference</h3>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold">
                <th className="p-3">Property</th>
                <th className="p-3">Type</th>
                <th className="p-3">Default</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono font-bold text-primary">onUpload</td>
                <td className="p-3 font-mono text-purple-400">(files: File[]) =&gt; void</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Callback fired when files are validated and uploaded.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">accept</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Mime-type query string (e.g. &quot;image/*,.pdf&quot;).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">maxSize</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">10485760 (10MB)</td>
                <td className="p-3">Maximum file size threshold in bytes.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">multiple</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">false</td>
                <td className="p-3">Allows uploading more than one item in sequence.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">variant</td>
                <td className="p-3 font-mono text-purple-400">&quot;default&quot; | &quot;dropzone&quot; | &quot;button&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;default&quot;</td>
                <td className="p-3">Display variant for file collection component.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
