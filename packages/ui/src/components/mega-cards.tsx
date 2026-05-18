"use client"

import * as React from "react"
import { Heart, Share2, Calendar, MapPin, Star } from "lucide-react"

// 1. ImageCard
export const ImageCard = ({ src, title, subtitle }: any) => (
  <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground">
    <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
      {src ? <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} /> : <div className="w-full h-full bg-muted-foreground/20" />}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
)

// 2. ProfileCard
export const ProfileCard = ({ name, role, avatar }: any) => (
  <div className="flex flex-col items-center p-6 text-center rounded-xl border bg-card shadow-sm">
    <div className="w-24 h-24 rounded-full bg-muted mb-4 overflow-hidden border-4 border-background shadow-md">
      {avatar && <img src={avatar} className="w-full h-full object-cover" alt={name} />}
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-sm text-muted-foreground mb-4">{role}</p>
    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium w-full hover:bg-primary/90 transition-colors">Follow</button>
  </div>
)

// 3. ProductCard
export const ProductCard = ({ title, price, category, src }: any) => (
  <div className="rounded-xl border bg-card p-4 flex flex-col gap-3 group">
    <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden relative">
      {src && <img src={src} className="w-full h-full object-cover" alt={title} />}
      <button className="absolute top-2 right-2 p-2 bg-background/50 backdrop-blur rounded-full hover:bg-background transition-colors"><Heart className="w-4 h-4" /></button>
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-1">{category}</p>
      <h3 className="font-medium truncate">{title}</h3>
      <p className="font-bold text-lg mt-1">${price}</p>
    </div>
  </div>
)

// 4. ArticleCard
export const ArticleCard = ({ title, excerpt, date }: any) => (
  <div className="p-6 rounded-xl border bg-card flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer">
    <span className="text-xs font-medium text-primary">{date}</span>
    <h3 className="text-xl font-bold leading-tight">{title}</h3>
    <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
    <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm">
      <span className="font-medium">Read more →</span>
      <button><Share2 className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
    </div>
  </div>
)

// 5. StatCardSimple
export const StatCardSimple = ({ label, value, trend }: any) => (
  <div className="p-5 rounded-xl border bg-card">
    <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-bold">{value}</h4>
      <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
  </div>
)

// 6. PricingCardBasic
export const PricingCardBasic = ({ name, price, features }: any) => (
  <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center">
    <h3 className="text-xl font-medium mb-2">{name}</h3>
    <div className="mb-6"><span className="text-4xl font-bold">${price}</span><span className="text-muted-foreground">/mo</span></div>
    <ul className="space-y-3 w-full mb-8 text-sm">
      {features.map((f: string, i: number) => <li key={i} className="text-muted-foreground border-b pb-2 last:border-0">{f}</li>)}
    </ul>
    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium mt-auto">Subscribe</button>
  </div>
)

// 7. WeatherCard
export const WeatherCard = ({ city, temp, condition }: any) => (
  <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h3 className="text-2xl font-bold">{city}</h3>
        <p className="opacity-80">{condition}</p>
      </div>
      <div className="text-5xl font-light">{temp}°</div>
    </div>
    <div className="flex gap-4 opacity-90 text-sm">
      <span>H: {temp + 4}°</span>
      <span>L: {temp - 3}°</span>
    </div>
  </div>
)

// 8. EventCard
export const EventCard = ({ title, date, location }: any) => (
  <div className="flex p-4 rounded-xl border bg-card gap-4">
    <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg px-4 py-2 min-w-[70px]">
      <span className="text-xs uppercase font-bold">{date.split(' ')[0]}</span>
      <span className="text-2xl font-black">{date.split(' ')[1]}</span>
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
      <div className="flex items-center text-sm text-muted-foreground gap-1">
        <MapPin className="w-3 h-3" /> {location}
      </div>
    </div>
  </div>
)

// 9. TestimonialCardBasic
export const TestimonialCardBasic = ({ text, author }: any) => (
  <div className="p-6 rounded-xl border bg-muted/30 italic relative">
    <span className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">"</span>
    <p className="relative z-10 text-muted-foreground mb-4 pt-4">{text}</p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/20" />
      <span className="font-semibold text-sm not-italic">{author}</span>
    </div>
  </div>
)

// 10. InteractiveCard
export const InteractiveCard = ({ title, description }: any) => (
  <div className="group p-6 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground flex items-center justify-center mb-4 transition-colors">
      <Star className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">{description}</p>
  </div>
)
