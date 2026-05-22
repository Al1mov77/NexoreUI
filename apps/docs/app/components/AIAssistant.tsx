"use client"

import React, { useState, useEffect, useRef } from "react"
import { Sparkles, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AIAssistantProps {
  currentCode: string
  onCodeChange: (newCode: string) => void
  onReset: () => void
  isModified: boolean
  onPopupOpenChange?: (isOpen: boolean) => void
}

interface RateLimitInfo {
  count: number
  resetTime: number
}

export function AIAssistant({
  currentCode,
  onCodeChange,
  onReset,
  isModified,
  onPopupOpenChange,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null)
  const [minutesToReset, setMinutesToReset] = useState<number | null>(null)

  const popupRef = useRef<HTMLDivElement>(null)

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Notify parent component about open state to adjust overflow-visible/hidden
  useEffect(() => {
    if (onPopupOpenChange) {
      onPopupOpenChange(isOpen)
    }
  }, [isOpen, onPopupOpenChange])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Fetch current rate limit when popup opens
  const fetchRateLimit = async () => {
    try {
      const res = await fetch("/api/ai-assist")
      if (res.ok) {
        const data = await res.json()
        setRateLimit(data)
      }
    } catch (e) {
      console.error("Failed to fetch rate limit stats", e)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchRateLimit()
    }
  }, [isOpen])

  // Calculate minutes to reset dynamically
  useEffect(() => {
    const updateMinutes = () => {
      if (!rateLimit || !rateLimit.resetTime) return
      const diff = rateLimit.resetTime - Date.now()
      setMinutesToReset(Math.max(1, Math.ceil(diff / (60 * 1000))))
    }

    if (isOpen && rateLimit) {
      updateMinutes()
      const interval = setInterval(updateMinutes, 10000)
      return () => clearInterval(interval)
    }
  }, [isOpen, rateLimit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: currentCode,
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Произошла ошибка при генерации.")
      }

      onCodeChange(data.result)
      setRateLimit({ count: data.count, resetTime: data.resetTime })
      setMessage("")
      setIsOpen(false) // Close popup on success
    } catch (err: any) {
      setError(err.message)
      // If error is rate limit related, fetch limit details again
      fetchRateLimit()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block" ref={popupRef}>
      <div className="flex items-center gap-1">
        {isModified && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReset()
            }}
            className="flex items-center px-2 py-1 text-[11px] text-zinc-500 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer font-medium"
            title="Reset code to original"
          >
            Reset
          </button>
        )}
        <button
          onClick={togglePopup}
          className={`flex items-center gap-1.5 px-2 py-1 text-[11px] rounded transition-all cursor-pointer font-medium ${
            isOpen 
              ? "text-violet-400 bg-violet-500/15" 
              : "text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10"
          }`}
        >
          <Sparkles className={`h-3 w-3 ${isLoading ? "animate-pulse" : ""}`} />
          <span>AI</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 z-50 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-4 text-white text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 rounded p-0.5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="text-[11px] text-zinc-400 mb-3 space-y-1">
              <p>Текущий код показан выше.</p>
              <p className="font-semibold text-zinc-300">Что изменить?</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                  placeholder="Измени цвет кнопки на красный"
                  disabled={isLoading}
                  rows={3}
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
                <div className="absolute bottom-2 right-2 text-[9px] text-zinc-600 font-mono">
                  {message.length}/200
                </div>
              </div>

              {error && (
                <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-2">
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                {/* Rate limit info */}
                <div className="flex flex-col text-[10px] text-zinc-500 leading-normal">
                  {rateLimit ? (
                    <>
                      <span>{rateLimit.count} из 20 запросов использовано</span>
                      {rateLimit.count > 0 && minutesToReset !== null && (
                        <span>Сброс через {minutesToReset} мин</span>
                      )}
                    </>
                  ) : (
                    <span>Загрузка лимитов...</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg transition-colors font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Думает...</span>
                    </>
                  ) : (
                    <span>Изменить</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
