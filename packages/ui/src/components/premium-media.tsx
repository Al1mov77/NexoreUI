"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. ImageCarousel — Auto-playing carousel
// ============================================
export function ImageCarousel({ images, autoPlay = true, interval = 4000, className }: {
  images: { src: string; alt?: string }[]
  autoPlay?: boolean
  interval?: number
  className?: string
}) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
      <div className="relative aspect-video">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-muted-foreground">
              {img.alt || `Slide ${i + 1}`}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/70")}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// 2. VideoPlayer — Styled video player
// ============================================
export function VideoPlayer({ title, duration = "3:45", thumbnail, className }: {
  title?: string
  duration?: string
  thumbnail?: string
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted group cursor-pointer", className)}>
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlaying(!playing)}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg"
        >
          {playing ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </motion.button>
      </div>
      {(title || duration) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {title && <p className="text-white text-sm font-medium">{title}</p>}
          {duration && <span className="text-white/70 text-xs">{duration}</span>}
        </div>
      )}
    </div>
  )
}

// ============================================
// 3. AudioWaveform — Audio visualizer
// ============================================
export function AudioWaveform({ playing = false, bars = 24, className }: {
  playing?: boolean
  bars?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-end gap-[2px] h-8", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const height = Math.random() * 100
        return (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-primary"
            animate={playing ? {
              height: [`${20 + Math.random() * 30}%`, `${50 + Math.random() * 50}%`, `${20 + Math.random() * 30}%`],
            } : { height: "20%" }}
            transition={playing ? {
              duration: 0.4 + Math.random() * 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            } : {}}
            style={{ height: `${height}%` }}
          />
        )
      })}
    </div>
  )
}

// ============================================
// 4. FilePreviewCard — File with icon/preview
// ============================================
export function FilePreviewCard({ name, size, type = "file", className }: {
  name: string
  size: string
  type?: "file" | "image" | "video" | "pdf" | "code"
  className?: string
}) {
  const icons = {
    file: "📄",
    image: "🖼",
    video: "🎬",
    pdf: "📕",
    code: "💻",
  }
  const colors = {
    file: "from-blue-500/10 to-blue-500/5",
    image: "from-pink-500/10 to-pink-500/5",
    video: "from-violet-500/10 to-violet-500/5",
    pdf: "from-red-500/10 to-red-500/5",
    code: "from-emerald-500/10 to-emerald-500/5",
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("rounded-xl border border-border bg-card p-4 flex items-center gap-3 cursor-pointer transition-shadow hover:shadow-md", className)}
    >
      <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl", colors[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{size}</p>
      </div>
      <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </motion.div>
  )
}

// ============================================
// 5. EmbedCard — oEmbed-style preview card
// ============================================
export function EmbedCard({ title, description, domain, favicon, className }: {
  title: string
  description?: string
  domain: string
  favicon?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer", className)}>
      <div className="h-36 bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-pink-500/20" />
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px]">
            {favicon || domain.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground">{domain}</span>
        </div>
        <h4 className="text-sm font-semibold mb-1 line-clamp-1">{title}</h4>
        {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      </div>
    </div>
  )
}

// ============================================
// 6. MusicPlayer — Mini music player widget
// ============================================
export function MusicPlayer({ title, artist, album, className }: {
  title: string
  artist: string
  album?: string
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(35)

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 w-full max-w-sm", className)}>
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={playing ? { rotate: 360 } : {}}
          transition={playing ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0"
        >
          <div className="w-5 h-5 rounded-full bg-background" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
          {album && <p className="text-xs text-muted-foreground/60 truncate">{album}</p>}
        </div>
      </div>
      <div className="mb-3">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>1:15</span>
          <span>3:45</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/></svg>
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPlaying(!playing)}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </motion.button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 18h-2V6h2v12zm-3.5-6L6 6v12l8.5-6z"/></svg>
        </button>
      </div>
    </div>
  )
}

// ============================================
// 7. ImageCompare — Before/After slider
// ============================================
export function ImageCompare({ leftLabel = "Before", rightLabel = "After", className }: {
  leftLabel?: string
  rightLabel?: string
  className?: string
}) {
  const [position, setPosition] = React.useState(50)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-video rounded-xl overflow-hidden cursor-col-resize select-none", className)}
      onMouseMove={handleMove}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} />
      <div className="absolute top-0 bottom-0" style={{ left: `${position}%` }}>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg -translate-x-1/2" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>
      </div>
      <span className="absolute top-3 left-3 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{leftLabel}</span>
      <span className="absolute top-3 right-3 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{rightLabel}</span>
    </div>
  )
}

// ============================================
// 8. GalleryGrid — Masonry-style gallery
// ============================================
export function GalleryGrid({ items, className }: {
  items: { title: string; color?: string }[]
  className?: string
}) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ]

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={cn(
            "rounded-xl bg-gradient-to-br p-4 flex items-end cursor-pointer transition-shadow hover:shadow-lg",
            item.color || colors[i % colors.length],
            i === 0 ? "row-span-2 min-h-[200px]" : "min-h-[100px]"
          )}
        >
          <span className="text-white text-sm font-medium drop-shadow-md">{item.title}</span>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// 9. CodeSnippet — Syntax-highlighted block
// ============================================
export function CodeSnippet({ code, language = "tsx", filename, className }: {
  code: string
  language?: string
  filename?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <div className={cn("rounded-xl border border-border bg-slate-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && <span className="text-xs text-slate-400 ml-2 font-mono">{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">{language}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="font-mono text-slate-200">{code}</code>
      </pre>
    </div>
  )
}

// ============================================
// 10. TestimonialCarousel — Animated testimonials
// ============================================
export function TestimonialCarousel({ testimonials, className }: {
  testimonials: { quote: string; author: string; role: string }[]
  className?: string
}) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const t = testimonials[current]

  return (
    <div className={cn("relative text-center py-8", className)}>
      <svg className="w-10 h-10 text-primary/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32">
        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg leading-relaxed mb-4 max-w-lg mx-auto">{t.quote}</p>
          <p className="font-semibold text-sm">{t.author}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")}
          />
        ))}
      </div>
    </div>
  )
}
