"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBody,
  ChatMessageHeader,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageContent,
  ChatMessageStatus,
  ChatTypingIndicator,
  ChatInput,
  UserProfileCard,
  UserProfileCover,
  UserProfileAvatar,
  UserProfileInfo,
  UserProfileName,
  UserProfileHandle,
  UserProfileBio,
  UserProfileStats,
  UserProfileStat,
  UserProfileFollowButton,
  CommentThread,
  SocialPost,
  ReactionBar,
  ActivityItem,
  OnlineUsersList,
  ShareSheet,
  NotificationCenter,
} from "nexoreui";

interface ChatMessagePlaygroundProps {
  variant?: "received" | "sent";
  sender?: string;
  message?: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
  isOnline?: boolean;
}

function ChatMessagePlayground({
  variant = "received",
  sender = "Mina Kato",
  message = "Schema migration #184 passed CI checks across all 4 clusters.",
  time = "10:42",
  status = "read",
  isOnline = true,
}: ChatMessagePlaygroundProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4">
      <ChatMessage variant={variant}>
        <ChatMessageAvatar
          fallback={sender.charAt(0).toUpperCase() || "M"}
          isOnline={isOnline}
        />
        <ChatMessageBody>
          <ChatMessageHeader>
            <ChatMessageSender>{sender}</ChatMessageSender>
            <ChatMessageTime>{time}</ChatMessageTime>
          </ChatMessageHeader>
          <ChatMessageContent>{message}</ChatMessageContent>
          {variant === "sent" && <ChatMessageStatus status={status} />}
        </ChatMessageBody>
      </ChatMessage>
    </div>
  );
}

interface ThreadEntry {
  id: string;
  variant: "received" | "sent";
  sender: string;
  time: string;
  text: string;
  replyTo?: { sender: string; excerpt: string };
}

function InteractiveChatDemo() {
  const [messages, setMessages] = useState<ThreadEntry[]>([
    {
      id: "m1",
      variant: "received",
      sender: "Mina",
      time: "10:41",
      text: "Did the registry checksum pass on eu-central-1?",
    },
    {
      id: "m2",
      variant: "sent",
      sender: "You",
      time: "10:42",
      text: "Verified 77 artifacts cleanly. Ready to promote.",
      replyTo: {
        sender: "Mina",
        excerpt: "Did the registry checksum pass on eu-central-1?",
      },
    },
  ]);

  const appendMessage = (text: string) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        variant: "sent",
        sender: "You",
        time: `${hh}:${mm}`,
        text,
      },
    ]);
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {messages.map((entry) => (
          <ChatMessage
            key={entry.id}
            variant={entry.variant}
            sender={entry.sender}
            time={entry.time}
            message={entry.text}
            replyTo={entry.replyTo}
          />
        ))}
        <ChatTypingIndicator names={["Mina"]} />
      </div>

      <ChatInput
        placeholder="Reply in thread..."
        maxLength={140}
        quickReplies={["Looks good", "Deploying now"]}
        onSend={appendMessage}
      />
    </div>
  );
}

function InteractiveProfileDemo() {
  const [following, setFollowing] = useState(true);

  return (
    <UserProfileCard className="max-w-sm">
      <UserProfileCover />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-9 mb-3">
          <UserProfileAvatar fallback="MK" status="online" />
          <UserProfileFollowButton
            following={following}
            onClick={() => setFollowing((f) => !f)}
          />
        </div>
        <UserProfileInfo>
          <UserProfileName>Mina Kato</UserProfileName>
          <UserProfileHandle>@minakato</UserProfileHandle>
        </UserProfileInfo>
        <UserProfileBio>
          Systems engineer building deterministic React primitives and CLI tooling.
        </UserProfileBio>
        <UserProfileStats>
          <UserProfileStat label="Followers" value={following ? "1,285" : "1,284"} />
          <UserProfileStat label="Following" value="340" />
          <UserProfileStat label="Packages" value="18" />
        </UserProfileStats>
      </div>
    </UserProfileCard>
  );
}

function InteractiveReactionDemo() {
  const [lastReaction, setLastReaction] = useState("Click a chip or + to react");

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <ReactionBar
        reactions={[
          { emoji: "like", count: 24, active: true },
          { emoji: "heart", count: 18 },
          { emoji: "rocket", count: 9 },
          { emoji: "fire", count: 12 },
        ]}
        onReact={(key) => setLastReaction(`Toggled: ${key}`)}
      />
      <span className="text-xs font-mono text-muted-foreground">{lastReaction}</span>
    </div>
  );
}

const examples = [
  {
    name: "Interactive Two-Way Chat with Typing & Quick Replies",
    description: "Appends sent messages in real time with quote replies, typing indicator, quick-reply chips, and character counter.",
    component: <InteractiveChatDemo />,
    code: `import { useState } from "react";
import { ChatMessage, ChatTypingIndicator, ChatInput } from "nexoreui";

interface ThreadEntry {
  id: string;
  variant: "received" | "sent";
  sender: string;
  time: string;
  text: string;
  replyTo?: { sender: string; excerpt: string };
}

export default function InteractiveChatDemo() {
  const [messages, setMessages] = useState<ThreadEntry[]>([
    {
      id: "m1",
      variant: "received",
      sender: "Mina",
      time: "10:41",
      text: "Did the registry checksum pass on eu-central-1?",
    },
    {
      id: "m2",
      variant: "sent",
      sender: "You",
      time: "10:42",
      text: "Verified 77 artifacts cleanly. Ready to promote.",
      replyTo: { sender: "Mina", excerpt: "Did the registry checksum pass on eu-central-1?" },
    },
  ]);

  const appendMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: \`msg-\${prev.length + 1}\`, variant: "sent", sender: "You", time: "Now", text },
    ]);
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="space-y-3">
        {messages.map((entry) => (
          <ChatMessage
            key={entry.id}
            variant={entry.variant}
            sender={entry.sender}
            time={entry.time}
            message={entry.text}
            replyTo={entry.replyTo}
          />
        ))}
        <ChatTypingIndicator names={["Mina"]} />
      </div>
      <ChatInput
        placeholder="Reply in thread..."
        maxLength={140}
        quickReplies={["Looks good", "Deploying now"]}
        onSend={appendMessage}
      />
    </div>
  );
}`,
  },
  {
    name: "Creator Profile Card with Compound Primitives",
    description: "Dot-grid cover header, verified handle, tabular stats, and interactive Following/Unfollow state.",
    component: <InteractiveProfileDemo />,
    code: `import { useState } from "react";
import {
  UserProfileCard,
  UserProfileCover,
  UserProfileAvatar,
  UserProfileInfo,
  UserProfileName,
  UserProfileHandle,
  UserProfileBio,
  UserProfileStats,
  UserProfileStat,
  UserProfileFollowButton,
} from "nexoreui";

export default function ProfileCardDemo() {
  const [following, setFollowing] = useState(true);

  return (
    <UserProfileCard className="max-w-sm">
      <UserProfileCover />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-9 mb-3">
          <UserProfileAvatar fallback="MK" status="online" />
          <UserProfileFollowButton following={following} onClick={() => setFollowing((f) => !f)} />
        </div>
        <UserProfileInfo>
          <UserProfileName>Mina Kato</UserProfileName>
          <UserProfileHandle>@minakato</UserProfileHandle>
        </UserProfileInfo>
        <UserProfileBio>
          Systems engineer building deterministic React primitives and CLI tooling.
        </UserProfileBio>
        <UserProfileStats>
          <UserProfileStat label="Followers" value={following ? "1,285" : "1,284"} />
          <UserProfileStat label="Following" value="340" />
          <UserProfileStat label="Packages" value="18" />
        </UserProfileStats>
      </div>
    </UserProfileCard>
  );
}`,
  },
  {
    name: "Interactive Social Feed Post",
    description: "Feed card with working Like counter, Bookmark toggle, and tabular interaction metrics.",
    component: (
      <SocialPost
        className="max-w-md"
        author="David Romero"
        handle="@dromero"
        time="2h ago"
        content="Shipped semantic token support and reduced-motion guards across all 12 feedback primitives."
        likes={42}
        comments={12}
        shares={5}
      />
    ),
    code: `import { SocialPost } from "nexoreui";

export default function SocialPostDemo() {
  return (
    <SocialPost
      className="max-w-md"
      author="David Romero"
      handle="@dromero"
      time="2h ago"
      content="Shipped semantic token support and reduced-motion guards across all 12 feedback primitives."
      likes={42}
      comments={12}
      shares={5}
    />
  );
}`,
  },
  {
    name: "Threaded Comments with Live Inline Reply",
    description: "Nested vertical thread connectors with an interactive Reply form that appends responses inline.",
    component: (
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-4">
        <CommentThread
          comments={[
            {
              author: "Nadia Okafor",
              text: "Breaking ChatMessage into compound slots made custom reply previews straightforward.",
              time: "2h ago",
              replies: [
                {
                  author: "Tomas Lind",
                  text: "Agreed. Click Reply below to test appending a live thread entry.",
                  time: "45m ago",
                },
              ],
            },
          ]}
        />
      </div>
    ),
    code: `import { CommentThread } from "nexoreui";

export default function CommentThreadDemo() {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4">
      <CommentThread
        comments={[
          {
            author: "Nadia Okafor",
            text: "Breaking ChatMessage into compound slots made custom reply previews straightforward.",
            time: "2h ago",
            replies: [
              {
                author: "Tomas Lind",
                text: "Agreed. Click Reply below to test appending a live thread entry.",
                time: "45m ago",
              },
            ],
          },
        ]}
      />
    </div>
  );
}`,
  },
  {
    name: "Interactive Reaction Bar with Add Tray",
    description: "Icon-backed reaction chips with tabular toggle counters and an expandable + tray.",
    component: <InteractiveReactionDemo />,
    code: `import { useState } from "react";
import { ReactionBar } from "nexoreui";

export default function ReactionBarDemo() {
  const [lastReaction, setLastReaction] = useState("Click a chip or + to react");

  return (
    <div className="flex flex-col items-center gap-3">
      <ReactionBar
        reactions={[
          { emoji: "like", count: 24, active: true },
          { emoji: "heart", count: 18 },
          { emoji: "rocket", count: 9 },
          { emoji: "fire", count: 12 },
        ]}
        onReact={(key) => setLastReaction(\`Toggled: \${key}\`)}
      />
      <span className="text-xs font-mono text-muted-foreground">{lastReaction}</span>
    </div>
  );
}`,
  },
  {
    name: "Notification Center, Presence & Share Sheet",
    description: "Filterable All/Unread inbox with gliding pill, team availability roster, and link share panel.",
    component: (
      <div className="w-full max-w-md space-y-4">
        <NotificationCenter
          className="max-w-full"
          notifications={[
            {
              title: "Registry build verified",
              message: "All 77 component tarballs passed SHA-256 checks.",
              time: "2m",
              read: false,
              type: "success",
            },
            {
              title: "Quota approaching 85%",
              message: "Edge bandwidth reached 850 GB of 1 TB allocation.",
              time: "18m",
              read: false,
              type: "warning",
            },
            {
              title: "PR #412 merged",
              message: "Tomas Lind merged feat/dialog-hold into main.",
              time: "1h",
              read: true,
              type: "info",
            },
          ]}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <OnlineUsersList
            className="max-w-full"
            users={[
              { name: "Mina Kato", status: "online" },
              { name: "Tomas Lind", status: "away" },
              { name: "Nadia Okafor", status: "busy" },
            ]}
          />
          <div className="space-y-3">
            <ShareSheet
              className="max-w-full"
              url="https://nexoreui.com/docs"
              title="Share docs"
            />
            <ActivityItem
              user="Mina"
              action="tagged release"
              target="v2.0.4"
              time="4m ago"
            />
          </div>
        </div>
      </div>
    ),
    code: `import { NotificationCenter, OnlineUsersList, ShareSheet, ActivityItem } from "nexoreui";

export default function CollaborationSuiteDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <NotificationCenter
        className="max-w-full"
        notifications={[
          { title: "Registry build verified", message: "All 77 component tarballs passed SHA-256 checks.", time: "2m", read: false, type: "success" },
          { title: "Quota approaching 85%", message: "Edge bandwidth reached 850 GB of 1 TB allocation.", time: "18m", read: false, type: "warning" },
          { title: "PR #412 merged", message: "Tomas Lind merged feat/dialog-hold into main.", time: "1h", read: true, type: "info" },
        ]}
      />
      <OnlineUsersList
        users={[
          { name: "Mina Kato", status: "online" },
          { name: "Tomas Lind", status: "away" },
          { name: "Nadia Okafor", status: "busy" },
        ]}
      />
      <ShareSheet url="https://nexoreui.com/docs" title="Share docs" />
      <ActivityItem user="Mina" action="tagged release" target="v2.0.4" time="4m ago" />
    </div>
  );
}`,
  },
];

const socialPropsData = [
  { name: "variant", type: '"received" | "sent"', defaultValue: '"received"', description: "Aligns ChatMessage bubbles and switches between surface and inverted contrast.", required: false },
  { name: "replyTo", type: "{ sender: string; excerpt: string }", defaultValue: "-", description: "Optional hairline quote block rendered above the message bubble.", required: false },
  { name: "ChatTypingIndicator", type: "{ names?: string[] }", defaultValue: "-", description: "Harmonic 3-bar typing indicator formatted by active sender names.", required: false },
  { name: "ChatInput", type: "{ onSend, quickReplies, replyingTo, maxLength }", defaultValue: "-", description: "Composer bar supporting Enter-to-send, quick replies, and live character count.", required: false },
  { name: "CommentThread", type: "{ comments, onReply }", defaultValue: "-", description: "Nested thread supporting inline interactive reply drafts.", required: false },
  { name: "ReactionBar", type: "{ reactions, onReact }", defaultValue: "-", description: "Interactive icon reaction counters with expandable + reaction picker.", required: false },
  { name: "NotificationCenter", type: "{ notifications, onMarkAllRead, onItemClick }", defaultValue: "-", description: "Filterable All/Unread notification list with read toggles.", required: false },
];

export function SocialSection() {
  return (
    <section id="social" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which social & chat primitive"
        items={[
          { label: "ChatMessage + ChatInput", description: "Support threads, team channels, and AI assistant conversations with quote replies." },
          { label: "CommentThread", description: "Review discussions, pull request notes, and nested documentation feedback." },
          { label: "NotificationCenter", description: "Workspace alert inboxes requiring All/Unread filtering and batch read marking." },
          { label: "UserProfileCard / OnlineUsersList", description: "Member popovers, contributor rosters, and live availability indicators." },
          { label: "ReactionBar / ShareSheet", description: "Lightweight emoji-free icon feedback counters and link distribution panels." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={ChatMessagePlayground}
          componentName="ChatMessage"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["received", "sent"],
              defaultValue: "received",
              description: "Message direction and bubble contrast",
            },
            {
              name: "sender",
              type: "text",
              defaultValue: "Mina Kato",
              description: "Author display name",
            },
            {
              name: "message",
              type: "text",
              defaultValue: "Schema migration #184 passed CI checks across all 4 clusters.",
              description: "Message text inside ChatMessageContent",
            },
            {
              name: "time",
              type: "text",
              defaultValue: "10:42",
              description: "Monospaced timestamp",
            },
            {
              name: "status",
              type: "select",
              options: ["sent", "delivered", "read"],
              defaultValue: "read",
              description: "Delivery status shown on sent messages",
            },
            {
              name: "isOnline",
              type: "boolean",
              defaultValue: true,
              description: "Presence indicator on sender avatar",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {examples.map((item) => (
          <div key={item.name} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[180px] items-center justify-center rounded-xl border border-border bg-background p-6"
              >
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={socialPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard-Operable Actions:</strong> Notification rows, reply forms, reaction pills, and share triggers are native buttons with visible <code className="text-primary font-mono text-[10px]">focus-visible</code> rings and <code className="text-primary font-mono text-[10px]">aria-pressed</code> state.</li>
          <li><strong>Live Typing Updates:</strong> <code className="text-primary font-mono text-[10px]">ChatTypingIndicator</code> announces status politely via <code className="text-primary font-mono text-[10px]">role="status"</code> and <code className="text-primary font-mono text-[10px]">aria-live="polite"</code>.</li>
          <li><strong>Explicit Status Labels:</strong> Team presence lists pair semantic status dots with explicit text labels (<code className="text-primary font-mono text-[10px]">online</code>, <code className="text-primary font-mono text-[10px]">away</code>, <code className="text-primary font-mono text-[10px]">busy</code>) so status never depends on color alone.</li>
        </ul>
      </div>
    </section>
  );
}

export default SocialSection;
