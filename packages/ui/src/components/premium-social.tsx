"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Bell,
  Copy,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  Rocket,
  Flame,
  Bookmark,
  Star,
  Zap,
  Award,
  BadgeCheck,
  X,
  CornerDownRight,
} from "lucide-react"
import { cn } from "../utils/cn"

export interface ChatMessageContextValue {
  variant: "sent" | "received"
  isOwn: boolean
}

const ChatMessageContext = React.createContext<ChatMessageContextValue>({
  variant: "received",
  isOwn: false,
})

export interface ChatReplyReference {
  sender: string
  excerpt: string
}

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
  isOwn?: boolean
  message?: string
  sender?: string
  time?: string
  avatar?: string
  replyTo?: ChatReplyReference
  children?: React.ReactNode
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      variant,
      isOwn,
      message,
      sender,
      time,
      avatar,
      replyTo,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant: "sent" | "received" =
      variant || (isOwn ? "sent" : "received")
    const resolvedIsOwn = resolvedVariant === "sent"

    const contextValue = React.useMemo(
      () => ({ variant: resolvedVariant, isOwn: resolvedIsOwn }),
      [resolvedVariant, resolvedIsOwn]
    )

    if (children) {
      return (
        <ChatMessageContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(
              "flex gap-3 group/msg",
              resolvedIsOwn ? "flex-row-reverse justify-start" : "flex-row justify-start",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </ChatMessageContext.Provider>
      )
    }

    return (
      <ChatMessageContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex gap-3 group/msg",
            resolvedIsOwn ? "flex-row-reverse justify-start" : "flex-row justify-start",
            className
          )}
          {...props}
        >
          <ChatMessageAvatar fallback={avatar || sender?.charAt(0) || "U"} />
          <ChatMessageBody>
            {(sender || time) && (
              <ChatMessageHeader>
                {sender && <ChatMessageSender>{sender}</ChatMessageSender>}
                {time && <ChatMessageTime>{time}</ChatMessageTime>}
              </ChatMessageHeader>
            )}
            {replyTo && (
              <div
                className={cn(
                  "mb-1.5 flex items-start gap-1.5 rounded-lg border-l-2 border-border bg-muted/40 px-2.5 py-1.5 text-[11px] text-muted-foreground max-w-full",
                  resolvedIsOwn && "text-right"
                )}
              >
                <CornerDownRight className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                <div className="min-w-0 truncate">
                  <span className="font-semibold text-foreground">{replyTo.sender}:</span>{" "}
                  <span>{replyTo.excerpt}</span>
                </div>
              </div>
            )}
            {message && <ChatMessageContent>{message}</ChatMessageContent>}
          </ChatMessageBody>
        </div>
      </ChatMessageContext.Provider>
    )
  }
)
ChatMessage.displayName = "ChatMessage"

export interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback?: string
  isOnline?: boolean
}

export const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(
  ({ src, fallback, isOnline, className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext)
    const [imgError, setImgError] = React.useState(false)

    React.useEffect(() => {
      setImgError(false)
    }, [src])

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold shrink-0 select-none",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground border border-border",
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt="Sender avatar"
            onError={() => setImgError(true)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : children ? (
          children
        ) : (
          <span>{fallback || (isOwn ? "Y" : "U")}</span>
        )}

        {isOnline && (
          <span
            aria-label="Online"
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background"
          />
        )}
      </div>
    )
  }
)
ChatMessageAvatar.displayName = "ChatMessageAvatar"

export const ChatMessageBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOwn } = React.useContext(ChatMessageContext)
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col max-w-[82%] sm:max-w-[74%] min-w-0",
        isOwn ? "items-end" : "items-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ChatMessageBody.displayName = "ChatMessageBody"

export const ChatMessageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOwn } = React.useContext(ChatMessageContext)
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 mb-1 px-0.5",
        isOwn ? "flex-row-reverse text-right" : "flex-row text-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ChatMessageHeader.displayName = "ChatMessageHeader"

export const ChatMessageSender = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs font-semibold text-foreground tracking-tight", className)}
    {...props}
  >
    {children}
  </span>
))
ChatMessageSender.displayName = "ChatMessageSender"

export const ChatMessageTime = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-[11px] font-mono text-muted-foreground tabular-nums", className)}
    {...props}
  >
    {children}
  </span>
))
ChatMessageTime.displayName = "ChatMessageTime"

export interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
}

export const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  ({ variant: propVariant, className, children, ...props }, ref) => {
    const context = React.useContext(ChatMessageContext)
    const isOwn = propVariant ? propVariant === "sent" : context.isOwn

    return (
      <div
        ref={ref}
        className={cn(
          "px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed tracking-normal shadow-2xs transition-colors",
          isOwn
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs"
            : "bg-muted/60 text-foreground border border-border rounded-2xl rounded-tl-xs",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChatMessageContent.displayName = "ChatMessageContent"

export interface ChatMessageStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "sent" | "delivered" | "read"
}

export const ChatMessageStatus = React.forwardRef<HTMLSpanElement, ChatMessageStatusProps>(
  ({ status = "read", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground mt-1 px-0.5 tabular-nums",
        className
      )}
      {...props}
    >
      {status === "sent" && <Check className="w-3 h-3 text-muted-foreground" />}
      {status === "delivered" && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
      {status === "read" && <CheckCheck className="w-3 h-3 text-success" />}
      <span className="capitalize">{status}</span>
    </span>
  )
)
ChatMessageStatus.displayName = "ChatMessageStatus"

export interface ChatTypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  names?: string[]
}

export const ChatTypingIndicator = React.forwardRef<HTMLDivElement, ChatTypingIndicatorProps>(
  ({ names, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()

    const label = React.useMemo(() => {
      if (!names || names.length === 0) return "Typing"
      if (names.length === 1) return `${names[0]} is typing`
      if (names.length === 2) return `${names[0]} and ${names[1]} are typing`
      return `${names.length} members are typing`
    }, [names])

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground w-fit",
          className
        )}
        {...props}
      >
        <div className="inline-flex items-center gap-0.5 h-3" aria-hidden="true">
          {[0, 0.14, 0.28].map((delay, idx) => (
            <motion.span
              key={idx}
              animate={shouldReduceMotion ? {} : { scaleY: [0.45, 1, 0.45] }}
              transition={{ repeat: Infinity, duration: 0.9, delay, ease: "easeInOut" }}
              className="w-0.5 h-3 rounded-full bg-foreground/70 origin-center"
            />
          ))}
        </div>
        <span className="font-mono">{label}</span>
      </div>
    )
  }
)
ChatTypingIndicator.displayName = "ChatTypingIndicator"

export const ChatMessageCompound = Object.assign(ChatMessage, {
  Avatar: ChatMessageAvatar,
  Body: ChatMessageBody,
  Header: ChatMessageHeader,
  Sender: ChatMessageSender,
  Time: ChatMessageTime,
  Content: ChatMessageContent,
  Status: ChatMessageStatus,
  TypingIndicator: ChatTypingIndicator,
})

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  onSend?: (message: string) => void
  onAttach?: () => void
  quickReplies?: string[]
  replyingTo?: ChatReplyReference
  onCancelReply?: () => void
  maxLength?: number
  children?: React.ReactNode
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      placeholder = "Type a message...",
      onSend,
      onAttach,
      quickReplies,
      replyingTo,
      onCancelReply,
      maxLength,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [text, setText] = React.useState("")

    const handleSend = () => {
      const trimmed = text.trim()
      if (trimmed) {
        onSend?.(trimmed)
        setText("")
      }
    }

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pl-3 shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-shadow",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
        {quickReplies && quickReplies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => onSend?.(reply)}
                className="rounded-full border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {replyingTo && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Replying to <span className="font-semibold text-foreground">{replyingTo.sender}</span>: {replyingTo.excerpt}
              </span>
            </div>
            {onCancelReply && (
              <button
                type="button"
                onClick={onCancelReply}
                aria-label="Cancel reply"
                className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pl-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-shadow">
          <ChatInputAction
            icon={<Paperclip className="w-4 h-4" />}
            aria-label="Attach file"
            title="Attach file"
            onClick={onAttach}
          />
          <ChatInputField
            value={text}
            maxLength={maxLength}
            aria-label={placeholder}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={placeholder}
          />
          {maxLength !== undefined && (
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0 px-1">
              {text.length}/{maxLength}
            </span>
          )}
          <ChatInputSubmit onClick={handleSend} disabled={!text.trim()} />
        </div>
      </div>
    )
  }
)
ChatInput.displayName = "ChatInput"

export const ChatInputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground min-w-0",
      className
    )}
    {...props}
  />
))
ChatInputField.displayName = "ChatInputField"

export const ChatInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1 shrink-0", className)} {...props}>
    {children}
  </div>
))
ChatInputActions.displayName = "ChatInputActions"

export interface ChatInputActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

export const ChatInputAction = React.forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ icon, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  )
)
ChatInputAction.displayName = "ChatInputAction"

export interface ChatInputSubmitProps extends Omit<HTMLMotionProps<"button">, "children"> {
  disabled?: boolean
  children?: React.ReactNode
}

export const ChatInputSubmit = React.forwardRef<HTMLButtonElement, ChatInputSubmitProps>(
  ({ disabled = false, className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label="Send message"
        whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.94 }}
        disabled={disabled}
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled
            ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        {...props}
      >
        {children || <Send className="w-3.5 h-3.5" />}
      </motion.button>
    )
  }
)
ChatInputSubmit.displayName = "ChatInputSubmit"

export const ChatInputCompound = Object.assign(ChatInput, {
  Field: ChatInputField,
  Actions: ChatInputActions,
  Action: ChatInputAction,
  Submit: ChatInputSubmit,
})

export interface UserProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  username?: string
  bio?: string
  stats?: { label: string; value: string }[]
  isFollowing?: boolean
  avatar?: string
  coverGradient?: string
  children?: React.ReactNode
}

export const UserProfileCard = React.forwardRef<HTMLDivElement, UserProfileCardProps>(
  (
    {
      name = "Hannah Reid",
      username = "@hannahreid",
      bio,
      stats,
      isFollowing = false,
      avatar,
      coverGradient,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [following, setFollowing] = React.useState(isFollowing)

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border border-border bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-sm",
          className
        )}
        {...props}
      >
        <UserProfileCover gradient={coverGradient} />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-9 mb-3">
            <UserProfileAvatar fallback={avatar || name.charAt(0)} />
            <UserProfileFollowButton
              following={following}
              onClick={() => setFollowing((prev) => !prev)}
            />
          </div>

          <UserProfileInfo>
            <UserProfileName>{name}</UserProfileName>
            <UserProfileHandle>{username}</UserProfileHandle>
          </UserProfileInfo>

          {bio && <UserProfileBio>{bio}</UserProfileBio>}

          {stats && stats.length > 0 && (
            <UserProfileStats>
              {stats.map((s) => (
                <UserProfileStat key={s.label} label={s.label} value={s.value} />
              ))}
            </UserProfileStats>
          )}
        </div>
      </div>
    )
  }
)
UserProfileCard.displayName = "UserProfileCard"

export interface UserProfileCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string
  imageSrc?: string
}

export const UserProfileCover = React.forwardRef<HTMLDivElement, UserProfileCoverProps>(
  ({ gradient, imageSrc, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "h-28 w-full relative overflow-hidden border-b border-border/60",
        gradient || "bg-muted/40",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-card/75 via-transparent to-transparent pointer-events-none" />
      {imageSrc && <img src={imageSrc} alt="Profile cover" className="w-full h-full object-cover" />}
      {children}
    </div>
  )
)
UserProfileCover.displayName = "UserProfileCover"

export interface UserProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback?: string
  status?: "online" | "busy" | "offline"
}

export const UserProfileAvatar = React.forwardRef<HTMLDivElement, UserProfileAvatarProps>(
  ({ src, fallback, status = "online", className, children, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    React.useEffect(() => {
      setImgError(false)
    }, [src])

    return (
      <div className="relative shrink-0">
        <div
          ref={ref}
          className={cn(
            "w-18 h-18 rounded-full border-4 border-card ring-1 ring-border bg-primary flex items-center justify-center text-primary-foreground font-mono font-bold text-xl overflow-hidden select-none",
            className
          )}
          {...props}
        >
          {src && !imgError ? (
            <img
              src={src}
              alt="Profile avatar"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : children ? (
            children
          ) : (
            <span>{fallback || "U"}</span>
          )}
        </div>

        {status && (
          <span
            role="img"
            aria-label={`Status: ${status}`}
            title={`Status: ${status}`}
            className={cn(
              "absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-card",
              status === "online" && "bg-success",
              status === "busy" && "bg-destructive",
              status === "offline" && "bg-muted-foreground/50"
            )}
          />
        )}
      </div>
    )
  }
)
UserProfileAvatar.displayName = "UserProfileAvatar"

export const UserProfileInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-0.5", className)} {...props}>
    {children}
  </div>
))
UserProfileInfo.displayName = "UserProfileInfo"

export interface UserProfileNameProps extends React.HTMLAttributes<HTMLHeadingElement> {
  verified?: boolean
}

export const UserProfileName = React.forwardRef<HTMLHeadingElement, UserProfileNameProps>(
  ({ verified = true, className, children, ...props }, ref) => (
    <div className="flex items-center gap-1.5">
      <h4
        ref={ref}
        className={cn("font-semibold text-base text-foreground tracking-tight", className)}
        {...props}
      >
        {children}
      </h4>
      {verified && <BadgeCheck className="w-4 h-4 text-info shrink-0" aria-label="Verified" />}
    </div>
  )
)
UserProfileName.displayName = "UserProfileName"

export const UserProfileHandle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs font-mono text-muted-foreground", className)} {...props}>
    {children}
  </p>
))
UserProfileHandle.displayName = "UserProfileHandle"

export const UserProfileBio = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2.5", className)}
    {...props}
  >
    {children}
  </p>
))
UserProfileBio.displayName = "UserProfileBio"

export const UserProfileStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-6 mt-4 pt-3.5 border-t border-border", className)}
    {...props}
  >
    {children}
  </div>
))
UserProfileStats.displayName = "UserProfileStats"

export interface UserProfileStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
}

export const UserProfileStat = React.forwardRef<HTMLDivElement, UserProfileStatProps>(
  ({ label, value, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-0.5", className)} {...props}>
      <p className="font-mono font-semibold text-sm text-foreground tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
)
UserProfileStat.displayName = "UserProfileStat"

export interface UserProfileFollowButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  following?: boolean
  children?: React.ReactNode
}

export const UserProfileFollowButton = React.forwardRef<
  HTMLButtonElement,
  UserProfileFollowButtonProps
>(({ following = false, className, children, ...props }, ref) => {
  const shouldReduceMotion = useReducedMotion()
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        following
          ? hovered
            ? "border border-destructive/40 bg-destructive/10 text-destructive"
            : "border border-border bg-muted text-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    >
      {children || (following ? (hovered ? "Unfollow" : "Following") : "Follow")}
    </motion.button>
  )
})
UserProfileFollowButton.displayName = "UserProfileFollowButton"

export const UserProfileCardCompound = Object.assign(UserProfileCard, {
  Cover: UserProfileCover,
  Avatar: UserProfileAvatar,
  Info: UserProfileInfo,
  Name: UserProfileName,
  Handle: UserProfileHandle,
  Bio: UserProfileBio,
  Stats: UserProfileStats,
  Stat: UserProfileStat,
  FollowButton: UserProfileFollowButton,
})

export interface CommentData {
  author: string
  text: string
  time: string
  avatar?: string
  replies?: { author: string; text: string; time: string; avatar?: string }[]
}

export interface CommentThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  comments?: CommentData[]
  onReply?: (commentIndex: number, text: string) => void
  children?: React.ReactNode
}

export const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
  ({ comments, onReply, className, children, ...props }, ref) => {
    const [threadData, setThreadData] = React.useState<CommentData[]>(comments || [])
    const [replyingIndex, setReplyingIndex] = React.useState<number | null>(null)
    const [replyDraft, setReplyDraft] = React.useState("")

    React.useEffect(() => {
      if (comments) setThreadData(comments)
    }, [comments])

    if (children) {
      return (
        <div ref={ref} className={cn("space-y-4 w-full", className)} {...props}>
          {children}
        </div>
      )
    }

    const submitReply = (idx: number) => {
      const trimmed = replyDraft.trim()
      if (!trimmed) return
      setThreadData((prev) =>
        prev.map((item, cIdx) =>
          cIdx === idx
            ? {
                ...item,
                replies: [
                  ...(item.replies || []),
                  { author: "You", text: trimmed, time: "Just now" },
                ],
              }
            : item
        )
      )
      onReply?.(idx, trimmed)
      setReplyDraft("")
      setReplyingIndex(null)
    }

    return (
      <div ref={ref} className={cn("space-y-4 w-full", className)} {...props}>
        {threadData.map((comment, i) => (
          <div key={`${comment.author}-${i}`} className="space-y-3">
            <CommentItem>
              <CommentAvatar fallback={comment.author.charAt(0)} />
              <CommentBody>
                <CommentHeader>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentTime>{comment.time}</CommentTime>
                </CommentHeader>
                <CommentText>{comment.text}</CommentText>
                <CommentActions>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingIndex(replyingIndex === i ? null : i)
                      setReplyDraft("")
                    }}
                    className="hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {replyingIndex === i ? "Cancel" : "Reply"}
                  </button>
                </CommentActions>
              </CommentBody>
            </CommentItem>

            {comment.replies?.map((reply, j) => (
              <CommentReply key={`${reply.author}-${j}`}>
                <CommentAvatar fallback={reply.author.charAt(0)} size="sm" />
                <CommentBody>
                  <CommentHeader>
                    <CommentAuthor>{reply.author}</CommentAuthor>
                    <CommentTime>{reply.time}</CommentTime>
                  </CommentHeader>
                  <CommentText>{reply.text}</CommentText>
                </CommentBody>
              </CommentReply>
            ))}

            {replyingIndex === i && (
              <div className="ml-11 pl-3 border-l border-border flex items-center gap-2">
                <input
                  type="text"
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      submitReply(i)
                    }
                  }}
                  placeholder={`Reply to ${comment.author}...`}
                  aria-label={`Reply to ${comment.author}`}
                  className="flex-1 h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-0"
                />
                <button
                  type="button"
                  onClick={() => submitReply(i)}
                  disabled={!replyDraft.trim()}
                  className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-45 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
)
CommentThread.displayName = "CommentThread"

export const CommentItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex gap-3 items-start", className)} {...props}>
    {children}
  </div>
))
CommentItem.displayName = "CommentItem"

export interface CommentAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback?: string
  size?: "sm" | "md"
}

export const CommentAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, size = "md", className, children, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full flex items-center justify-center font-mono font-semibold text-foreground shrink-0 bg-muted border border-border select-none overflow-hidden",
          size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs",
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt="Commenter avatar"
            onError={() => setImgError(true)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : children ? (
          children
        ) : (
          <span>{fallback || "U"}</span>
        )}
      </div>
    )
  }
)
CommentAvatar.displayName = "CommentAvatar"

export const CommentBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 min-w-0 space-y-1", className)} {...props}>
    {children}
  </div>
))
CommentBody.displayName = "CommentBody"

export const CommentHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2 mb-0.5", className)} {...props}>
    {children}
  </div>
))
CommentHeader.displayName = "CommentHeader"

export const CommentAuthor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn("font-semibold text-xs text-foreground", className)} {...props}>
    {children}
  </span>
))
CommentAuthor.displayName = "CommentAuthor"

export const CommentTime = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-[11px] font-mono text-muted-foreground tabular-nums", className)}
    {...props}
  >
    {children}
  </span>
))
CommentTime.displayName = "CommentTime"

export const CommentText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-foreground/85 leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
))
CommentText.displayName = "CommentText"

export const CommentActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 pt-1 text-[11px] text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
))
CommentActions.displayName = "CommentActions"

export const CommentReply = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-3 items-start ml-11 pl-3 border-l border-border", className)}
    {...props}
  >
    {children}
  </div>
))
CommentReply.displayName = "CommentReply"

export const CommentThreadCompound = Object.assign(CommentThread, {
  Item: CommentItem,
  Avatar: CommentAvatar,
  Body: CommentBody,
  Header: CommentHeader,
  Author: CommentAuthor,
  Time: CommentTime,
  Text: CommentText,
  Actions: CommentActions,
  Reply: CommentReply,
})

export interface SocialPostProps extends React.HTMLAttributes<HTMLDivElement> {
  author?: string
  handle?: string
  content?: string
  time?: string
  avatar?: string
  likes?: number
  comments?: number
  shares?: number
  children?: React.ReactNode
}

export const SocialPost = React.forwardRef<HTMLDivElement, SocialPostProps>(
  (
    {
      author = "Daniel Park",
      handle = "@danielpark",
      content = "Initial release completed. Telemetry and core services operational.",
      time = "2h ago",
      avatar,
      likes = 42,
      comments = 12,
      shares = 5,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [liked, setLiked] = React.useState(false)
    const [likeCount, setLikeCount] = React.useState(likes)
    const [bookmarked, setBookmarked] = React.useState(false)

    React.useEffect(() => {
      setLikeCount(likes)
    }, [likes])

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border border-border bg-card text-card-foreground p-5 w-full shadow-xs",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground p-5 w-full shadow-xs",
          className
        )}
        {...props}
      >
        <SocialPostHeader>
          <SocialPostAvatar fallback={avatar || author.charAt(0)} />
          <div className="flex-1 min-w-0">
            <SocialPostAuthor>{author}</SocialPostAuthor>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SocialPostHandle>{handle}</SocialPostHandle>
              <span>·</span>
              <SocialPostTime>{time}</SocialPostTime>
            </div>
          </div>
        </SocialPostHeader>

        <SocialPostContent>{content}</SocialPostContent>

        <SocialPostActions>
          <SocialPostAction
            active={liked}
            icon={<Heart className={cn("w-4 h-4", liked && "fill-destructive text-destructive")} />}
            label={likeCount}
            aria-pressed={liked}
            onClick={() => {
              setLiked((prev) => !prev)
              setLikeCount((c) => (liked ? c - 1 : c + 1))
            }}
          />
          <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={comments} />
          <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={shares} />
          <SocialPostAction
            active={bookmarked}
            className="ml-auto"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
            aria-pressed={bookmarked}
            icon={
              <Bookmark
                className={cn("w-4 h-4", bookmarked && "fill-foreground text-foreground")}
              />
            }
            onClick={() => setBookmarked((b) => !b)}
          />
        </SocialPostActions>
      </div>
    )
  }
)
SocialPost.displayName = "SocialPost"

export const SocialPostHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-3 mb-3", className)} {...props}>
    {children}
  </div>
))
SocialPostHeader.displayName = "SocialPostHeader"

export const SocialPostAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, className, children, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-mono font-semibold text-sm shrink-0 overflow-hidden",
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt="Post author avatar"
            onError={() => setImgError(true)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : children ? (
          children
        ) : (
          <span>{fallback || "U"}</span>
        )}
      </div>
    )
  }
)
SocialPostAvatar.displayName = "SocialPostAvatar"

export const SocialPostAuthor = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("font-semibold text-sm text-foreground tracking-tight", className)} {...props}>
    {children}
  </p>
))
SocialPostAuthor.displayName = "SocialPostAuthor"

export const SocialPostHandle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn("font-mono text-xs text-muted-foreground", className)} {...props}>
    {children}
  </span>
))
SocialPostHandle.displayName = "SocialPostHandle"

export const SocialPostTime = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs font-mono text-muted-foreground tabular-nums", className)}
    {...props}
  >
    {children}
  </span>
))
SocialPostTime.displayName = "SocialPostTime"

export const SocialPostContent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm leading-relaxed text-foreground/90 mb-4", className)} {...props}>
    {children}
  </p>
))
SocialPostContent.displayName = "SocialPostContent"

export const SocialPostActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-5 pt-3 border-t border-border", className)}
    {...props}
  >
    {children}
  </div>
))
SocialPostActions.displayName = "SocialPostActions"

export interface SocialPostActionProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon?: React.ReactNode
  label?: React.ReactNode
  active?: boolean
  children?: React.ReactNode
}

export const SocialPostAction = React.forwardRef<HTMLButtonElement, SocialPostActionProps>(
  ({ icon, label, active, className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    return (
      <motion.button
        ref={ref}
        type="button"
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "text-foreground font-medium",
          className
        )}
        {...props}
      >
        {icon}
        {label !== undefined && <span className="font-mono tabular-nums">{label}</span>}
        {children}
      </motion.button>
    )
  }
)
SocialPostAction.displayName = "SocialPostAction"

export const SocialPostCompound = Object.assign(SocialPost, {
  Header: SocialPostHeader,
  Avatar: SocialPostAvatar,
  Author: SocialPostAuthor,
  Handle: SocialPostHandle,
  Time: SocialPostTime,
  Content: SocialPostContent,
  Actions: SocialPostActions,
  Action: SocialPostAction,
})

const reactionGlyphMap: Record<string, React.ReactNode> = {
  like: <ThumbsUp className="h-3.5 w-3.5" />,
  "+1": <ThumbsUp className="h-3.5 w-3.5" />,
  heart: <Heart className="h-3.5 w-3.5" />,
  rocket: <Rocket className="h-3.5 w-3.5" />,
  fire: <Flame className="h-3.5 w-3.5" />,
  cheer: <Award className="h-3.5 w-3.5" />,
  check: <Check className="h-3.5 w-3.5" />,
  star: <Star className="h-3.5 w-3.5" />,
  bolt: <Zap className="h-3.5 w-3.5" />,
  bookmark: <Bookmark className="h-3.5 w-3.5" />,
}

export interface ReactionData {
  emoji: string
  count: number
  active?: boolean
  icon?: React.ReactNode
}

export interface ReactionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  reactions?: ReactionData[]
  onReact?: (emoji: string) => void
  children?: React.ReactNode
}

const trayChoices = ["like", "heart", "rocket", "fire", "star", "check"]

export const ReactionBar = React.forwardRef<HTMLDivElement, ReactionBarProps>(
  ({ reactions, onReact, className, children, ...props }, ref) => {
    const [items, setItems] = React.useState<ReactionData[]>(reactions || [])
    const [pickerOpen, setPickerOpen] = React.useState(false)

    React.useEffect(() => {
      if (reactions) setItems(reactions)
    }, [reactions])

    if (children) {
      return (
        <div ref={ref} className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
          {children}
        </div>
      )
    }

    const handleToggle = (key: string) => {
      setItems((prev) => {
        const exists = prev.some((r) => r.emoji === key)
        if (exists) {
          return prev.map((r) =>
            r.emoji === key
              ? {
                  ...r,
                  active: !r.active,
                  count: r.active ? Math.max(0, r.count - 1) : r.count + 1,
                }
              : r
          )
        }
        return [...prev, { emoji: key, count: 1, active: true }]
      })
      onReact?.(key)
      setPickerOpen(false)
    }

    return (
      <div ref={ref} className={cn("relative flex flex-wrap items-center gap-2", className)} {...props}>
        {items.map((r) => (
          <ReactionItem
            key={r.emoji}
            emoji={r.emoji}
            icon={r.icon}
            count={r.count}
            active={r.active}
            onClick={() => handleToggle(r.emoji)}
          />
        ))}
        <ReactionAdd
          aria-expanded={pickerOpen}
          aria-label="Add reaction"
          onAdd={() => setPickerOpen((o) => !o)}
        />
        {pickerOpen && (
          <div
            role="menu"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-popover p-1 shadow-md"
          >
            {trayChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                role="menuitem"
                aria-label={`React with ${choice}`}
                onClick={() => handleToggle(choice)}
                className="h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {reactionGlyphMap[choice]}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
ReactionBar.displayName = "ReactionBar"

export interface ReactionItemProps extends Omit<HTMLMotionProps<"button">, "children"> {
  emoji: string
  count: number
  active?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

export const ReactionItem = React.forwardRef<HTMLButtonElement, ReactionItemProps>(
  ({ emoji, count, active = false, icon, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const glyph = icon || reactionGlyphMap[emoji.toLowerCase()] || <Smile className="h-3.5 w-3.5" />

    return (
      <motion.button
        ref={ref}
        type="button"
        aria-pressed={active}
        aria-label={`${emoji} reaction, count ${count}`}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "border-foreground bg-foreground text-background font-medium"
            : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center shrink-0" aria-hidden="true">
          {glyph}
        </span>
        <span className="font-mono tabular-nums">{count}</span>
      </motion.button>
    )
  }
)
ReactionItem.displayName = "ReactionItem"

export const ReactionAdd = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { onAdd?: () => void }
>(({ onAdd, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onAdd}
    className={cn(
      "inline-flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <Plus className="w-3.5 h-3.5" />
  </button>
))
ReactionAdd.displayName = "ReactionAdd"

export const ReactionBarCompound = Object.assign(ReactionBar, {
  Item: ReactionItem,
  Add: ReactionAdd,
})

export interface ActivityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: string
  action?: string
  target?: string
  time?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export const ActivityItem = React.forwardRef<HTMLDivElement, ActivityItemProps>(
  ({ user, action, target, time, icon, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn("flex items-start gap-3 py-3 w-full", className)} {...props}>
          {children}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("flex items-start gap-3 py-3 w-full", className)} {...props}>
        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-foreground font-mono text-xs font-semibold shrink-0">
          {icon || user?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-foreground leading-snug">
            <span className="font-semibold text-foreground">{user}</span>{" "}
            <span className="text-muted-foreground">{action}</span>{" "}
            {target && <span className="font-mono font-medium text-foreground">{target}</span>}
          </p>
          {time && (
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums mt-0.5 block">
              {time}
            </span>
          )}
        </div>
      </div>
    )
  }
)
ActivityItem.displayName = "ActivityItem"

export interface OnlineUserData {
  name: string
  status?: "online" | "away" | "busy" | "offline"
  avatar?: string
}

export interface OnlineUsersListProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: OnlineUserData[]
  children?: React.ReactNode
}

const presenceDotColors: Record<NonNullable<OnlineUserData["status"]>, string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-destructive",
  offline: "bg-muted-foreground/50",
}

const presenceBadgeClasses: Record<NonNullable<OnlineUserData["status"]>, string> = {
  online: "text-success",
  away: "text-warning",
  busy: "text-destructive",
  offline: "text-muted-foreground",
}

export const OnlineUsersList = React.forwardRef<HTMLDivElement, OnlineUsersListProps>(
  ({ users, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref}
          className={cn("rounded-xl border border-border bg-card p-4 shadow-xs w-full max-w-xs", className)}
          {...props}
        >
          {children}
        </div>
      )
    }

    const onlineCount = users?.filter((u) => u.status === "online").length || 0

    return (
      <div
        ref={ref}
        className={cn("rounded-xl border border-border bg-card p-4 shadow-xs w-full max-w-xs", className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <h4 className="font-semibold text-xs tracking-tight text-foreground">
            Active Team Members
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold border border-success/25 tabular-nums">
            {onlineCount} Online
          </span>
        </div>
        <div className="space-y-2">
          {users?.map((user) => {
            const st = user.status || "offline"
            return (
              <div key={user.name} className="flex items-center justify-between gap-2.5 py-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center font-mono text-[11px] font-semibold text-foreground">
                      {user.name.charAt(0)}
                    </div>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-card",
                        presenceDotColors[st]
                      )}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate">{user.name}</span>
                </div>
                <span className={cn("text-[10px] font-mono capitalize shrink-0", presenceBadgeClasses[st])}>
                  {st}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
OnlineUsersList.displayName = "OnlineUsersList"

export interface ShareSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string
  title?: string
  children?: React.ReactNode
}

export const ShareSheet = React.forwardRef<HTMLDivElement, ShareSheetProps>(
  ({ url = "https://nexoreui.com/docs", title = "Share this project", className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const [copied, setCopied] = React.useState(false)
    const [selectedPlatform, setSelectedPlatform] = React.useState<string | null>(null)

    if (children) {
      return (
        <div
          ref={ref}
          className={cn("rounded-xl border border-border bg-card p-5 shadow-xs max-w-sm w-full", className)}
          {...props}
        >
          {children}
        </div>
      )
    }

    const platforms: { name: string; icon: React.ReactNode }[] = [
      { name: "X", icon: "X" },
      { name: "LinkedIn", icon: "in" },
      { name: "Telegram", icon: <Send className="w-3.5 h-3.5 -rotate-45" /> },
      { name: "Direct", icon: <Share2 className="w-3.5 h-3.5" /> },
    ]

    const handleCopy = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url)
        } else {
          const area = document.createElement("textarea")
          area.value = url
          area.style.position = "fixed"
          area.style.opacity = "0"
          document.body.appendChild(area)
          area.select()
          document.execCommand("copy")
          document.body.removeChild(area)
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        setCopied(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn("rounded-xl border border-border bg-card p-4 shadow-xs max-w-sm w-full space-y-3.5", className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm text-foreground tracking-tight">{title}</h4>
          {selectedPlatform && (
            <span className="text-[10px] font-mono text-muted-foreground">
              Channel: {selectedPlatform}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p.name
            return (
              <motion.button
                key={p.name}
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                onClick={() => setSelectedPlatform(p.name)}
                aria-pressed={isSelected}
                className={cn(
                  "h-9 px-3 rounded-lg border text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/40 text-foreground hover:bg-muted"
                )}
                title={p.name}
              >
                {p.icon}
                <span>{p.name}</span>
              </motion.button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-muted/50 text-xs font-mono text-muted-foreground truncate border border-border min-w-0">
            {url}
          </div>
          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            onClick={handleCopy}
            className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium shrink-0 inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </motion.button>
        </div>
      </div>
    )
  }
)
ShareSheet.displayName = "ShareSheet"

export interface NotificationItemData {
  title: string
  message: string
  time: string
  read?: boolean
  type?: "info" | "success" | "warning"
}

export interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItemData[]
  onMarkAllRead?: () => void
  onItemClick?: (index: number) => void
  children?: React.ReactNode
}

export const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  ({ notifications, onMarkAllRead, onItemClick, className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const instanceId = React.useId().replace(/:/g, "")
    const [items, setItems] = React.useState<NotificationItemData[]>(notifications || [])
    const [filter, setFilter] = React.useState<"all" | "unread">("all")

    React.useEffect(() => {
      if (notifications) setItems(notifications)
    }, [notifications])

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border border-border bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    const typeIcons: Record<string, React.ReactNode> = {
      info: <MessageSquare className="w-4 h-4 text-info" />,
      success: <CheckCircle2 className="w-4 h-4 text-success" />,
      warning: <AlertTriangle className="w-4 h-4 text-warning" />,
    }

    const unreadCount = items.filter((n) => !n.read).length
    const visibleItems =
      filter === "unread" ? items.filter((n) => !n.read) : items

    const handleMarkAll = () => {
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      onMarkAllRead?.()
    }

    const toggleRead = (itemIndex: number) => {
      setItems((prev) =>
        prev.map((entry, idx) =>
          idx === itemIndex ? { ...entry, read: !entry.read } : entry
        )
      )
      onItemClick?.(itemIndex)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 min-w-0">
            <Bell className="w-4 h-4 text-foreground shrink-0" />
            <h4 className="font-semibold text-xs text-foreground tracking-tight">Notifications</h4>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-foreground tabular-nums">
              {unreadCount}
            </span>
          </div>
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
            className="text-[11px] text-foreground hover:underline font-medium cursor-pointer disabled:opacity-45 disabled:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Mark all read
          </button>
        </div>

        <div className="px-4 py-2 border-b border-border bg-background/60 flex items-center gap-1">
          {(["all", "unread"] as const).map((tab) => {
            const active = filter === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "relative px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`notif-filter-${instanceId}`}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 450, damping: 34 }
                    }
                    className="absolute inset-0 rounded-md bg-muted border border-border/70 z-0"
                  />
                )}
                <span className="relative z-10">
                  {tab === "unread" ? `Unread (${unreadCount})` : `All (${items.length})`}
                </span>
              </button>
            )
          })}
        </div>

        <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
          {visibleItems.length > 0 ? (
            visibleItems.map((n) => {
              const originalIndex = items.indexOf(n)
              return (
                <button
                  key={`${n.title}-${originalIndex}`}
                  type="button"
                  onClick={() => toggleRead(originalIndex)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    !n.read && "bg-muted/25"
                  )}
                >
                  <span className="shrink-0 mt-0.5" aria-hidden="true">
                    {typeIcons[n.type || "info"] || <Bell className="w-4 h-4 text-muted-foreground" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                      {n.time}
                    </span>
                    {!n.read && (
                      <span
                        aria-label="Unread"
                        className="w-1.5 h-1.5 rounded-full bg-info shrink-0"
                      />
                    )}
                  </div>
                </button>
              )
            })
          ) : (
            <div className="py-8 text-center text-xs font-mono text-muted-foreground">
              All notifications read
            </div>
          )}
        </div>
      </div>
    )
  }
)
NotificationCenter.displayName = "NotificationCenter"
