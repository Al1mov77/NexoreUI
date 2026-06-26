'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Search, Mail, AlertCircle, CheckCircle2 } from "lucide-react"

const inputVariants = cva(
  "flex h-10 w-full rounded-xl border bg-transparent px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 focus:border-white/30 dark:focus:border-white/15 focus:bg-white/10 focus:ring-2 focus:ring-white/10",
        gradient: "border-purple-500/20 bg-background/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20",
        underline: "rounded-none border-t-0 border-x-0 border-b border-muted bg-transparent px-1 focus:border-primary focus:ring-0",
        // New variants
        otp: "text-center text-lg font-bold border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
        tags: "hidden", // Handled by tags wrapper styles
        autocomplete: "border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue">,
    VariantProps<typeof inputVariants> {
  /**
   * Enable entrance spring animation
   * @default true
   */
  animate?: boolean;
  /**
   * Current text value of the input
   */
  value?: string;
  /**
   * Callback fired when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Value for OTP inputs (should be length 6 string)
   */
  otpValue?: string;
  /**
   * Callback fired when OTP string changes
   */
  onOtpChange?: (value: string) => void;
  /**
   * Current active list of tag strings for the `tags` variant
   */
  tags?: string[];
  /**
   * Callback fired when the tags list updates
   */
  onTagsChange?: (tags: string[]) => void;
  /**
   * Suggestions list strings for the `autocomplete` variant
   */
  suggestions?: string[];
  /**
   * Callback fired when a suggestion item is clicked
   */
  onSuggestionSelect?: (value: string) => void;
  /**
   * Label displayed above the input field
   * @example <Input label="Email address" />
   */
  label?: string;
  /**
   * Helper text displayed below the input field
   * @example <Input description="We'll never share your email" />
   */
  description?: string;
  /**
   * Validation error message — shown in red below the field
   * @example <Input error={errors.email?.message} />
   */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      animate = true,
      value = "",
      onChange,
      otpValue = "",
      onOtpChange,
      tags = [],
      onTagsChange,
      suggestions = [],
      onSuggestionSelect,
      label,
      description,
      error,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a stable ID for label association if not provided
    const inputId = id || React.useId();
    const descId = description ? `${inputId}-desc` : undefined;
    const errId = error ? `${inputId}-err` : undefined;
    const isOtp = variant === "otp";
    const isTags = variant === "tags";
    const isAutocomplete = variant === "autocomplete";

    // ━━━ 1. OTP INPUT VARIANT IMPLEMENTATION ━━━
    const otpLength = 6;
    const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    // Split OTP value into array
    const otpArray = React.useMemo(() => {
      const arr = Array(otpLength).fill("");
      for (let i = 0; i < Math.min(otpValue.length, otpLength); i++) {
        arr[i] = otpValue[i];
      }
      return arr;
    }, [otpValue]);

    const handleOtpChange = (val: string, index: number) => {
      const newOtp = [...otpArray];
      // Keep only last char if multiple input
      newOtp[index] = val.slice(-1);
      const newOtpString = newOtp.join("");
      onOtpChange?.(newOtpString);

      // Focus next input
      if (val !== "" && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && otpArray[index] === "" && index > 0) {
        // Move focus backward on backspace
        otpRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").trim().slice(0, otpLength);
      if (/^\d+$/.test(pastedData)) {
        onOtpChange?.(pastedData);
        // Focus the last populated field or the next empty
        const nextFocusIndex = Math.min(pastedData.length, otpLength - 1);
        otpRefs.current[nextFocusIndex]?.focus();
      }
    };


    // ━━━ 2. TAGS INPUT VARIANT IMPLEMENTATION ━━━
    const [tagInput, setTagInput] = React.useState("");
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
        e.preventDefault();
        const cleanTag = tagInput.trim().replace(/,/g, "");
        if (cleanTag && !tags.includes(cleanTag)) {
          const newTags = [...tags, cleanTag];
          onTagsChange?.(newTags);
        }
        setTagInput("");
      } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
        // Delete last tag
        const newTags = tags.slice(0, -1);
        onTagsChange?.(newTags);
      }
    };

    const handleRemoveTag = (idx: number) => {
      const newTags = tags.filter((_, i) => i !== idx);
      onTagsChange?.(newTags);
    };


    // ━━━ 3. AUTOCOMPLETE VARIANT IMPLEMENTATION ━━━
    const [focused, setFocused] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const filteredSuggestions = React.useMemo(() => {
      if (!value) return [];
      return suggestions.filter(s =>
        s.toLowerCase().includes(value.toLowerCase()) &&
        s.toLowerCase() !== value.toLowerCase()
      );
    }, [suggestions, value]);

    React.useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setFocused(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);


    // ━━━ RENDER STAGE ━━━

    // Destructure custom props to avoid DOM warning dumps
    const { ...htmlProps } = props;

    // A. RENDER OTP
    if (isOtp) {
      return (
        <div className="flex gap-2 justify-center w-full">
          {Array.from({ length: otpLength }).map((_, idx) => (
            <input
              key={idx}
              type="text"
              pattern="\d*"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              value={otpArray[idx]}
              onChange={(e) => handleOtpChange(e.target.value, idx)}
              onKeyDown={(e) => handleOtpKeyDown(e, idx)}
              onPaste={handleOtpPaste}
              className={cn(
                inputVariants({ variant: "otp" }),
                "w-12 h-12 rounded-xl text-center font-bold text-lg border-2"
              )}
              {...(htmlProps as any)}
            />
          ))}
        </div>
      );
    }

    // B. RENDER TAGS
    if (isTags) {
      return (
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 min-h-[44px] w-full rounded-xl border border-input bg-background/50 px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all",
            className
          )}
        >
          <AnimatePresence>
            {tags.map((tag, idx) => (
              <motion.span
                key={tag + idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-md"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            ref={ref}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={tags.length === 0 ? props.placeholder : ""}
            className="flex-1 bg-transparent border-0 outline-none text-sm p-0.5 placeholder:text-muted-foreground/50 focus:ring-0 min-w-[60px]"
            {...(htmlProps as any)}
          />
        </div>
      );
    }

    // C. RENDER AUTOCOMPLETE OR STANDARD
    const textInputContent = (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }))}
        onFocus={() => isAutocomplete && setFocused(true)}
        {...(htmlProps as any)}
      />
    );

    if (isAutocomplete) {
      return (
        <div ref={containerRef} className="relative w-full">
          {textInputContent}
          <AnimatePresence>
            {focused && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute z-50 w-full mt-1.5 bg-card border border-border/80 shadow-lg rounded-xl overflow-hidden max-h-[200px] overflow-y-auto p-1 space-y-0.5"
              >
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={item + idx}
                    type="button"
                    onClick={() => {
                      onSuggestionSelect?.(item)
                      setFocused(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors outline-none focus:bg-muted/50"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Standard input rendering with optional animations
    const inputElement = (
      <motion.div
        className="relative w-full"
        initial={animate ? { opacity: 0, y: 4 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.25 }}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
          className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }), error && "border-destructive focus:border-destructive focus:ring-destructive/20")}
          onFocus={() => isAutocomplete && setFocused(true)}
          {...(htmlProps as any)}
        />
        {variant === "gradient" && (
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 opacity-0 blur transition-opacity peer-focus:opacity-20" />
        )}
      </motion.div>
    );

    // If no label/description/error, render bare input (backward compatible)
    if (!label && !description && !error) {
      return inputElement;
    }

    // With label/description/error wrapper
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1" aria-hidden>*</span>}
          </label>
        )}
        {inputElement}
        {description && !error && (
          <p id={descId} className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={errId} role="alert" className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
)
Input.displayName = "Input"

export { Input }

// ----------------------------------------------------
// Merged input components for backward compatibility
// ----------------------------------------------------

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
      <Input ref={ref} className={cn("pl-9", className)} {...props} />
    </div>
  )
);
SearchInput.displayName = "SearchInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="relative w-full">
        <Input ref={ref} type={show ? "text" : "password"} className={cn("pr-10", className)} {...props} />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60 hover:text-foreground select-none"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="glass" {...props} />
);
GlassInput.displayName = "GlassInput";

export const GradientInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="gradient" {...props} />
);
GradientInput.displayName = "GradientInput";

export const UnderlineInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="underline" {...props} />
);
UnderlineInput.displayName = "UnderlineInput";

export const PillInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => <Input ref={ref} className={cn("rounded-full px-5", className)} {...props} />
);
PillInput.displayName = "PillInput";

export interface ErrorInputProps extends InputProps {
  errorMessage?: string;
}

export const ErrorInput = React.forwardRef<HTMLInputElement, ErrorInputProps>(
  ({ className, errorMessage, ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative flex items-center w-full">
        <Input
          ref={ref}
          className={cn(
            "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-600 placeholder:text-red-400/50 pr-10",
            className
          )}
          {...props}
        />
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
      </div>
      {errorMessage && <span className="text-xs text-red-500 px-1">{errorMessage}</span>}
    </div>
  )
);
ErrorInput.displayName = "ErrorInput";

export const SuccessInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className="relative flex items-center w-full">
      <Input
        ref={ref}
        className={cn(
          "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-600 placeholder:text-emerald-400/50 pr-10",
          className
        )}
        {...props}
      />
      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
    </div>
  )
);
SuccessInput.displayName = "SuccessInput";

export const GhostInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-transparent bg-transparent shadow-none hover:bg-muted/30 focus:bg-muted/50 focus:ring-0",
        className
      )}
      {...props}
    />
  )
);
GhostInput.displayName = "GhostInput";

export const NeumorphicInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-0 bg-secondary/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_1px_1px_3px_rgba(255,255,255,0.05)] focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    />
  )
);
NeumorphicInput.displayName = "NeumorphicInput";

export interface IconInputProps extends InputProps {
  icon?: React.ReactNode;
}

export const IconInputLeft = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => {
    const Icon = icon || <Search className="h-4 w-4" />;
    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          {Icon}
        </div>
        <Input ref={ref} className={cn("pl-9", className)} {...props} />
      </div>
    );
  }
);
IconInputLeft.displayName = "IconInputLeft";

export const IconInputRight = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => {
    const Icon = icon || <Mail className="h-4 w-4" />;
    return (
      <div className="relative w-full">
        <Input ref={ref} className={cn("pr-9", className)} {...props} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          {Icon}
        </div>
      </div>
    );
  }
);
IconInputRight.displayName = "IconInputRight";

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps & { label: string }>(
  ({ className, label, value = "", placeholder, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasVal, setHasVal] = React.useState(value !== "");

    React.useEffect(() => {
      setHasVal(value !== "");
    }, [value]);

    return (
      <div className="relative w-full pt-2">
        <Input
          ref={ref}
          value={value}
          placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasVal(e.target.value !== "");
          }}
          className={className}
          {...props}
        />
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none select-none text-muted-foreground/60",
            focused || hasVal
              ? "-top-1 text-[10px] font-bold text-primary bg-background px-1"
              : "top-5 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export const MinimalDropInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-0 bg-muted/40 hover:bg-muted/60 focus:bg-background border-b-2 border-transparent focus:border-primary rounded-t-xl rounded-b-none",
        className
      )}
      {...props}
    />
  )
);
MinimalDropInput.displayName = "MinimalDropInput";

