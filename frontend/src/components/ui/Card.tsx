// Emmanuel Aro's project submission for evaluation.
import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`glass-neo rounded-xl border border-line shadow-soft transition-all hover:border-brand/40 hover:shadow-brand ${className}`}
    />
  );
}

export function CardHeader({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`px-5 py-4 border-b border-line flex items-center justify-between ${className}`}
    />
  );
}

export function CardTitle({
  className = "",
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...rest}
      className={`text-sm font-semibold text-white tracking-wide ${className}`}
    />
  );
}

export function CardBody({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={`p-5 ${className}`} />;
}
