const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

// Add ComponentSource definition before Home function
const componentSourceDef = `
function ComponentSource({ sourceCode }: { sourceCode: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="rounded-xl border border-border bg-muted/50 overflow-hidden relative group flex flex-col h-full min-h-[100px]">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background" 
        onClick={() => {
          navigator.clipboard.writeText(sourceCode)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="p-4 text-sm text-muted-foreground overflow-x-auto h-full m-0">
        <code className="font-mono">{sourceCode}</code>
      </pre>
    </div>
  )
}
`;

if (!code.includes('function ComponentSource')) {
  code = code.replace('export default function Home() {', componentSourceDef + '\nexport default function Home() {');
}

// Regex to find the div > pre > code pattern and replace with ComponentSource
const regex = /<div className="rounded-xl border border-border bg-muted\/50 overflow-hidden relative">\s*<pre className="p-4 text-sm text-muted-foreground overflow-x-auto h-full">\s*<code className="font-mono">{`([\s\S]*?)`}<\/code>\s*<\/pre>\s*<\/div>/g;

code = code.replace(regex, '<ComponentSource sourceCode={`$1`} />');

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Transformed page.tsx');
