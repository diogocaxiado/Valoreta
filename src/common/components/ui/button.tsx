import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-sm text-sm",
    "ring-offset-background",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40 disabled:scale-100",
    "select-none",
    "font-montserrat font-bold uppercase tracking-widest",
    "active:scale-[0.96]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:brightness-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]",
          "shadow-[0_0_10px_hsl(var(--primary)/0.3)]",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "border-2 border-destructive-foreground/25",
          "hover:brightness-110 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)] hover:border-destructive-foreground/40",
          "shadow-[0_0_10px_hsl(var(--destructive)/0.25)]",
        ].join(" "),
        outline: [
          "bg-background/40 text-foreground backdrop-blur-sm",
          "border-2 border-foreground/20",
          "hover:bg-background/60 hover:border-foreground/40 hover:shadow-[0_0_15px_hsl(var(--foreground)/0.1)]",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground",
          "border-2 border-secondary-foreground/20",
          "hover:brightness-150 hover:border-secondary-foreground/40",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground/60",
          "hover:bg-foreground/5 hover:text-foreground",
        ].join(" "),
        link: [
          "text-accent underline-offset-4",
          "hover:underline hover:text-accent/80",
        ].join(" "),
      },
      size: {
        default: "h-11 px-6 py-2 text-xl",
        sm: "h-9 px-4 text-base",
        lg: "h-14 px-12 py-3 text-3xl",
        xl: "h-16 px-16 py-4 text-4xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const Spinner = () => (
      <svg
        className="animate-spin h-5 w-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
