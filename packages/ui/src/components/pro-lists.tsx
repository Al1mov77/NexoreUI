"use client"

import * as React from "react"
import { Phone, Mail, FileText, Download, Briefcase, MapPin, Clock, MessageSquare, Plus, Check } from "lucide-react"

// 1. ContactList
export const ContactList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">C{i}</div>
          <div><h4 className="font-semibold text-sm">Contact Name {i}</h4><p className="text-xs text-muted-foreground">contact{i}@example.com</p></div>
        </div>
        <div className="flex gap-2 text-muted-foreground"><Phone className="w-4 h-4 hover:text-foreground" /><Mail className="w-4 h-4 hover:text-foreground" /></div>
      </div>
    ))}
  </div>
)

// 2. NotificationList
export const NotificationList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    <div className="p-4 border-b font-bold flex justify-between items-center">Notifications <span className="text-xs font-normal text-primary hover:underline cursor-pointer">Mark all read</span></div>
    {[1, 2, 3].map(i => (
      <div key={i} className={`flex gap-4 p-4 ${i === 1 ? 'bg-primary/5' : ''}`}>
        {i === 1 && <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
        <div className="flex-1"><p className="text-sm"><span className="font-bold">System</span> completed the backup successfully.</p><p className="text-xs text-muted-foreground mt-1">2 hours ago</p></div>
      </div>
    ))}
  </div>
)

// 3. TimelineVertical
export const TimelineVertical = () => (
  <div className="w-full max-w-md p-4">
    <div className="relative border-l-2 border-muted ml-3 space-y-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative pl-6">
          <div className="absolute w-4 h-4 bg-primary rounded-full border-4 border-background -left-[9px] top-1" />
          <h4 className="font-bold text-sm mb-1">Project Milestone {i}</h4>
          <p className="text-xs text-muted-foreground mb-2">October {10 + i}, 2025</p>
          <p className="text-sm">Completed the initial design phase and got client approval.</p>
        </div>
      ))}
    </div>
  </div>
)

// 4. StepList
export const StepList = () => (
  <div className="w-full max-w-md space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-sm ${i === 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>{i === 1 ? <Check className="w-4 h-4" /> : i}</div>
        <div><h4 className={`font-bold text-sm ${i === 1 ? '' : 'text-muted-foreground'}`}>Step {i} Title</h4><p className="text-sm text-muted-foreground mt-1">Detailed description of what needs to be done in this step.</p></div>
      </div>
    ))}
  </div>
)

// 5. FAQAccordionList (Visual Mock)
export const FAQAccordionList = () => (
  <div className="w-full max-w-2xl border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4">
        <h4 className="font-bold text-sm mb-2 flex justify-between">How does pricing work? <Plus className="w-4 h-4 text-muted-foreground" /></h4>
        {i === 1 && <p className="text-sm text-muted-foreground mt-2">Pricing is based on the number of users in your workspace. You can upgrade or downgrade at any time.</p>}
      </div>
    ))}
  </div>
)

// 6. FileDownloadList
export const FileDownloadList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card p-4 space-y-3">
    <h3 className="font-bold text-sm mb-4">Attached Files</h3>
    {[1, 2].map(i => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
        <div className="flex items-center gap-3"><FileText className="w-8 h-8 text-primary" /><div><p className="text-sm font-medium">Document-{i}.pdf</p><p className="text-xs text-muted-foreground">2.4 MB</p></div></div>
        <button className="p-2 border bg-background rounded-full hover:text-primary"><Download className="w-4 h-4" /></button>
      </div>
    ))}
  </div>
)

// 7. MessageList
export const MessageList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 p-4 hover:bg-muted/50 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1"><h4 className="font-bold text-sm truncate">Jane Doe</h4><span className="text-xs text-muted-foreground shrink-0">12:30 PM</span></div>
          <p className="text-sm text-muted-foreground truncate">Hey, are we still on for the meeting later today?</p>
        </div>
      </div>
    ))}
  </div>
)

// 8. JobBoardList
export const JobBoardList = () => (
  <div className="w-full max-w-2xl border rounded-xl bg-card divide-y">
    {[1, 2].map(i => (
      <div key={i} className="p-6 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-bold mb-2">Senior React Developer</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Full-time</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Posted 2 days ago</span>
          </div>
        </div>
        <button className="px-6 py-2 border rounded-full text-sm font-bold hover:bg-muted">Apply Now</button>
      </div>
    ))}
  </div>
)

// 9. EventScheduleList
export const EventScheduleList = () => (
  <div className="w-full max-w-lg p-6 bg-card border rounded-xl">
    <h3 className="font-bold text-xl mb-6">Conference Schedule</h3>
    <div className="space-y-6">
      {[1, 2].map(i => (
        <div key={i} className="flex gap-4">
          <div className="text-right w-16 shrink-0"><p className="font-bold">09:00</p><p className="text-xs text-muted-foreground">AM</p></div>
          <div className="w-0.5 bg-primary/20 relative"><div className="absolute top-1 -left-1 w-2.5 h-2.5 rounded-full bg-primary" /></div>
          <div className="pb-6"><h4 className="font-bold text-lg mb-1">Keynote Speech</h4><p className="text-sm text-muted-foreground mb-2">Main Stage</p><div className="flex items-center gap-2 text-xs font-medium bg-muted w-fit px-2 py-1 rounded"><div className="w-4 h-4 bg-primary/20 rounded-full" /> Speaker Name</div></div>
        </div>
      ))}
    </div>
  </div>
)

// 10. RecentCommentsList
export const RecentCommentsList = () => (
  <div className="w-full max-w-md space-y-4">
    {[1, 2].map(i => (
      <div key={i} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
        <div className="flex-1 bg-card border p-3 rounded-2xl rounded-tl-none text-sm">
          <p className="font-bold mb-1">User {i} <span className="font-normal text-muted-foreground text-xs ml-2">1h ago</span></p>
          <p>This is a great article! Thanks for sharing this information.</p>
          <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground"><button className="hover:text-primary flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reply</button></div>
        </div>
      </div>
    ))}
  </div>
)
