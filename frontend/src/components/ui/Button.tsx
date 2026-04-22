// Emmanuel Aro's project submission for evaluation.
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink-700 disabled:bg-ink-300 disabled:cursor-not-allowed",
  secondary:
    "bg-white text-ink border border-ink-200 hover:border-ink-400 hover:bg-ink-50",
  ghost: "bg-transparent text-ink-600 hover:bg-ink-100",
  danger: "bg-danger text-white hover:bg-red-700",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    />
  );
}
