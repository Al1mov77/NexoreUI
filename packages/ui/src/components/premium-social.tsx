'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Bell,
  Sparkles,
  Copy,
  ExternalLink,
  Plus
} from 'lucide-react';
import { cn } from '../utils/cn';

// ============================================================================
// 1. CHAT MESSAGE (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ChatMessageContextValue {
  variant: 'sent' | 'received';
  isOwn: boolean;
}

const ChatMessageContext = React.createContext<ChatMessageContextValue>({
  variant: 'received',
  isOwn: false,
});

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
  isOwn?: boolean;
  // Legacy / fallback props:
  message?: string;
  sender?: string;
  time?: string;
  avatar?: string;
  children?: React.ReactNode;
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
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant: 'sent' | 'received' =
      variant || (isOwn ? 'sent' : 'received');
    const resolvedIsOwn = resolvedVariant === 'sent';

    const contextValue = React.useMemo(
      () => ({ variant: resolvedVariant, isOwn: resolvedIsOwn }),
      [resolvedVariant, resolvedIsOwn]
    );

    // If compound children are provided, render compound tree
    if (children) {
      return (
        <ChatMessageContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(
              'flex gap-3 group/msg transition-all duration-200',
              resolvedIsOwn ? 'flex-row-reverse justify-start' : 'flex-row justify-start',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </ChatMessageContext.Provider>
      );
    }

    // Graceful backward compatibility with flat props
    return (
      <ChatMessageContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'flex gap-3 group/msg transition-all duration-200',
            resolvedIsOwn ? 'flex-row-reverse justify-start' : 'flex-row justify-start',
            className
          )}
          {...props}
        >
          <ChatMessageAvatar fallback={avatar || sender?.charAt(0) || 'U'} />
          <ChatMessageBody>
            {(sender || time) && (
              <ChatMessageHeader>
                {sender && <ChatMessageSender>{sender}</ChatMessageSender>}
                {time && <ChatMessageTime>{time}</ChatMessageTime>}
              </ChatMessageHeader>
            )}
            {message && <ChatMessageContent>{message}</ChatMessageContent>}
          </ChatMessageBody>
        </div>
      </ChatMessageContext.Provider>
    );
  }
);
ChatMessage.displayName = 'ChatMessage';

export interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  isOnline?: boolean;
}

export const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(
  ({ src, fallback, isOnline, className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 select-none shadow-sm',
          isOwn
            ? 'bg-gradient-to-tr from-primary to-violet-500 text-white shadow-primary/20'
            : 'bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 text-white border border-border/80',
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : children ? (
          children
        ) : (
          <span>{fallback || (isOwn ? 'Y' : 'U')}</span>
        )}

        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </div>
    );
  }
);
ChatMessageAvatar.displayName = 'ChatMessageAvatar';

export const ChatMessageBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col max-w-[80%] sm:max-w-[70%]',
          isOwn ? 'items-end' : 'items-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageBody.displayName = 'ChatMessageBody';

export const ChatMessageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 mb-1 px-1',
          isOwn ? 'flex-row-reverse text-right' : 'flex-row text-left',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageHeader.displayName = 'ChatMessageHeader';

export const ChatMessageSender = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-xs font-semibold text-foreground/90 tracking-tight', className)}
      {...props}
    >
      {children}
    </span>
  )
);
ChatMessageSender.displayName = 'ChatMessageSender';

export const ChatMessageTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-[11px] font-mono text-muted-foreground/80', className)}
      {...props}
    >
      {children}
    </span>
  )
);
ChatMessageTime.displayName = 'ChatMessageTime';

export interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
}

export const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  ({ variant: propVariant, className, children, ...props }, ref) => {
    const context = React.useContext(ChatMessageContext);
    const isOwn = propVariant ? propVariant === 'sent' : context.isOwn;

    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-2.5 text-sm leading-relaxed tracking-normal shadow-xs transition-colors duration-200',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-xs selection:bg-primary-foreground/20 selection:text-primary-foreground font-medium'
            : 'bg-card/90 dark:bg-zinc-900 text-card-foreground border border-border/70 rounded-2xl rounded-tl-xs backdrop-blur-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageContent.displayName = 'ChatMessageContent';

export interface ChatMessageStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatMessageStatus = React.forwardRef<HTMLSpanElement, ChatMessageStatusProps>(
  ({ status = 'read', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center text-[10px] text-muted-foreground ml-1.5', className)}
        {...props}
      >
        {status === 'sent' && <Check className="w-3 h-3 text-muted-foreground" />}
        {status === 'delivered' && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
        {status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
      </span>
    );
  }
);
ChatMessageStatus.displayName = 'ChatMessageStatus';

// Compound Dot-notation assignment for ChatMessage
export const ChatMessageCompound = Object.assign(ChatMessage, {
  Avatar: ChatMessageAvatar,
  Body: ChatMessageBody,
  Header: ChatMessageHeader,
  Sender: ChatMessageSender,
  Time: ChatMessageTime,
  Content: ChatMessageContent,
  Status: ChatMessageStatus,
});


// ============================================================================
// 2. CHAT INPUT (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSend?: (message: string) => void;
  children?: React.ReactNode;
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  ({ placeholder = 'Type a message...', onSend, className, children, ...props }, ref) => {
    const [text, setText] = React.useState('');

    const handleSend = () => {
      if (text.trim()) {
        onSend?.(text);
        setText('');
      }
    };

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-2 pl-4 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-2 pl-4 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200',
          className
        )}
        {...props}
      >
        <ChatInputAction icon={<Paperclip className="w-4 h-4" />} title="Attach file" />
        <ChatInputField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
        />
        <ChatInputAction icon={<Smile className="w-4 h-4" />} title="Add emoji" />
        <ChatInputSubmit onClick={handleSend} disabled={!text.trim()} />
      </div>
    );
  }
);
ChatInput.displayName = 'ChatInput';

export const ChatInputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 min-w-0 font-normal',
        className
      )}
      {...props}
    />
  )
);
ChatInputField.displayName = 'ChatInputField';

export const ChatInputActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-1 shrink-0', className)} {...props}>
      {children}
    </div>
  )
);
ChatInputActions.displayName = 'ChatInputActions';

export interface ChatInputActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const ChatInputAction = React.forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ icon, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition-all duration-150 cursor-pointer shrink-0',
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  )
);
ChatInputAction.displayName = 'ChatInputAction';

export interface ChatInputSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export const ChatInputSubmit = React.forwardRef<HTMLButtonElement, ChatInputSubmitProps>(
  ({ disabled = false, className, children, ...props }, ref) => (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      disabled={disabled}
      className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer',
        disabled
          ? 'bg-muted/70 text-muted-foreground/50 cursor-not-allowed'
          : 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90',
        className
      )}
      {...(props as any)}
    >
      {children || <Send className="w-4 h-4" />}
    </motion.button>
  )
);
ChatInputSubmit.displayName = 'ChatInputSubmit';

export const ChatInputCompound = Object.assign(ChatInput, {
  Field: ChatInputField,
  Actions: ChatInputActions,
  Action: ChatInputAction,
  Submit: ChatInputSubmit,
});


// ============================================================================
// 3. USER PROFILE CARD (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface UserProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  username?: string;
  bio?: string;
  stats?: { label: string; value: string }[];
  isFollowing?: boolean;
  avatar?: string;
  coverGradient?: string;
  children?: React.ReactNode;
}

export const UserProfileCard = React.forwardRef<HTMLDivElement, UserProfileCardProps>(
  (
    {
      name = 'Jane Doe',
      username = '@janedoe',
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
    const [following, setFollowing] = React.useState(isFollowing);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 transition-all duration-300',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 transition-all duration-300',
          className
        )}
        {...props}
      >
        <UserProfileCover gradient={coverGradient} />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-9 mb-3">
            <UserProfileAvatar fallback={avatar || name.charAt(0)} />
            <UserProfileFollowButton following={following} onClick={() => setFollowing(!following)} />
          </div>

          <UserProfileInfo>
            <UserProfileName>{name}</UserProfileName>
            <UserProfileHandle>{username}</UserProfileHandle>
          </UserProfileInfo>

          {bio && <UserProfileBio>{bio}</UserProfileBio>}

          {stats && stats.length > 0 && (
            <UserProfileStats>
              {stats.map((s, idx) => (
                <UserProfileStat key={idx} label={s.label} value={s.value} />
              ))}
            </UserProfileStats>
          )}
        </div>
      </div>
    );
  }
);
UserProfileCard.displayName = 'UserProfileCard';

export interface UserProfileCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  imageSrc?: string;
}

export const UserProfileCover = React.forwardRef<HTMLDivElement, UserProfileCoverProps>(
  ({ gradient, imageSrc, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'h-36 w-full relative overflow-hidden rounded-t-2xl',
        gradient || 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500',
        className
      )}
      {...props}
    >
      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      {/* Soft atmospheric radial glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/40 rounded-full blur-2xl pointer-events-none" />
      {/* Smooth bottom blend into card */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
      {imageSrc && <img src={imageSrc} alt="Cover" className="w-full h-full object-cover" />}
      {children}
    </div>
  )
);
UserProfileCover.displayName = 'UserProfileCover';

export interface UserProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  status?: 'online' | 'busy' | 'offline';
}

export const UserProfileAvatar = React.forwardRef<HTMLDivElement, UserProfileAvatarProps>(
  ({ src, fallback, status = 'online', className, children, ...props }, ref) => (
    <div className="relative shrink-0">
      <div
        ref={ref}
        className={cn(
          'w-20 h-20 rounded-full border-4 border-card ring-2 ring-primary/30 bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-2xl overflow-hidden select-none',
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full object-cover" />
        ) : children ? (
          children
        ) : (
          <span>{fallback || 'U'}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-card shadow-sm',
            status === 'online' && 'bg-emerald-500',
            status === 'busy' && 'bg-rose-500',
            status === 'offline' && 'bg-zinc-500'
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  )
);
UserProfileAvatar.displayName = 'UserProfileAvatar';

export const UserProfileInfo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-0.5', className)} {...props}>
      {children}
    </div>
  )
);
UserProfileInfo.displayName = 'UserProfileInfo';

export const UserProfileName = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="flex items-center gap-1.5">
      <h4 ref={ref} className={cn('font-bold text-lg text-foreground tracking-tight', className)} {...props}>
        {children}
      </h4>
      <svg className="w-4 h-4 text-primary fill-primary/20 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
);
UserProfileName.displayName = 'UserProfileName';

export const UserProfileHandle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs font-mono text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
);
UserProfileHandle.displayName = 'UserProfileHandle';

export const UserProfileBio = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3', className)} {...props}>
      {children}
    </p>
  )
);
UserProfileBio.displayName = 'UserProfileBio';

export const UserProfileStats = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-6 mt-4 pt-4 border-t border-border/70', className)}
      {...props}
    >
      {children}
    </div>
  )
);
UserProfileStats.displayName = 'UserProfileStats';

export interface UserProfileStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

export const UserProfileStat = React.forwardRef<HTMLDivElement, UserProfileStatProps>(
  ({ label, value, className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-0.5', className)} {...props}>
      <p className="font-bold text-sm text-foreground tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
);
UserProfileStat.displayName = 'UserProfileStat';

export interface UserProfileFollowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  following?: boolean;
}

export const UserProfileFollowButton = React.forwardRef<HTMLButtonElement, UserProfileFollowButtonProps>(
  ({ following = false, className, children, ...props }, ref) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs',
        following
          ? 'bg-muted/80 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-border/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25',
        className
      )}
      {...(props as any)}
    >
      {children || (following ? 'Following' : 'Follow')}
    </motion.button>
  )
);
UserProfileFollowButton.displayName = 'UserProfileFollowButton';

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
});


// ============================================================================
// 4. COMMENT THREAD (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface CommentData {
  author: string;
  text: string;
  time: string;
  avatar?: string;
  replies?: { author: string; text: string; time: string; avatar?: string }[];
}

export interface CommentThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  comments?: CommentData[];
  children?: React.ReactNode;
}

export const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
  ({ comments, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('space-y-4 w-full', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-4 w-full', className)} {...props}>
        {comments?.map((comment, i) => (
          <div key={i} className="space-y-3">
            <CommentItem>
              <CommentAvatar fallback={comment.author.charAt(0)} />
              <CommentBody>
                <CommentHeader>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentTime>{comment.time}</CommentTime>
                </CommentHeader>
                <CommentText>{comment.text}</CommentText>
                <CommentActions>
                  <button type="button" className="hover:text-primary transition-colors cursor-pointer">
                    Reply
                  </button>
                </CommentActions>
              </CommentBody>
            </CommentItem>

            {comment.replies?.map((reply, j) => (
              <CommentReply key={j}>
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
          </div>
        ))}
      </div>
    );
  }
);
CommentThread.displayName = 'CommentThread';

export const CommentItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex gap-3.5 items-start', className)} {...props}>
      {children}
    </div>
  )
);
CommentItem.displayName = 'CommentItem';

export interface CommentAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md';
}

export const CommentAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, size = 'md', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-gradient-to-tr from-violet-500 to-indigo-600 shadow-xs',
        size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
      ) : children ? (
        children
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  )
);
CommentAvatar.displayName = 'CommentAvatar';

export const CommentBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 min-w-0 space-y-1', className)} {...props}>
      {children}
    </div>
  )
);
CommentBody.displayName = 'CommentBody';

export const CommentHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 mb-0.5', className)} {...props}>
      {children}
    </div>
  )
);
CommentHeader.displayName = 'CommentHeader';

export const CommentAuthor = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-semibold text-xs text-foreground', className)} {...props}>
      {children}
    </span>
  )
);
CommentAuthor.displayName = 'CommentAuthor';

export const CommentTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-[11px] font-mono text-muted-foreground', className)} {...props}>
      {children}
    </span>
  )
);
CommentTime.displayName = 'CommentTime';

export const CommentText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-foreground/80 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
);
CommentText.displayName = 'CommentText';

export const CommentActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 pt-1 text-[11px] text-muted-foreground', className)} {...props}>
      {children}
    </div>
  )
);
CommentActions.displayName = 'CommentActions';

export const CommentReply = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex gap-3 items-start ml-11 pl-2 border-l border-border/60', className)} {...props}>
      {children}
    </div>
  )
);
CommentReply.displayName = 'CommentReply';

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
});


// ============================================================================
// 5. SOCIAL POST (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface SocialPostProps extends React.HTMLAttributes<HTMLDivElement> {
  author?: string;
  handle?: string;
  content?: string;
  time?: string;
  avatar?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  children?: React.ReactNode;
}

export const SocialPost = React.forwardRef<HTMLDivElement, SocialPostProps>(
  (
    {
      author = 'John Smith',
      handle = '@johnsmith',
      content = 'Just launched my new project! Check it out 🚀',
      time = '2h ago',
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
    const [liked, setLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(likes);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground p-5 w-full shadow-lg shadow-black/5 dark:shadow-black/30 transition-all duration-200',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground p-5 w-full shadow-lg shadow-black/5 dark:shadow-black/30 transition-all duration-200',
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
            icon={<Heart className={cn('w-4 h-4', liked && 'fill-rose-500 text-rose-500')} />}
            label={likeCount}
            onClick={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
          />
          <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={comments} />
          <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={shares} />
        </SocialPostActions>
      </div>
    );
  }
);
SocialPost.displayName = 'SocialPost';

export const SocialPostHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 mb-3.5', className)} {...props}>
      {children}
    </div>
  )
);
SocialPostHeader.displayName = 'SocialPostHeader';

export const SocialPostAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
      ) : children ? (
        children
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  )
);
SocialPostAvatar.displayName = 'SocialPostAvatar';

export const SocialPostAuthor = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('font-semibold text-sm text-foreground tracking-tight', className)} {...props}>
      {children}
    </p>
  )
);
SocialPostAuthor.displayName = 'SocialPostAuthor';

export const SocialPostHandle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-mono text-xs text-muted-foreground', className)} {...props}>
      {children}
    </span>
  )
);
SocialPostHandle.displayName = 'SocialPostHandle';

export const SocialPostTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-xs text-muted-foreground/80', className)} {...props}>
      {children}
    </span>
  )
);
SocialPostTime.displayName = 'SocialPostTime';

export const SocialPostContent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-foreground/90 mb-4', className)} {...props}>
      {children}
    </p>
  )
);
SocialPostContent.displayName = 'SocialPostContent';

export const SocialPostActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-6 pt-3 border-t border-border/70', className)} {...props}>
      {children}
    </div>
  )
);
SocialPostActions.displayName = 'SocialPostActions';

export interface SocialPostActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
}

export const SocialPostAction = React.forwardRef<HTMLButtonElement, SocialPostActionProps>(
  ({ icon, label, active, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.9 }}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer',
        active && 'text-rose-500 hover:text-rose-500 font-medium',
        className
      )}
      {...(props as any)}
    >
      {icon}
      {label !== undefined && <span>{label}</span>}
      {children}
    </motion.button>
  )
);
SocialPostAction.displayName = 'SocialPostAction';

export const SocialPostCompound = Object.assign(SocialPost, {
  Header: SocialPostHeader,
  Avatar: SocialPostAvatar,
  Author: SocialPostAuthor,
  Handle: SocialPostHandle,
  Time: SocialPostTime,
  Content: SocialPostContent,
  Actions: SocialPostActions,
  Action: SocialPostAction,
});


// ============================================================================
// 6. REACTION BAR (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ReactionData {
  emoji: string;
  count: number;
  active?: boolean;
}

export interface ReactionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  reactions?: ReactionData[];
  onReact?: (emoji: string) => void;
  children?: React.ReactNode;
}

export const ReactionBar = React.forwardRef<HTMLDivElement, ReactionBarProps>(
  ({ reactions, onReact, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
        {reactions?.map((r, i) => (
          <ReactionItem
            key={i}
            emoji={r.emoji}
            count={r.count}
            active={r.active}
            onClick={() => onReact?.(r.emoji)}
          />
        ))}
        <ReactionAdd onAdd={() => onReact?.('✨')} />
      </div>
    );
  }
);
ReactionBar.displayName = 'ReactionBar';

export interface ReactionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emoji: string;
  count: number;
  active?: boolean;
}

export const ReactionItem = React.forwardRef<HTMLButtonElement, ReactionItemProps>(
  ({ emoji, count, active = false, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.92 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-all duration-200 cursor-pointer shadow-2xs',
        active
          ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
          : 'border-border/80 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground',
        className
      )}
      {...(props as any)}
    >
      <span className="text-sm leading-none">{emoji}</span>
      <span className="font-mono">{count}</span>
    </motion.button>
  )
);
ReactionItem.displayName = 'ReactionItem';

export const ReactionAdd = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { onAdd?: () => void }>(
  ({ onAdd, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onAdd}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-xs cursor-pointer',
        className
      )}
      {...props}
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  )
);
ReactionAdd.displayName = 'ReactionAdd';

export const ReactionBarCompound = Object.assign(ReactionBar, {
  Item: ReactionItem,
  Add: ReactionAdd,
});


// ============================================================================
// 7. ACTIVITY ITEM (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ActivityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: string;
  action?: string;
  target?: string;
  time?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ActivityItem = React.forwardRef<HTMLDivElement, ActivityItemProps>(
  ({ user, action, target, time, icon, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('flex items-start gap-3 py-3 w-full', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start gap-3 py-3 w-full', className)} {...props}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
          {icon || user?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-foreground/90 leading-snug">
            <span className="font-semibold text-foreground">{user}</span>{' '}
            <span className="text-muted-foreground">{action}</span>{' '}
            {target && <span className="font-medium text-foreground">{target}</span>}
          </p>
          {time && <span className="text-[11px] font-mono text-muted-foreground mt-0.5 block">{time}</span>}
        </div>
      </div>
    );
  }
);
ActivityItem.displayName = 'ActivityItem';


// ============================================================================
// 8. ONLINE USERS LIST (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface OnlineUserData {
  name: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  avatar?: string;
}

export interface OnlineUsersListProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: OnlineUserData[];
  children?: React.ReactNode;
}

export const OnlineUsersList = React.forwardRef<HTMLDivElement, OnlineUsersListProps>(
  ({ users, className, children, ...props }, ref) => {
    const statusColors = {
      online: 'bg-emerald-500',
      away: 'bg-amber-500',
      busy: 'bg-rose-500',
      offline: 'bg-muted-foreground/50',
    };

    if (children) {
      return (
        <div
          ref={ref}
          className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-lg w-full max-w-xs', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const onlineCount = users?.filter((u) => u.status === 'online').length || 0;

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-lg w-full max-w-xs', className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
          <h4 className="font-semibold text-xs tracking-tight text-foreground">Active Team Members</h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
            {onlineCount} Online
          </span>
        </div>
        <div className="space-y-2">
          {users?.map((user, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-2xs">
                  {user.name.charAt(0)}
                </div>
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-card',
                    statusColors[user.status || 'offline']
                  )}
                />
              </div>
              <span className="text-xs font-medium text-foreground/90">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
OnlineUsersList.displayName = 'OnlineUsersList';


// ============================================================================
// 9. SHARE SHEET (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ShareSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  title?: string;
  children?: React.ReactNode;
}

export const ShareSheet = React.forwardRef<HTMLDivElement, ShareSheetProps>(
  ({ url = 'https://nexoreui.site', title = 'Share this project', className, children, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn('rounded-2xl border border-border/80 bg-card p-5 shadow-lg max-w-sm w-full', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const platforms = [
      { name: 'Twitter', color: 'bg-sky-500', icon: '𝕏' },
      { name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
      { name: 'LinkedIn', color: 'bg-indigo-600', icon: 'in' },
      { name: 'Telegram', color: 'bg-cyan-500', icon: '✈' },
    ];

    const handleCopy = () => {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl border border-border/80 bg-card p-5 shadow-lg max-w-sm w-full space-y-4', className)}
        {...props}
      >
        <h4 className="font-semibold text-sm text-foreground tracking-tight">{title}</h4>
        <div className="flex gap-2.5">
          {platforms.map((p, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform cursor-pointer',
                p.color
              )}
              title={p.name}
            >
              {p.icon}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-xl bg-muted/60 text-xs font-mono text-muted-foreground truncate border border-border/60">
            {url}
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium shrink-0 flex items-center gap-1.5 shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>
      </div>
    );
  }
);
ShareSheet.displayName = 'ShareSheet';


// ============================================================================
// 10. NOTIFICATION CENTER (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface NotificationItemData {
  title: string;
  message: string;
  time: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning';
}

export interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItemData[];
  onMarkAllRead?: () => void;
  children?: React.ReactNode;
}

export const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  ({ notifications, onMarkAllRead, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    const typeIcons = {
      info: '💬',
      success: '✅',
      warning: '⚠️',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-xl',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-xs text-foreground tracking-tight">Notifications</h4>
          </div>
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
          >
            Mark all read
          </button>
        </div>
        <div className="divide-y divide-border/60 max-h-[360px] overflow-y-auto">
          {notifications?.map((n, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer',
                !n.read && 'bg-primary/5'
              )}
            >
              <span className="text-sm shrink-0 mt-0.5">{typeIcons[n.type || 'info']}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs', !n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80')}>
                  {n.title}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{n.message}</p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
NotificationCenter.displayName = 'NotificationCenter';
