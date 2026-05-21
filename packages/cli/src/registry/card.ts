export const card = {
  name: "card",
  dependencies: [
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "card.tsx",
  content: `'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, Share2, MapPin, Star } from "lucide-react"

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow-sm hover:shadow-md",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg",
        gradient: "bg-gradient-to-br from-violet-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5",
        glow: "bg-card border-2 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)]",
        // New variants
        bento: "border border-border/60 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-md hover:shadow-lg hover:border-primary/30 relative",
        spotlight: "border bg-card text-card-foreground relative hover:border-primary/20",
        flip: "bg-transparent border-0 shadow-none overflow-visible relative",
        tilt: "border bg-card text-card-foreground shadow-md",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1.5 hover:shadow-lg",
        glow: "hover:border-primary/50 hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)]",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    }
  }
)

/**
 * Props for the Card component
 */
export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether to enable hover spring animations
   * @default true
   */
  animate?: boolean;
  /**
   * The main title of the card
   */
  title?: React.ReactNode;
  /**
   * The subtitle or description of the card
   */
  description?: React.ReactNode;
  /**
   * Content to render in the card footer area
   */
  footer?: React.ReactNode;
  /**
   * An optional image URL to display at the top of the card
   */
  image?: string;
  /**
   * HTML alternative text for the image
   */
  imageAlt?: string;
  /**
   * Back content displayed when using the \`flip\` variant on hover
   */
  backContent?: React.ReactNode;
  /**
   * Custom radial spotlight background color (e.g., rgba(168, 85, 247, 0.15))
   * @default "rgba(139, 92, 246, 0.15)"
   */
  spotlightColor?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hover,
      animate = true,
      title,
      description,
      footer,
      image,
      imageAlt,
      backContent,
      spotlightColor = "rgba(139, 92, 246, 0.15)",
      children,
      ...props
    },
    ref
  ) => {
    const isCompound = !title && !description && !footer && !image;
    
    // Feature toggles based on variants
    const isSpotlight = variant === "spotlight";
    const isFlip = variant === "flip";
    const isTilt = variant === "tilt";

    // Spotlight mouse tracking state
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const handleMouseMoveSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSpotlight) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      setMousePos({ x: clientX - left, y: clientY - top });
    };

    // Tilt mouse tracking state
    const [tiltPos, setTiltPos] = React.useState({ rotateX: 0, rotateY: 0 });
    const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTilt) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const maxTilt = 12; // degrees max rotation
      const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt;
      const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
      setTiltPos({ rotateX, rotateY });
    };

    const handleMouseLeaveTilt = () => {
      if (!isTilt) return;
      setTiltPos({ rotateX: 0, rotateY: 0 });
    };

    // Flip card hover state
    const [isFlipped, setIsFlipped] = React.useState(false);

    const baseContent = isCompound ? (
      children
    ) : (
      <>
        {image && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
            <img src={image} alt={imageAlt || (typeof title === 'string' ? title : 'Card image')} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
          </div>
        )}
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        {children && <CardContent>{children as React.ReactNode}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </>
    );

    // Destructure custom props to avoid DOM validation warnings
    const { ...htmlProps } = props;

    // Flip Variant Render
    if (isFlip) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, hover, className }), "perspective-1000 w-full h-full")}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          <motion.div
            className="relative w-full h-full transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden border bg-card text-card-foreground rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
              {baseContent}
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 border bg-gradient-to-br from-primary/10 to-primary/5 text-card-foreground rounded-2xl shadow-sm flex flex-col p-6 items-center justify-center text-center overflow-hidden">
              {backContent || (
                <div className="text-sm font-medium text-muted-foreground">
                  Flip side content placeholder
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    // Spotlight Variant Render Extra Element
    const spotlightEffect = isSpotlight && (
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(400px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
        }}
      />
    );

    // Build the resolved element attributes
    const cardClass = cn(cardVariants({ variant, hover: isFlip || isTilt ? "none" : hover, className }), isSpotlight && "group");

    if (animate || isTilt) {
      return (
        <motion.div
          ref={ref}
          className={cardClass}
          onMouseMove={(e) => {
            if (isSpotlight) handleMouseMoveSpotlight(e);
            if (isTilt) handleMouseMoveTilt(e);
          }}
          onMouseLeave={() => {
            if (isTilt) handleMouseLeaveTilt();
          }}
          animate={
            isTilt
              ? { rotateX: tiltPos.rotateX, rotateY: tiltPos.rotateY }
              : undefined
          }
          whileHover={isTilt ? undefined : { scale: 1.015 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...(htmlProps as any)}
        >
          {spotlightEffect}
          {baseContent}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClass}
        {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {baseContent}
      </div>
    );
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-xl bg-gradient-to-br from-foreground to-foreground/75 bg-clip-text text-transparent", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed mt-1", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 leading-relaxed text-sm text-foreground/90", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-border/10 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glass" {...props}>
      {children}
    </Card>
  )
);
GlassCard.displayName = "GlassCard";

export const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glow" {...props}>
      {children}
    </Card>
  )
);
GlowCard.displayName = "GlowCard";

export const GradientCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="gradient" {...props}>
      {children}
    </Card>
  )
);
GradientCard.displayName = "GradientCard";

export const HoverCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} hover="lift" {...props}>
      {children}
    </Card>
  )
);
HoverCard.displayName = "HoverCard";

export const SpotlightCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="spotlight" {...props}>
      {children}
    </Card>
  )
);
SpotlightCard.displayName = "SpotlightCard";

// ============================================
// Consolidated Legacy/Special Cards for Compatibility
// ============================================

export const ImageCard = ({ src, title, subtitle, imageUrl, description }: any) => {
  const finalSrc = src || imageUrl;
  const finalTitle = title;
  const finalSubtitle = subtitle || description;
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
        {finalSrc ? (
          <img
            src={finalSrc}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={typeof finalTitle === "string" ? finalTitle : "Image"}
          />
        ) : (
          <div className="w-full h-full bg-muted-foreground/20" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{finalTitle}</h3>
        <p className="text-sm text-muted-foreground">{finalSubtitle}</p>
      </div>
    </div>
  );
};

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

export const ProductCard = ({ title, price, category, src }: any) => (
  <div className="rounded-xl border bg-card p-4 flex flex-col gap-3 group">
    <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden relative">
      {src && <img src={src} className="w-full h-full object-cover" alt={title} />}
      <button className="absolute top-2 right-2 p-2 bg-background/50 backdrop-blur rounded-full hover:bg-background transition-colors"><Heart className="w-4 h-4" /></button>
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-1">{category}</p>
      <h3 className="font-medium truncate">{title}</h3>
      <p className="font-bold text-lg mt-1">\${price}</p>
    </div>
  </div>
)

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

export const StatCardSimple = ({ label, value, trend }: any) => (
  <div className="p-5 rounded-xl border bg-card">
    <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-bold">{value}</h4>
      <span className={\`text-sm font-medium \${trend?.startsWith('+') ? 'text-green-500' : 'text-red-500'}\`}>{trend}</span>
    </div>
  </div>
)

export const PricingCardBasic = ({ name, price, features }: any) => (
  <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center">
    <h3 className="text-xl font-medium mb-2">{name}</h3>
    <div className="mb-6"><span className="text-4xl font-bold">\${price}</span><span className="text-muted-foreground">/mo</span></div>
    <ul className="space-y-3 w-full mb-8 text-sm">
      {features?.map((f: string, i: number) => <li key={i} className="text-muted-foreground border-b pb-2 last:border-0">{f}</li>)}
    </ul>
    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium mt-auto">Subscribe</button>
  </div>
)

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

export const EventCard = ({ title, date, location }: any) => (
  <div className="flex p-4 rounded-xl border bg-card gap-4">
    <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg px-4 py-2 min-w-[70px]">
      <span className="text-xs uppercase font-bold">{date?.split(' ')[0]}</span>
      <span className="text-2xl font-black">{date?.split(' ')[1]}</span>
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
      <div className="flex items-center text-sm text-muted-foreground gap-1">
        <MapPin className="w-3 h-3" /> {location}
      </div>
    </div>
  </div>
)

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

export const InteractiveCard = ({ title, description }: any) => (
  <div className="group p-6 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground flex items-center justify-center mb-4 transition-colors">
      <Star className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">{description}</p>
  </div>
)


`
};
