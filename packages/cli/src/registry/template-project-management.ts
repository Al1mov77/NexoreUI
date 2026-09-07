export const templateProjectManagement = {
  name: "template-project-management",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-project-management.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Plus, Kanban } from "lucide-react";

export default function ProjectManagementTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-6 font-sans">
      <h1 className="text-xl font-bold">Orbit Flow</h1>
    </div>
  );
}
`,
};
