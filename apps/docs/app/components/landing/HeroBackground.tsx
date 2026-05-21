"use client"

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient blob 1 — indigo/violet */}
      <div
        className="animate-mesh-1 absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, #6366f1 0%, #8b5cf6 100%)",
        }}
      />

      {/* Gradient blob 2 — violet/purple */}
      <div
        className="animate-mesh-2 absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full opacity-[0.05] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, #8b5cf6 0%, #a855f7 100%)",
        }}
      />

      {/* Gradient blob 3 — cyan/indigo */}
      <div
        className="animate-mesh-3 absolute -bottom-20 left-1/3 h-[450px] w-[450px] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, #06b6d4 0%, #6366f1 100%)",
        }}
      />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99, 102, 241, 0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  )
}
