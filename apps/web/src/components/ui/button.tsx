import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out-quart disabled:pointer-events-none disabled:opacity-60 active:translate-y-[1px] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ice-tea)] text-[var(--ice-tea-ink)] hover:brightness-95 active:brightness-90",
        gold: "bg-[var(--gold)] text-[oklch(0.18_0.04_80)] hover:brightness-95 active:brightness-90",
        ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--ice-tea)] hover:text-[var(--ice-tea)]",
        link: "bg-transparent text-[var(--ice-tea)] underline-offset-4 hover:underline px-0 py-0 h-auto",
      },
      size: {
        sm: "h-10 px-4 rounded-lg text-sm",
        md: "h-12 px-5 rounded-lg text-base",
        lg: "h-14 px-6 rounded-xl text-base font-semibold",
        block: "w-full h-14 px-6 rounded-xl text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
