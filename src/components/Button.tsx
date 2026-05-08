import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "rounded-xl inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-white hover:text-primary border-2 border-primary focus:ring-primary/50",
        secondary:
          "bg-secondary text-white hover:bg-white border-2 border-secondary focus:ring-secondary/50 hover:text-secondary",
        gray: "text-gray-500 hover:bg-gray-500 border-2 border-gray-500 focus:ring-gray-300 hover:text-white",
        outline:
          "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
        white:
          "bg-white text-primary hover:bg-white/90 border-2 border-white focus:ring-white/50",
        grayTransparent:
          "bg-gray-200/60 text-gray-600 hover:bg-gray-300/70 border-2 border-gray-300/60 focus:ring-gray-300/50 hover:text-gray-900 backdrop-blur-sm",
        tertiary:
          'bg-tertiary text-black text-lg hover:bg-white hover:text-tertiary border-2 border-tertiary focus:ring-tertiary/50 font-bold',
        danger:
          "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-300/50",
        green:
          'bg-green-500 text-white hover:bg-white hover:text-green-500 border-2 border-green-500 focus:ring-green-300/50 text-prymary hover:text-white',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'hover:bg-accent/40  hover:text-accent-foreground border-2 border-pimary/50 focus:ring-primary/50',
        accent: 'border-2 border-accent-500 text-accent hover:bg-accent hover:text-white focus:ring-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        red: 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-500 focus:ring-red-300/50',
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
        icon: "h-10 w-10 p-0",
        full: "w-full px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
