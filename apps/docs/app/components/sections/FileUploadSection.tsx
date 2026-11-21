"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { A11yHeader } from "../A11yNotice"
import { WhenToUse } from "../WhenToUse"
import { FileUpload, Button } from "nexoreui"

function FileUploadDemo(props: Partial<React.ComponentProps<typeof FileUpload>>) {
  const [uploaded, setUploaded] = useState<File[]>([])
  return (
    <div className="w-full max-w-md flex flex-col gap-3 items-center justify-center">
      <FileUpload {...props} onUpload={setUploaded} />
      {uploaded.length > 0 && (
        <div className="w-full text-xs text-success font-medium text-center bg-success/10 border border-success/20 rounded-lg p-2 tabular-nums">
          Loaded {uploaded.length} {uploaded.length === 1 ? "file" : "files"} for upload.
        </div>
      )}
    </div>
  )
}

const examples = [
  {
    name: "Default Drag & Drop Zone",
    component: <FileUploadDemo />,
    code: `import { useState } from "react";
import { FileUpload } from "nexoreui";

export default function DefaultFileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md space-y-2">
      <FileUpload onUpload={setFiles} />
      {files.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Selected {files.length} file(s)
        </p>
      )}
    </div>
  );
}`
  },
  {
    name: "Large Dropzone Variant",
    component: <FileUploadDemo variant="dropzone" maxSize={5 * 1024 * 1024} />,
    code: `import { useState } from "react";
import { FileUpload } from "nexoreui";

export default function DropzoneVariantDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md space-y-2">
      <FileUpload
        variant="dropzone"
        maxSize={5 * 1024 * 1024}
        onUpload={setFiles}
      />
      {files.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Ready to submit {files[0].name}
        </p>
      )}
    </div>
  );
}`
  },
  {
    name: "Compact Action Bar Trigger",
    component: <FileUploadDemo variant="button" />,
    code: `import { useState } from "react";
import { FileUpload } from "nexoreui";

export default function ButtonFileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md">
      <FileUpload variant="button" onUpload={setFiles} />
    </div>
  );
}`
  },
  {
    name: "Multiple File Selection",
    component: <FileUploadDemo multiple={true} />,
    code: `import { useState } from "react";
import { FileUpload } from "nexoreui";

export default function MultiFileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md space-y-2">
      <FileUpload multiple onUpload={setFiles} />
      {files.length > 0 && (
        <p className="text-xs font-mono text-muted-foreground tabular-nums">
          {files.length} file(s) queued
        </p>
      )}
    </div>
  );
}`
  },
  {
    name: "Images & PDF Formats Only",
    component: <FileUploadDemo accept="image/*,application/pdf" />,
    code: `import { useState } from "react";
import { FileUpload } from "nexoreui";

export default function AcceptedTypesUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md">
      <FileUpload
        accept="image/*,application/pdf"
        onUpload={setFiles}
      />
    </div>
  );
}`
  }
]

const fileUploadPropsData = [
  { name: "onUpload", type: "(files: File[]) => void", defaultValue: "-", description: "Callback fired when files are validated and uploaded.", required: true },
  { name: "accept", type: "string", defaultValue: "-", description: "Mime-type query string (e.g. \"image/*,.pdf\").", required: false },
  { name: "maxSize", type: "number", defaultValue: "10485760 (10MB)", description: "Maximum file size threshold in bytes.", required: false },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows uploading more than one item in sequence.", required: false },
  { name: "variant", type: '"default" | "dropzone" | "button"', defaultValue: '"default"', description: "Display variant for file collection component.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
]

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
          <p className="text-muted-foreground mt-1">
            Drag and drop file upload region with validation checking for size, count, and supported extensions.
          </p>
        </div>
      </div>

      <WhenToUse
        items={[
          { label: "default layout", description: "Inline form fields collecting a single document, invoice, or attachment." },
          { label: "dropzone variant", description: "Dedicated upload panels where multi-file drag-and-drop and list previews are needed." },
          { label: "button variant", description: "Compact settings rows or dialogs where a large drop target would crowd the form." },
          { label: "accept constraint", description: "Restricting file pickers to specific extensions such as images or PDF documents." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => <FileUploadDemo {...props} />}
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

      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={fileUploadPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Target clickable zones are focusable and can be activated using <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Space</kbd>.</li>
          <li><strong>Native Input:</strong> Employs a screen-reader accessible <code className="text-primary font-mono text-[10px]">&lt;input type="file"&gt;</code> element for mobile and assistive technology compatibility.</li>
        </ul>
      </div>
    </section>
  )
}
