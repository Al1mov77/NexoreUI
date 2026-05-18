'use client';

import Link from 'next/link';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-gradient font-extrabold text-2xl">N</span>
            <span className="text-lg font-bold">NexoreUI</span>
          </Link>
        </div>
        
        <nav className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Getting Started</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/docs/introduction" className="hover:text-white transition">Introduction</Link></li>
              <li><Link href="/docs/installation" className="hover:text-white transition">Installation</Link></li>
              <li><Link href="/docs/theming" className="hover:text-white transition">Theming</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Components</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/docs/components/button" className="text-indigo-400 font-medium">Button</Link></li>
              <li><Link href="/docs/components/card" className="hover:text-white transition">Card</Link></li>
              <li><Link href="/docs/components/input" className="hover:text-white transition">Input</Link></li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Docs &gt; Components &gt; Button</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="glass-effect px-4 py-2 rounded-lg text-sm text-gray-400">Search...</button>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
