const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

// 1. Add activeTab state
if (!code.includes('const [activeTab, setActiveTab]')) {
  code = code.replace(
    'const [currentPage, setCurrentPage] = React.useState(1)',
    'const [currentPage, setCurrentPage] = React.useState(1)\n  const [activeTab, setActiveTab] = React.useState("installation")'
  );
}

// 2. Modify sidebar links
const oldSidebarLink = /<a\s+key=\{comp\.id\}\s+href=\{`#\$\{comp\.id\}`\}\s+className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground hover:text-foreground"\s*>\s*\{comp\.name\}\s*<\/a>/g;

const newSidebarLink = `<button
                key={comp.id}
                onClick={() => setActiveTab(comp.id)}
                className={\`group flex w-full items-center rounded-md border px-2 py-1 text-left \${activeTab === comp.id ? "bg-muted font-medium text-foreground border-border" : "border-transparent text-muted-foreground hover:text-foreground hover:underline"}\`}
              >
                {comp.name}
              </button>`;

code = code.replace(oldSidebarLink, newSidebarLink);

// 3. Hide non-active sections. 
// For installation section:
code = code.replace(
  '<section id="installation" className="container mx-auto px-4 py-16 max-w-5xl scroll-mt-14">',
  '<section id="installation" className={`container mx-auto px-4 py-16 max-w-5xl scroll-mt-14 ${activeTab === "installation" ? "block" : "hidden"}`}>'
);

// For Hero Section (only show on installation tab)
code = code.replace(
  '<section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 border-b border-border relative overflow-hidden">',
  '<section className={`space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 border-b border-border relative overflow-hidden ${activeTab === "installation" ? "block" : "hidden"}`}>'
);

// Hide Component Showcase Title if on installation tab
code = code.replace(
  '<h2 className="text-3xl font-bold tracking-tight mb-2">Component Showcase</h2>',
  '{activeTab !== "installation" && <h2 className="text-3xl font-bold tracking-tight mb-2">{MvpComponents.find(c => c.id === activeTab)?.name}</h2>}'
);
code = code.replace(
  '<p className="text-muted-foreground">Explore the full set of NexoreUI components with live previews and copyable code.</p>',
  '{activeTab !== "installation" && <p className="text-muted-foreground">Live preview and copyable code for this component.</p>}'
);

// For all other sections: id="button", etc.
// They all have `className="scroll-mt-20"`
// Let's replace `id="X" className="scroll-mt-20"` with `id="X" className={cn("scroll-mt-20", activeTab === "X" ? "block" : "hidden")}`
const sectionRegex = /<div id="([a-zA-Z0-9-]+)" className="scroll-mt-20">/g;
code = code.replace(sectionRegex, (match, id) => {
  return `<div id="${id}" className={\`scroll-mt-20 \${activeTab === "${id}" ? "block" : "hidden"}\`}>`;
});

// Since we introduced activeTab, we need to make sure the "Component Showcase" wrapper container itself doesn't have huge padding when empty, but it's fine.

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Transformed page.tsx for multi-page feel');
