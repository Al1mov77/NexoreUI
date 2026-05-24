export default function Loading() {
  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
      <div className="h-4 w-96 bg-zinc-800 rounded animate-pulse" />
      <div className="h-64 bg-zinc-800 rounded-xl animate-pulse" />
      <div className="h-32 bg-zinc-800 rounded-xl animate-pulse" />
    </div>
  )
}
