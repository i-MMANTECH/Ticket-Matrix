// Emmanuel Aro's project submission for evaluation.
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_0_15px_rgba(77,107,254,0.3)] border border-brand-400/50 hover:shadow-[0_0_25px_rgba(77,107,254,0.5)] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:border-white/20 hover:bg-white/10",
  ghost: "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
  danger: "bg-red-600/80 text-white hover:bg-red-600 border border-red-500/50",
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
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    />
  );
}
