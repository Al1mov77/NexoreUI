"use client"

import * as React from "react"
import { Lock, Mail, User, EyeOff, Eye, CreditCard, Calendar, Upload, Search } from "lucide-react"

// 1. LoginFormPro
export const LoginFormPro = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false); setSuccess(true) }, 1500)
  }

  return (
    <div className="w-full max-w-sm p-6 border rounded-2xl bg-card shadow-lg">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold">Welcome back</h2><p className="text-muted-foreground text-sm">Enter your credentials to access your account</p></div>
      {success ? (
        <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-center mb-4 font-medium">Successfully logged in! Redirecting...</div>
      ) : null}
      <div className="space-y-4">
        <div className="space-y-1"><label className="text-sm font-medium">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="m@example.com" /></div></div>
        <div className="space-y-1"><div className="flex justify-between"><label className="text-sm font-medium">Password</label><a href="#" className="text-xs text-primary hover:underline">Forgot password?</a></div><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input type="password" className="w-full pl-9 pr-10 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="••••••••" /><Eye className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" /></div></div>
        <button onClick={handleSubmit} disabled={isLoading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center">
          {isLoading ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Sign In"}
        </button>
      </div>
      <div className="mt-4 text-center text-sm">Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Sign up</a></div>
    </div>
  )
}

// 2. RegisterFormPro
export const RegisterFormPro = () => (
  <div className="w-full max-w-sm p-6 border rounded-2xl bg-card shadow-lg">
    <div className="text-center mb-6"><h2 className="text-2xl font-bold">Create an account</h2><p className="text-muted-foreground text-sm">Start your 14-day free trial</p></div>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-sm font-medium">First name</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Max" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Last name</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Robinson" /></div>
      </div>
      <div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="m@example.com" /></div>
      <div className="space-y-1"><label className="text-sm font-medium">Password</label><input type="password" className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" /></div>
      <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Create Account</button>
    </div>
  </div>
)

// 3. PaymentFormPro
export const PaymentFormPro = () => {
  const [method, setMethod] = React.useState('card')
  return (
    <div className="w-full max-w-md p-6 border rounded-2xl bg-card">
      <h3 className="text-lg font-bold mb-4">Payment Method</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setMethod('card')} className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors ${method === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}`}><CreditCard className="h-6 w-6" /><span className="text-xs font-medium">Card</span></button>
        <button onClick={() => setMethod('paypal')} className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors ${method === 'paypal' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}`}><div className="font-bold text-lg leading-none">P</div><span className="text-xs font-medium">PayPal</span></button>
        <button onClick={() => setMethod('apple')} className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors ${method === 'apple' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}`}><div className="font-bold text-lg leading-none"></div><span className="text-xs font-medium">Apple Pay</span></button>
      </div>
      {method === 'card' ? (
        <div className="space-y-4">
          <div className="space-y-1"><label className="text-sm font-medium">Cardholder Name</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="John Doe" /></div>
          <div className="space-y-1"><label className="text-sm font-medium">Card Number</label><div className="relative"><CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background" placeholder="0000 0000 0000 0000" /></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">Expiry Date</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="MM/YY" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">CVC</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="123" /></div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
          <p className="text-sm text-muted-foreground">You will be redirected to {method === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete your purchase securely.</p>
        </div>
      )}
      <button className="w-full py-2.5 bg-foreground text-background rounded-lg font-medium mt-6">Pay $99.00</button>
    </div>
  )
}

// 4. ProfileSettingsForm
export const ProfileSettingsForm = () => (
  <div className="w-full max-w-md space-y-6">
    <div className="flex items-center gap-6">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border"><User className="h-8 w-8 text-muted-foreground" /></div>
      <div className="flex gap-2"><button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md">Change</button><button className="px-4 py-2 border text-sm font-medium rounded-md">Remove</button></div>
    </div>
    <div className="space-y-4">
      <div className="space-y-1"><label className="text-sm font-medium">Username</label><input className="w-full px-3 py-2 border rounded-md" defaultValue="al1mov77" /></div>
      <div className="space-y-1"><label className="text-sm font-medium">Bio</label><textarea className="w-full px-3 py-2 border rounded-md h-24" defaultValue="Frontend Developer building UI components." /></div>
      <button className="px-4 py-2 bg-foreground text-background font-medium rounded-md">Save Changes</button>
    </div>
  </div>
)

// 5. SubscriptionForm
export const SubscriptionForm = () => (
  <div className="w-full max-w-sm p-1 border rounded-full bg-muted flex">
    <input className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="Enter your email" />
    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-sm">Subscribe</button>
  </div>
)

// 6. ContactFormPro
export const ContactFormPro = () => (
  <div className="w-full space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1"><label className="text-sm">First Name</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
      <div className="space-y-1"><label className="text-sm">Last Name</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
    </div>
    <div className="space-y-1"><label className="text-sm">Email</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
    <div className="space-y-1"><label className="text-sm">Message</label><textarea className="w-full p-2 border rounded-md bg-muted/50 h-32" /></div>
    <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-md">Send Message</button>
  </div>
)

// 7. AdvancedSearchForm
export const AdvancedSearchForm = () => (
  <div className="w-full max-w-2xl bg-card border rounded-xl shadow-lg p-2 flex items-center gap-2">
    <div className="flex-1 flex items-center px-3 border-r"><Search className="h-5 w-5 text-muted-foreground mr-2" /><input className="w-full py-2 bg-transparent outline-none" placeholder="Search properties..." /></div>
    <div className="w-48 px-3 border-r"><select className="w-full bg-transparent py-2 outline-none text-sm"><option>All Categories</option><option>Houses</option><option>Apartments</option></select></div>
    <div className="w-32 px-3"><select className="w-full bg-transparent py-2 outline-none text-sm"><option>Any Price</option><option>$100k - $500k</option></select></div>
    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shrink-0">Search</button>
  </div>
)

// 8. FileUploadForm
export const FileUploadForm = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<File[]>([])

  return (
    <div className="w-full p-6 border-2 border-dashed rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
      <input type="file" multiple className="hidden" ref={inputRef} onChange={(e) => {
        if(e.target.files) setFiles(Array.from(e.target.files))
      }} />
      <div onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center text-center cursor-pointer">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Upload className="h-6 w-6" /></div>
        <h3 className="font-semibold mb-1">Click to upload or drag and drop</h3>
        <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-sm font-bold">Selected Files:</p>
          {files.map((f, i) => (
            <div key={i} className="text-xs p-2 bg-background border rounded flex justify-between">
              <span className="truncate">{f.name}</span>
              <span className="text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 9. FeedbackForm
export const FeedbackForm = () => (
  <div className="w-full max-w-sm p-6 border rounded-xl bg-card space-y-4 text-center">
    <h3 className="font-bold text-lg">How was your experience?</h3>
    <div className="flex justify-center gap-2">
      {['😡', '😕', '😐', '🙂', '😍'].map((emoji, i) => <button key={i} className="text-3xl hover:scale-125 transition-transform opacity-70 hover:opacity-100">{emoji}</button>)}
    </div>
    <textarea className="w-full p-3 border rounded-md text-sm mt-4 resize-none h-20" placeholder="Tell us more (optional)" />
    <button className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-md">Submit Feedback</button>
  </div>
)

// 10. InviteUsersForm
export const InviteUsersForm = () => (
  <div className="w-full border rounded-xl bg-card p-4 space-y-4">
    <div className="flex gap-2">
      <input className="flex-1 p-2 border rounded-md text-sm" placeholder="Email address" />
      <select className="p-2 border rounded-md text-sm bg-background"><option>Member</option><option>Admin</option></select>
      <button className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-md text-sm">Send Invite</button>
    </div>
    <div className="border-t pt-4 space-y-3">
      <h4 className="text-sm font-semibold">Pending Invites</h4>
      <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">john@example.com</span><span className="px-2 py-1 bg-muted rounded text-xs">Member</span></div>
    </div>
  </div>
)
