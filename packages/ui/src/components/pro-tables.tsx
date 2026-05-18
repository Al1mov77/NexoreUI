"use client"

import * as React from "react"
import { MoreHorizontal, ArrowUpDown, Download, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react"

// 1. DataTablePro
export const DataTablePro = () => {
  const [data, setData] = React.useState([
    { id: 1, name: "Alice Freeman", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", role: "Editor", status: "Inactive" },
    { id: 3, name: "Charlie Davis", role: "Viewer", status: "Active" },
    { id: 4, name: "Diana Prince", role: "Admin", status: "Active" },
    { id: 5, name: "Evan Wright", role: "User", status: "Inactive" },
    { id: 6, name: "Fiona Gallagher", role: "Viewer", status: "Active" }
  ])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editName, setEditName] = React.useState("")
  const itemsPerPage = 3

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id))
  }

  const handleEdit = (id: number, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const saveEdit = (id: number) => {
    setData(data.map(item => item.id === id ? { ...item, name: editName } : item))
    setEditingId(null)
  }

  const filteredData = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="w-full border rounded-xl bg-card overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <input 
          className="px-3 py-1.5 border rounded-md text-sm w-64 bg-background" 
          placeholder="Search by name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90">Export</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:text-foreground">Name <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.length > 0 ? paginatedData.map(item => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {editingId === item.id ? (
                    <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1 border rounded bg-background" />
                  ) : item.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  {editingId === item.id ? (
                    <button onClick={() => saveEdit(item.id)} className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">Save</button>
                  ) : (
                    <button onClick={() => handleEdit(item.id, item.name)} className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t text-sm text-muted-foreground flex justify-between items-center">
        <span>Showing {paginatedData.length} of {filteredData.length} entries</span>
        <div className="flex gap-1">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 font-medium">{page} / {Math.max(1, totalPages)}</span>
          <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

// 2. InvoiceTable
export const InvoiceTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="bg-muted/50 text-muted-foreground border-b">
        <tr><th className="px-6 py-4 font-semibold">Invoice ID</th><th className="px-6 py-4 font-semibold">Date</th><th className="px-6 py-4 font-semibold">Amount</th><th className="px-6 py-4 font-semibold text-right">Download</th></tr>
      </thead>
      <tbody className="divide-y">
        {['INV-001', 'INV-002'].map((inv, i) => (
          <tr key={i} className="hover:bg-muted/30">
            <td className="px-6 py-4 font-medium">{inv}</td><td className="px-6 py-4 text-muted-foreground">Oct 24, 2025</td><td className="px-6 py-4 font-bold">${(i+1)*150}.00</td>
            <td className="px-6 py-4 text-right"><button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"><Download className="w-4 h-4" /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 3. UserDirectoryTable
export const UserDirectoryTable = () => (
  <div className="w-full grid gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div><h4 className="font-bold">John Doe {i}</h4><p className="text-sm text-muted-foreground">Software Engineer</p></div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border rounded-md hover:bg-muted"><Edit2 className="w-4 h-4" /></button>
          <button className="p-2 border rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    ))}
  </div>
)

// 4. TransactionHistory
export const TransactionHistory = () => (
  <div className="w-full border rounded-xl bg-card">
    <div className="p-4 border-b font-bold text-lg">Recent Transactions</div>
    <div className="divide-y">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {i % 2 === 0 ? <ArrowUpDown className="w-5 h-5" /> : <ArrowUpDown className="w-5 h-5 rotate-180" />}
            </div>
            <div><p className="font-medium">{i % 2 === 0 ? 'Payment Received' : 'Subscription Auto-renew'}</p><p className="text-xs text-muted-foreground">Today, 10:23 AM</p></div>
          </div>
          <div className={`font-bold ${i % 2 === 0 ? 'text-green-500' : 'text-foreground'}`}>{i % 2 === 0 ? '+' : '-'}${i * 45}.00</div>
        </div>
      ))}
    </div>
  </div>
)

// 5. FileExplorerTable (Mock)
export const FileExplorerTable = () => (
  <div className="w-full border rounded-xl bg-card text-sm">
    <div className="grid grid-cols-12 px-4 py-3 bg-muted/50 border-b font-medium text-muted-foreground"><div className="col-span-6">Name</div><div className="col-span-3">Date Modified</div><div className="col-span-3">Size</div></div>
    <div className="divide-y">
      <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer"><div className="col-span-6 flex items-center gap-2 font-medium">📁 Documents</div><div className="col-span-3 text-muted-foreground">Oct 12</div><div className="col-span-3 text-muted-foreground">--</div></div>
      <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer"><div className="col-span-6 flex items-center gap-2 font-medium">📄 report.pdf</div><div className="col-span-3 text-muted-foreground">Oct 10</div><div className="col-span-3 text-muted-foreground">2.4 MB</div></div>
    </div>
  </div>
)

// 6. LeaderboardTable
export const LeaderboardTable = () => (
  <div className="w-full border rounded-2xl bg-gradient-to-b from-card to-muted/20 overflow-hidden shadow-lg">
    <div className="p-6 text-center border-b"><h3 className="font-bold text-xl uppercase tracking-widest text-yellow-500">Global Ranking</h3></div>
    <div className="divide-y">
      {[1, 2, 3].map(i => (
        <div key={i} className={`flex items-center px-6 py-4 ${i === 1 ? 'bg-yellow-500/10' : ''}`}>
          <div className={`font-black text-2xl w-8 ${i===1?'text-yellow-500': i===2?'text-gray-400': 'text-amber-700'}`}>#{i}</div>
          <div className="w-10 h-10 rounded-full bg-muted mx-4" />
          <div className="flex-1 font-bold text-lg">Player {i}</div>
          <div className="font-mono font-bold text-primary">{10000 - i*500} pts</div>
        </div>
      ))}
    </div>
  </div>
)

// 7. ProductInventoryTable
export const ProductInventoryTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-muted/50 border-b text-left text-muted-foreground">
        <tr><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">SKU</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Price</th></tr>
      </thead>
      <tbody className="divide-y">
        {[1, 2].map(i => (
          <tr key={i}>
            <td className="px-4 py-3 flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded" /><span className="font-medium">Item {i}</span></td>
            <td className="px-4 py-3 text-muted-foreground">SKU-{i}000</td>
            <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${i===1?'bg-green-500':'bg-red-500'}`}/> {i===1?'145 in stock':'Out of stock'}</div></td>
            <td className="px-4 py-3 font-medium">$49.99</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 8. ScheduleTable
export const ScheduleTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <div className="grid grid-cols-6 divide-x border-b bg-muted/50 text-center text-xs font-semibold py-2">
      <div>Time</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
    </div>
    <div className="grid grid-cols-6 divide-x border-b text-center text-sm h-16">
      <div className="flex items-center justify-center font-medium text-muted-foreground border-r">09:00</div>
      <div className="col-span-2 bg-primary/10 text-primary p-2 m-1 rounded border border-primary/20 text-xs text-left font-medium">Team Meeting</div>
      <div className="col-span-1"></div>
      <div className="col-span-1 bg-indigo-500/10 text-indigo-500 p-2 m-1 rounded border border-indigo-500/20 text-xs text-left font-medium">Design Sync</div>
      <div className="col-span-1"></div>
    </div>
  </div>
)

// 9. PricingComparisonTable
export const PricingComparisonTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <table className="w-full text-sm text-center">
      <thead className="bg-muted/30 border-b">
        <tr><th className="p-4 text-left">Features</th><th className="p-4 font-bold text-lg">Basic</th><th className="p-4 font-bold text-lg text-primary">Pro</th></tr>
      </thead>
      <tbody className="divide-y">
        {['Unlimited Projects', 'Custom Domain', '24/7 Support'].map((f, i) => (
          <tr key={i} className="hover:bg-muted/10">
            <td className="p-4 text-left font-medium">{f}</td>
            <td className="p-4">{i < 1 ? <CheckCircle2 className="w-5 h-5 mx-auto text-green-500" /> : <XCircle className="w-5 h-5 mx-auto text-muted-foreground/30" />}</td>
            <td className="p-4"><CheckCircle2 className="w-5 h-5 mx-auto text-primary" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 10. CompactDataList
export const CompactDataList = () => (
  <div className="w-full border rounded-lg bg-card divide-y text-sm">
    {['Server CPU Usage', 'Active Connections', 'Memory Load'].map((l, i) => (
      <div key={i} className="flex justify-between items-center p-3 hover:bg-muted/50 cursor-pointer">
        <span className="text-muted-foreground font-medium">{l}</span>
        <span className="font-bold">{90 - i*15}%</span>
      </div>
    ))}
  </div>
)
