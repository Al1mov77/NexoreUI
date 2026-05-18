"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { ChatMessage, ChatInput, UserProfileCard, CommentThread, ReactionBar, ActivityItem, SocialPost, OnlineUsersList, ShareSheet, NotificationCenter } from "nexoreui";

const variants = [
  {
    name: "Chat Message",
    component: <div className="p-4 w-full flex flex-col gap-4"><ChatMessage message="Hello! How are you?" sender="Alice" time="10:42 AM" /><ChatMessage message="I am doing great, thanks!" sender="You" time="10:43 AM" isOwn={true} /></div>,
    code: `import { ChatMessage } from "nexoreui"\n\n<ChatMessage message="Hello!" sender="Alice" time="10:42 AM" />\n<ChatMessage message="Hi!" sender="You" time="10:43 AM" isOwn />`
  },
  {
    name: "Chat Input",
    component: <div className="p-4 w-full"><ChatInput placeholder="Message #general..." /></div>,
    code: `import { ChatInput } from "nexoreui"\n\n<ChatInput placeholder="Type a message..." />`
  },
  {
    name: "User Profile Card",
    component: <div className="p-4 w-full flex justify-center"><UserProfileCard name="Jane Doe" username="@janedoe" bio="Frontend Developer & Designer" stats={[{label: "Followers", value: "1.2K"}, {label: "Following", value: "340"}]} isFollowing={true} /></div>,
    code: `import { UserProfileCard } from "nexoreui"\n\n<UserProfileCard name="Jane Doe" username="@janedoe" bio="..." stats={[...]} isFollowing />`
  },
  {
    name: "Comment Thread",
    component: <div className="p-4 w-full"><CommentThread comments={[{author: "Alice", text: "Great post!", time: "2h ago"}]} /></div>,
    code: `import { CommentThread } from "nexoreui"\n\n<CommentThread comments={[{author: "Alice", text: "...", ...}]} />`
  },
  {
    name: "Reaction Bar",
    component: <div className="p-4 w-full flex justify-center"><ReactionBar reactions={[{emoji: "👍", count: 12, active: true}, {emoji: "❤️", count: 5}, {emoji: "😂", count: 2}]} /></div>,
    code: `import { ReactionBar } from "nexoreui"\n\n<ReactionBar reactions={[{emoji: "👍", count: 12, active: true}, ...]} />`
  },
  {
    name: "Activity Item",
    component: <div className="p-4 w-full"><ActivityItem user="Alice" action="starred your repository" target="NexoreUI" time="5m ago" /></div>,
    code: `import { ActivityItem } from "nexoreui"\n\n<ActivityItem user="Alice" action="starred" target="repo" time="5m ago" />`
  },
  {
    name: "Social Post",
    component: <div className="p-4 w-full flex justify-center"><SocialPost author="John Smith" handle="@johnsmith" content="Just launched my new project! Check it out 🚀" time="2h ago" likes={42} comments={12} shares={5} /></div>,
    code: `import { SocialPost } from "nexoreui"\n\n<SocialPost author="John" handle="@john" content="..." likes={42} />`
  },
  {
    name: "Online Users List",
    component: <div className="p-4 w-full max-w-xs"><OnlineUsersList users={[{name: "Alice", status: "online"}, {name: "Bob", status: "away"}, {name: "Charlie", status: "offline"}]} /></div>,
    code: `import { OnlineUsersList } from "nexoreui"\n\n<OnlineUsersList users={[...]} />`
  },
  {
    name: "Share Sheet",
    component: <div className="p-4 w-full flex justify-center"><ShareSheet url="https://nexoreui.com" title="Check out this awesome UI library!" /></div>,
    code: `import { ShareSheet } from "nexoreui"\n\n<ShareSheet url="https://nexoreui.com" title="..." />`
  },
  {
    name: "Notification Center",
    component: <div className="p-4 w-full flex justify-center"><NotificationCenter notifications={[{title: "New Follower", message: "Alice started following you", time: "10m ago", read: false}, {title: "System Update", message: "Maintenance completed", time: "1h ago", read: true}]} /></div>,
    code: `import { NotificationCenter } from "nexoreui"\n\n<NotificationCenter notifications={[...]} />`
  }
];

export function SocialSection() {
  return (
    <section id="social" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social & Chat</h2>
          <p className="text-muted-foreground">Components for building social and real-time apps.</p>
        </div>
      </div>

      <div className="space-y-12">
        {variants.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
