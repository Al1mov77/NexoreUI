"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. ChatMessage — Chat bubble with avatar
// ============================================
export function ChatMessage({ message, sender, time, avatar, isOwn = false, className }: {
  message: string
  sender: string
  time?: string
  avatar?: string
  isOwn?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex gap-3", isOwn && "flex-row-reverse", className)}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
        isOwn ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-violet-500 to-pink-500"
      )}>
        {avatar || sender.charAt(0)}
      </div>
      <div className={cn("max-w-[70%]", isOwn && "items-end")}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 text-sm",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}>
          {message}
        </div>
        {time && <span className={cn("text-[10px] text-muted-foreground mt-1 block", isOwn && "text-right")}>{time}</span>}
      </div>
    </div>
  )
}

// ============================================
// 2. ChatInput — Message input with actions
// ============================================
export function ChatInput({ placeholder = "Type a message...", onSend, className }: {
  placeholder?: string
  onSend?: (message: string) => void
  className?: string
}) {
  const [text, setText] = React.useState("")

  const handleSend = () => {
    if (text.trim()) {
      onSend?.(text)
      setText("")
    }
  }

  return (
    <div className={cn("flex items-center gap-2 rounded-2xl border border-border bg-background p-2 pl-4", className)}>
      <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
      </button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
      />
      <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSend}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          text.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
      </motion.button>
    </div>
  )
}

// ============================================
// 3. UserProfileCard — Social profile card
// ============================================
export function UserProfileCard({ name, username, bio, stats, isFollowing = false, className }: {
  name: string
  username: string
  bio?: string
  stats?: { label: string; value: string }[]
  isFollowing?: boolean
  className?: string
}) {
  const [following, setFollowing] = React.useState(isFollowing)

  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden w-full max-w-xs", className)}>
      <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />
      <div className="px-5 pb-5">
        <div className="w-16 h-16 rounded-full border-4 border-card bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl -mt-8 mb-3 shadow-lg">
          {name.charAt(0)}
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFollowing(!following)}
            className={cn("px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
              following
                ? "bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {following ? "Following" : "Follow"}
          </motion.button>
        </div>
        {bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{bio}</p>}
        {stats && (
          <div className="flex gap-5 mt-4 pt-4 border-t border-border">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="font-bold text-sm">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 4. CommentThread — Nested comment thread
// ============================================
export function CommentThread({ comments, className }: {
  comments: { author: string; text: string; time: string; replies?: { author: string; text: string; time: string }[] }[]
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {comments.map((comment, i) => (
        <div key={i} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {comment.author.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.text}</p>
              <button className="text-xs text-primary hover:underline mt-1">Reply</button>
            </div>
          </div>
          {comment.replies?.map((reply, j) => (
            <div key={j} className="flex gap-3 ml-11">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {reply.author.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs">{reply.author}</span>
                  <span className="text-[10px] text-muted-foreground">{reply.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================
// 5. ReactionBar — Emoji reactions row
// ============================================
export function ReactionBar({ reactions, onReact, className }: {
  reactions: { emoji: string; count: number; active?: boolean }[]
  onReact?: (emoji: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {reactions.map((r, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReact?.(r.emoji)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm border transition-colors",
            r.active
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          <span>{r.emoji}</span>
          <span className="text-xs font-medium">{r.count}</span>
        </motion.button>
      ))}
      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm">
        +
      </button>
    </div>
  )
}

// ============================================
// 6. ActivityItem — Activity feed item
// ============================================
export function ActivityItem({ user, action, target, time, icon, className }: {
  user: string
  action: string
  target?: string
  time: string
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-3 py-3", className)}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {icon || user.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{user}</span>{" "}
          <span className="text-muted-foreground">{action}</span>{" "}
          {target && <span className="font-medium">{target}</span>}
        </p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  )
}

// ============================================
// 7. SocialPost — Social media post card
// ============================================
export function SocialPost({ author, handle, content, time, likes = 0, comments = 0, shares = 0, className }: {
  author: string
  handle: string
  content: string
  time: string
  likes?: number
  comments?: number
  shares?: number
  className?: string
}) {
  const [liked, setLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(likes)

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">@{handle} · {time}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-4">{content}</p>
      <div className="flex items-center gap-6 pt-3 border-t border-border">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
          className={cn("flex items-center gap-1.5 text-sm transition-colors", liked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}
        >
          <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {likeCount}
        </motion.button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          {comments}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {shares}
        </button>
      </div>
    </div>
  )
}

// ============================================
// 8. OnlineUsersList — Shows online users
// ============================================
export function OnlineUsersList({ users, className }: {
  users: { name: string; status?: "online" | "away" | "busy" | "offline" }[]
  className?: string
}) {
  const statusColors = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    busy: "bg-red-500",
    offline: "bg-muted-foreground/50",
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <h4 className="font-semibold text-sm mb-3">Online — {users.filter(u => u.status === "online").length}</h4>
      <div className="space-y-2">
        {users.map((user, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card", statusColors[user.status || "offline"])} />
            </div>
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 9. ShareSheet — Share options panel
// ============================================
export function ShareSheet({ url, title, className }: {
  url?: string
  title?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const shareLink = url || "https://nexoreui.dev"

  const platforms = [
    { name: "Twitter", color: "bg-sky-500", icon: "𝕏" },
    { name: "Facebook", color: "bg-blue-600", icon: "f" },
    { name: "LinkedIn", color: "bg-blue-700", icon: "in" },
    { name: "Email", color: "bg-emerald-500", icon: "✉" },
  ]

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {title && <h4 className="font-semibold text-sm mb-4">{title}</h4>}
      <div className="flex gap-3 mb-4">
        {platforms.map((p, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold", p.color)}
            title={p.name}
          >
            {p.icon}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground truncate font-mono">
          {shareLink}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>
    </div>
  )
}

// ============================================
// 10. NotificationCenter — Notification list
// ============================================
export function NotificationCenter({ notifications, className }: {
  notifications: { title: string; message: string; time: string; read?: boolean; type?: "info" | "success" | "warning" }[]
  className?: string
}) {
  const typeIcons = {
    info: "💬",
    success: "✅",
    warning: "⚠️",
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h4 className="font-semibold text-sm">Notifications</h4>
        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn("flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer", !n.read && "bg-primary/5")}
          >
            <span className="text-base shrink-0 mt-0.5">{typeIcons[n.type || "info"]}</span>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
            {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
