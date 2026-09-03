"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBody,
  ChatMessageHeader,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageContent,
  ChatMessageStatus,
  ChatInput,
  ChatInputField,
  ChatInputActions,
  ChatInputAction,
  ChatInputSubmit,
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
  CommentItem,
  CommentAvatar,
  CommentBody,
  CommentHeader,
  CommentAuthor,
  CommentTime,
  CommentText,
  CommentActions,
  CommentReply,
  SocialPost,
  SocialPostHeader,
  SocialPostAvatar,
  SocialPostAuthor,
  SocialPostHandle,
  SocialPostTime,
  SocialPostContent,
  SocialPostActions,
  SocialPostAction,
  ReactionBar,
  ReactionItem,
  ReactionAdd,
  ActivityItem,
  OnlineUsersList,
  ShareSheet,
  NotificationCenter,
  Button
} from "nexoreui";
import {
  MessageSquare,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Terminal,
  Paperclip,
  Smile,
  Send,
  User,
  Users,
  Bell,
  Check,
  CheckCheck
} from "lucide-react";

export function SocialSection() {
  // Tab for Live Playground
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "post">("chat");

  // Chat playground state
  const [chatVariant, setChatVariant] = useState<"sent" | "received">("received");
  const [chatSender, setChatSender] = useState<string>("Alice");
  const [chatMessage, setChatMessage] = useState<string>("Hey! The new compound architecture in NexoreUI looks incredible 🔥");
  const [chatTime, setChatTime] = useState<string>("10:42 AM");
  const [chatStatus, setChatStatus] = useState<"sent" | "delivered" | "read">("read");
  const [chatIsOnline, setChatIsOnline] = useState<boolean>(true);

  // Profile playground state
  const [profileName, setProfileName] = useState<string>("Elena Rostova");
  const [profileHandle, setProfileHandle] = useState<string>("@elena_ui");
  const [profileBio, setProfileBio] = useState<string>("Design Systems Engineer @Nexore. Crafting fluid, accessible web interfaces.");
  const [profileFollowers, setProfileFollowers] = useState<string>("14.2K");
  const [profileFollowing, setProfileFollowing] = useState<string>("284");
  const [profileGradient, setProfileGradient] = useState<string>("bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Post playground state
  const [postAuthor, setPostAuthor] = useState<string>("Alex Morgan");
  const [postHandle, setPostHandle] = useState<string>("@alexm");
  const [postContent, setPostContent] = useState<string>("Compound components give you full composability — no more endless prop passing! Check out the new ChatMessage and UserProfile primitives in NexoreUI 🚀");
  const [postLikes, setPostLikes] = useState<number>(128);
  const [postComments, setPostComments] = useState<number>(24);
  const [postShares, setPostShares] = useState<number>(16);

  // Examples pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dynamic code generators
  const generateChatCode = () => {
    return `import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBody,
  ChatMessageHeader,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageContent,
  ChatMessageStatus
} from "nexoreui";

export default function ChatDemo() {
  return (
    <ChatMessage variant="${chatVariant}">
      <ChatMessageAvatar fallback="${chatSender.charAt(0)}" ${chatIsOnline ? "isOnline " : ""}/>
      <ChatMessageBody>
        <ChatMessageHeader>
          <ChatMessageSender>${chatSender}</ChatMessageSender>
          <ChatMessageTime>${chatTime}</ChatMessageTime>
        </ChatMessageHeader>
        <ChatMessageContent>
          ${chatMessage}
        </ChatMessageContent>
        <ChatMessageStatus status="${chatStatus}" />
      </ChatMessageBody>
    </ChatMessage>
  );
}`;
  };

  const generateProfileCode = () => {
    return `import {
  UserProfileCard,
  UserProfileCover,
  UserProfileAvatar,
  UserProfileInfo,
  UserProfileName,
  UserProfileHandle,
  UserProfileBio,
  UserProfileStats,
  UserProfileStat,
  UserProfileFollowButton
} from "nexoreui";

export default function ProfileDemo() {
  return (
    <UserProfileCard>
      <UserProfileCover gradient="${profileGradient}" />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-9 mb-3">
          <UserProfileAvatar fallback="${profileName.charAt(0)}" />
          <UserProfileFollowButton
            following={${isFollowing}}
            onClick={() => {}}
          />
        </div>

        <UserProfileInfo>
          <UserProfileName>${profileName}</UserProfileName>
          <UserProfileHandle>${profileHandle}</UserProfileHandle>
        </UserProfileInfo>

        <UserProfileBio>
          ${profileBio}
        </UserProfileBio>

        <UserProfileStats>
          <UserProfileStat label="Followers" value="${profileFollowers}" />
          <UserProfileStat label="Following" value="${profileFollowing}" />
        </UserProfileStats>
      </div>
    </UserProfileCard>
  );
}`;
  };

  const generatePostCode = () => {
    return `import {
  SocialPost,
  SocialPostHeader,
  SocialPostAvatar,
  SocialPostAuthor,
  SocialPostHandle,
  SocialPostTime,
  SocialPostContent,
  SocialPostActions,
  SocialPostAction
} from "nexoreui";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostDemo() {
  return (
    <SocialPost>
      <SocialPostHeader>
        <SocialPostAvatar fallback="${postAuthor.charAt(0)}" />
        <div className="flex-1 min-w-0">
          <SocialPostAuthor>${postAuthor}</SocialPostAuthor>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SocialPostHandle>${postHandle}</SocialPostHandle>
            <span>·</span>
            <SocialPostTime>2h ago</SocialPostTime>
          </div>
        </div>
      </SocialPostHeader>

      <SocialPostContent>
        ${postContent}
      </SocialPostContent>

      <SocialPostActions>
        <SocialPostAction
          icon={<Heart className="w-4 h-4" />}
          label={${postLikes}}
        />
        <SocialPostAction
          icon={<MessageCircle className="w-4 h-4" />}
          label={${postComments}}
        />
        <SocialPostAction
          icon={<Share2 className="w-4 h-4" />}
          label={${postShares}}
        />
      </SocialPostActions>
    </SocialPost>
  );
}`;
  };

  const chatPropsData = [
    {
      name: "variant",
      type: '"sent" | "received"',
      defaultValue: '"received"',
      description: "Sets the visual layout, alignment, and accent styling of the chat bubble.",
      required: false,
    },
    {
      name: "isOwn",
      type: "boolean",
      defaultValue: "false",
      description: "Convenience shortcut equivalent to variant='sent'.",
      required: false,
    },
    {
      name: "ChatMessageAvatar",
      type: "Component",
      defaultValue: "-",
      description: "Displays user profile picture with optional fallback initials and isOnline indicator dot.",
      required: false,
    },
    {
      name: "ChatMessageBody",
      type: "Component",
      defaultValue: "-",
      description: "Flex container wrapping the header, text content bubble, and status indicators.",
      required: false,
    },
    {
      name: "ChatMessageContent",
      type: "Component",
      defaultValue: "-",
      description: "The themed bubble element displaying the message text with responsive rounded corners.",
      required: false,
    },
    {
      name: "ChatMessageStatus",
      type: 'status: "sent" | "delivered" | "read"',
      defaultValue: '"read"',
      description: "Renders animated checkmark delivery state indicators.",
      required: false,
    },
  ];

  const profilePropsData = [
    {
      name: "UserProfileCover",
      type: "gradient?: string, imageSrc?: string",
      defaultValue: "violet gradient",
      description: "Header banner element supporting CSS gradient classes or custom banner images.",
      required: false,
    },
    {
      name: "UserProfileAvatar",
      type: "src?: string, fallback?: string",
      defaultValue: "-",
      description: "Prominent avatar overlapping the cover banner with thick card border ring.",
      required: false,
    },
    {
      name: "UserProfileInfo",
      type: "Component",
      defaultValue: "-",
      description: "Container for author name, username handle, and verification badges.",
      required: false,
    },
    {
      name: "UserProfileStats",
      type: "Component",
      defaultValue: "-",
      description: "Metrics row displaying followers, following, and projects count.",
      required: false,
    },
    {
      name: "UserProfileFollowButton",
      type: "following?: boolean, onClick?: () => void",
      defaultValue: "false",
      description: "Interactive button with animated state transitions for follow / unfollow actions.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "1. Two-Way Interactive Chat Dialogue with Input",
      component: (
        <div className="w-full max-w-md p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
          <div className="space-y-3">
            <ChatMessage variant="received">
              <ChatMessageAvatar fallback="A" isOnline />
              <ChatMessageBody>
                <ChatMessageHeader>
                  <ChatMessageSender>Alice</ChatMessageSender>
                  <ChatMessageTime>10:42 AM</ChatMessageTime>
                </ChatMessageHeader>
                <ChatMessageContent>
                  Hey! Did you see the new compound architecture in NexoreUI?
                </ChatMessageContent>
              </ChatMessageBody>
            </ChatMessage>

            <ChatMessage variant="sent">
              <ChatMessageAvatar fallback="Y" />
              <ChatMessageBody>
                <ChatMessageHeader>
                  <ChatMessageSender>You</ChatMessageSender>
                  <ChatMessageTime>10:43 AM</ChatMessageTime>
                </ChatMessageHeader>
                <ChatMessageContent>
                  Yes! It feels exactly like Radix and Shadcn. Super flexible!
                </ChatMessageContent>
                <ChatMessageStatus status="read" />
              </ChatMessageBody>
            </ChatMessage>
          </div>

          <ChatInput
            placeholder="Write a reply..."
            onSend={(msg: string) => alert(`Sent: ${msg}`)}
          />
        </div>
      ),
      code: `import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBody,
  ChatMessageHeader,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageContent,
  ChatMessageStatus,
  ChatInput
} from "nexoreui";

export default function ChatDialogueDemo() {
  return (
    <div className="space-y-4">
      {/* Received Message */}
      <ChatMessage variant="received">
        <ChatMessageAvatar fallback="A" isOnline />
        <ChatMessageBody>
          <ChatMessageHeader>
            <ChatMessageSender>Alice</ChatMessageSender>
            <ChatMessageTime>10:42 AM</ChatMessageTime>
          </ChatMessageHeader>
          <ChatMessageContent>
            Hey! Did you see the new compound architecture in NexoreUI?
          </ChatMessageContent>
        </ChatMessageBody>
      </ChatMessage>

      {/* Sent Message */}
      <ChatMessage variant="sent">
        <ChatMessageAvatar fallback="Y" />
        <ChatMessageBody>
          <ChatMessageHeader>
            <ChatMessageSender>You</ChatMessageSender>
            <ChatMessageTime>10:43 AM</ChatMessageTime>
          </ChatMessageHeader>
          <ChatMessageContent>
            Yes! It feels exactly like Radix and Shadcn. Super flexible!
          </ChatMessageContent>
          <ChatMessageStatus status="read" />
        </ChatMessageBody>
      </ChatMessage>

      {/* Input bar */}
      <ChatInput placeholder="Write a reply..." />
    </div>
  );
}`,
    },
    {
      name: "2. Creator Profile Card with Compound Structure",
      component: (
        <UserProfileCard className="max-w-sm">
          <UserProfileCover gradient="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500" />
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-9 mb-3">
              <UserProfileAvatar fallback="J" />
              <UserProfileFollowButton following={true} />
            </div>

            <UserProfileInfo>
              <UserProfileName>Jane Doe</UserProfileName>
              <UserProfileHandle>@janedoe</UserProfileHandle>
            </UserProfileInfo>

            <UserProfileBio>
              Full-stack developer & open-source enthusiast. Building polished React design systems.
            </UserProfileBio>

            <UserProfileStats>
              <UserProfileStat label="Followers" value="1.2K" />
              <UserProfileStat label="Following" value="340" />
              <UserProfileStat label="Repos" value="48" />
            </UserProfileStats>
          </div>
        </UserProfileCard>
      ),
      code: `import {
  UserProfileCard,
  UserProfileCover,
  UserProfileAvatar,
  UserProfileInfo,
  UserProfileName,
  UserProfileHandle,
  UserProfileBio,
  UserProfileStats,
  UserProfileStat,
  UserProfileFollowButton
} from "nexoreui";

export default function ProfileCardDemo() {
  return (
    <UserProfileCard>
      <UserProfileCover gradient="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500" />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-9 mb-3">
          <UserProfileAvatar fallback="J" />
          <UserProfileFollowButton following={true} />
        </div>

        <UserProfileInfo>
          <UserProfileName>Jane Doe</UserProfileName>
          <UserProfileHandle>@janedoe</UserProfileHandle>
        </UserProfileInfo>

        <UserProfileBio>
          Full-stack developer & open-source enthusiast.
        </UserProfileBio>

        <UserProfileStats>
          <UserProfileStat label="Followers" value="1.2K" />
          <UserProfileStat label="Following" value="340" />
        </UserProfileStats>
      </div>
    </UserProfileCard>
  );
}`,
    },
    {
      name: "3. Social Media Feed Post with Interactive Actions",
      component: (
        <SocialPost className="max-w-md">
          <SocialPostHeader>
            <SocialPostAvatar fallback="J" />
            <div className="flex-1 min-w-0">
              <SocialPostAuthor>John Smith</SocialPostAuthor>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SocialPostHandle>@johnsmith</SocialPostHandle>
                <span>·</span>
                <SocialPostTime>2h ago</SocialPostTime>
              </div>
            </div>
          </SocialPostHeader>

          <SocialPostContent>
            Just launched my new open-source library powered by NexoreUI components! Check it out and let me know your thoughts 🚀
          </SocialPostContent>

          <SocialPostActions>
            <SocialPostAction icon={<Heart className="w-4 h-4 fill-rose-500 text-rose-500" />} label={42} active />
            <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={12} />
            <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={5} />
          </SocialPostActions>
        </SocialPost>
      ),
      code: `import {
  SocialPost,
  SocialPostHeader,
  SocialPostAvatar,
  SocialPostAuthor,
  SocialPostHandle,
  SocialPostTime,
  SocialPostContent,
  SocialPostActions,
  SocialPostAction
} from "nexoreui";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function SocialPostDemo() {
  return (
    <SocialPost>
      <SocialPostHeader>
        <SocialPostAvatar fallback="J" />
        <div className="flex-1 min-w-0">
          <SocialPostAuthor>John Smith</SocialPostAuthor>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SocialPostHandle>@johnsmith</SocialPostHandle>
            <span>·</span>
            <SocialPostTime>2h ago</SocialPostTime>
          </div>
        </div>
      </SocialPostHeader>

      <SocialPostContent>
        Just launched my new open-source library powered by NexoreUI! 🚀
      </SocialPostContent>

      <SocialPostActions>
        <SocialPostAction icon={<Heart className="w-4 h-4" />} label={42} active />
        <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={12} />
        <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={5} />
      </SocialPostActions>
    </SocialPost>
  );
}`,
    },
    {
      name: "4. Nested Comment Thread",
      component: (
        <div className="w-full max-w-md p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
          <CommentThread
            comments={[
              {
                author: "Alice",
                text: "The new compound component design pattern is so much better than passing 10 monolithic props!",
                time: "2h ago",
                replies: [
                  {
                    author: "Bob",
                    text: "Totally agree! It gives us total control over where each subcomponent renders.",
                    time: "1h ago"
                  }
                ]
              }
            ]}
          />
        </div>
      ),
      code: `import { CommentThread } from "nexoreui";

export default function CommentsDemo() {
  return (
    <CommentThread
      comments={[
        {
          author: "Alice",
          text: "The compound component design pattern is so much better!",
          time: "2h ago",
          replies: [
            {
              author: "Bob",
              text: "Totally agree! Full control over subcomponents.",
              time: "1h ago"
            }
          ]
        }
      ]}
    />
  );
}`,
    },
    {
      name: "5. Emoji Reaction Bar with Interactive Counters",
      component: (
        <div className="p-4 flex items-center justify-center w-full">
          <ReactionBar
            reactions={[
              { emoji: "👍", count: 24, active: true },
              { emoji: "❤️", count: 18, active: true },
              { emoji: "🚀", count: 9 },
              { emoji: "🔥", count: 15 },
              { emoji: "🎉", count: 6 },
            ]}
          />
        </div>
      ),
      code: `import { ReactionBar } from "nexoreui";

export default function ReactionDemo() {
  return (
    <ReactionBar
      reactions={[
        { emoji: "👍", count: 24, active: true },
        { emoji: "❤️", count: 18, active: true },
        { emoji: "🚀", count: 9 },
        { emoji: "🔥", count: 15 }
      ]}
      onReact={(emoji) => console.log(emoji)}
    />
  );
}`,
    },
    {
      name: "6. Activity Feed & Online Team Members",
      component: (
        <div className="w-full max-w-md space-y-4">
          <OnlineUsersList
            users={[
              { name: "Alice Watson", status: "online" },
              { name: "Marcus Chen", status: "online" },
              { name: "Sarah Connor", status: "away" },
              { name: "David Miller", status: "offline" }
            ]}
          />
          <ActivityItem
            user="Alice"
            action="starred repository"
            target="NexoreUI"
            time="5m ago"
          />
        </div>
      ),
      code: `import { OnlineUsersList, ActivityItem } from "nexoreui";

export default function PresenceDemo() {
  return (
    <div className="space-y-4">
      <OnlineUsersList
        users={[
          { name: "Alice Watson", status: "online" },
          { name: "Marcus Chen", status: "online" },
          { name: "Sarah Connor", status: "away" }
        ]}
      />
      <ActivityItem
        user="Alice"
        action="starred repository"
        target="NexoreUI"
        time="5m ago"
      />
    </div>
  );
}`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="social" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Suites — Compound Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Social & Community Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          Production-grade chat bubbles, social posts, user cards, and interactive community feeds.
          Re-architected with composable compound primitives (inspired by Radix UI & Shadcn) with both
          named and dot-notation exports.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add social</span>
        </div>
      </div>

      {/* Interactive Live Playground (Live Props / PropsEditor) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive Live Playground
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a flagship component tab and customize live properties with dynamic code generation.
            </p>
          </div>

          {/* Component Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "chat" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chat Message
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "profile" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("post")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "post" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Social Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[380px] flex items-center justify-center p-6 sm:p-10 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden">
            {activeTab === "chat" && (
              <div className="w-full max-w-md space-y-4">
                <ChatMessage variant={chatVariant}>
                  <ChatMessageAvatar fallback={chatSender.charAt(0) || "U"} isOnline={chatIsOnline} />
                  <ChatMessageBody>
                    <ChatMessageHeader>
                      <ChatMessageSender>{chatSender}</ChatMessageSender>
                      <ChatMessageTime>{chatTime}</ChatMessageTime>
                    </ChatMessageHeader>
                    <ChatMessageContent>{chatMessage}</ChatMessageContent>
                    <ChatMessageStatus status={chatStatus} />
                  </ChatMessageBody>
                </ChatMessage>

                <div className="pt-2 border-t border-border/60">
                  <ChatInput
                    placeholder="Type a response..."
                    onSend={(text: string) => alert(`Message submitted: "${text}"`)}
                  />
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <UserProfileCard className="max-w-sm">
                <UserProfileCover gradient={profileGradient} />
                <div className="px-5 pb-5">
                  <div className="flex items-end justify-between -mt-10 mb-3">
                    <UserProfileAvatar fallback={profileName.charAt(0)} status="online" />
                    <UserProfileFollowButton
                      following={isFollowing}
                      onClick={() => setIsFollowing(!isFollowing)}
                    />
                  </div>

                  <UserProfileInfo>
                    <UserProfileName>{profileName}</UserProfileName>
                    <UserProfileHandle>{profileHandle}</UserProfileHandle>
                  </UserProfileInfo>

                  <UserProfileBio>{profileBio}</UserProfileBio>

                  <UserProfileStats>
                    <UserProfileStat label="Followers" value={profileFollowers} />
                    <UserProfileStat label="Following" value={profileFollowing} />
                  </UserProfileStats>
                </div>
              </UserProfileCard>
            )}

            {activeTab === "post" && (
              <SocialPost className="max-w-md">
                <SocialPostHeader>
                  <SocialPostAvatar fallback={postAuthor.charAt(0)} />
                  <div className="flex-1 min-w-0">
                    <SocialPostAuthor>{postAuthor}</SocialPostAuthor>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <SocialPostHandle>{postHandle}</SocialPostHandle>
                      <span>·</span>
                      <SocialPostTime>Just now</SocialPostTime>
                    </div>
                  </div>
                </SocialPostHeader>

                <SocialPostContent>{postContent}</SocialPostContent>

                <SocialPostActions>
                  <SocialPostAction
                    icon={<Heart className="w-4 h-4 fill-rose-500 text-rose-500" />}
                    label={postLikes}
                    active
                  />
                  <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={postComments} />
                  <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={postShares} />
                </SocialPostActions>
              </SocialPost>
            )}
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {activeTab === "chat" && "Chat Props"}
              {activeTab === "profile" && "Profile Props"}
              {activeTab === "post" && "Post Props"}
            </h3>

            {activeTab === "chat" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Message Variant</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["received", "sent"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChatVariant(v)}
                        className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                          chatVariant === v
                            ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Sender Name</label>
                  <input
                    type="text"
                    value={chatSender}
                    onChange={(e) => setChatSender(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Message Text</label>
                  <textarea
                    rows={2}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Delivery Status</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["sent", "delivered", "read"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setChatStatus(s)}
                        className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                          chatStatus === s
                            ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs font-medium text-foreground">Online Status Indicator</label>
                  <button
                    type="button"
                    onClick={() => setChatIsOnline(!chatIsOnline)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      chatIsOnline ? "bg-emerald-500" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                        chatIsOnline ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Handle</label>
                  <input
                    type="text"
                    value={profileHandle}
                    onChange={(e) => setProfileHandle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Bio Description</label>
                  <textarea
                    rows={2}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Followers</label>
                    <input
                      type="text"
                      value={profileFollowers}
                      onChange={(e) => setProfileFollowers(e.target.value)}
                      className="w-full px-3 py-1 rounded-lg border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Following</label>
                    <input
                      type="text"
                      value={profileFollowing}
                      onChange={(e) => setProfileFollowing(e.target.value)}
                      className="w-full px-3 py-1 rounded-lg border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs font-medium text-foreground">Following State</label>
                  <button
                    type="button"
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      isFollowing ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                        isFollowing ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {activeTab === "post" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Author</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Post Content</label>
                  <textarea
                    rows={3}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Likes</label>
                    <input
                      type="number"
                      value={postLikes}
                      onChange={(e) => setPostLikes(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Comments</label>
                    <input
                      type="number"
                      value={postComments}
                      onChange={(e) => setPostComments(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Shares</label>
                    <input
                      type="number"
                      value={postShares}
                      onChange={(e) => setPostShares(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Generated Code */}
        <div className="pt-2">
          <ComponentSource
            sourceCode={
              activeTab === "chat"
                ? generateChatCode()
                : activeTab === "profile"
                ? generateProfileCode()
                : generatePostCode()
            }
          />
        </div>
      </div>

      {/* Props Tables */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            ChatMessage API Reference
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compound components can be imported individually (e.g. ChatMessageAvatar) or accessed via dot-notation (ChatMessage.Avatar).
          </p>
        </div>
        <PropsTable propsData={chatPropsData} />

        <div className="pt-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            UserProfileCard API Reference
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Composable building blocks for profile headers, stat meters, and following states.
          </p>
        </div>
        <PropsTable propsData={profilePropsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Usage Examples & Compound Patterns
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore real-world social feed, messaging, and presence implementations.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[260px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SocialSection;
