// Emmanuel Aro's project submission for evaluation.
import type { CustomerChannel } from "@/lib/api";

const CHANNELS: Record<
  CustomerChannel,
  { label: string; bg: string; fg: string; svg: React.ReactNode }
> = {
  instagram: {
    label: "Instagram",
    bg: "bg-pink-100",
    fg: "text-pink-600",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
  },
  facebook: {
    label: "Facebook",
    bg: "bg-blue-100",
    fg: "text-blue-600",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.7-1.6 1.5v1.8h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  whatsapp: {
    label: "WhatsApp",
    bg: "bg-green-100",
    fg: "text-green-600",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 3.4 17.6L2 22l4.5-1.4A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.7.8.8-2.6-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1a7.4 7.4 0 0 1-3.6-3.1c-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 1 2.4.8 2.8.7a3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.5-.3z" />
      </svg>
    ),
  },
  email: {
    label: "Email",
    bg: "bg-amber-100",
    fg: "text-amber-700",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  sms: {
    label: "SMS",
    bg: "bg-purple-100",
    fg: "text-purple-600",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
      </svg>
    ),
  },
};

export function ChannelIcons({ channels }: { channels: CustomerChannel[] }) {
  if (!channels || channels.length === 0) {
    return <span className="text-ink-300 text-xs">—</span>;
  }
  return (
    <div className="inline-flex items-center gap-1.5">
      {channels.map((channel) => {
        const meta = CHANNELS[channel];
        if (!meta) return null;
        return (
          <span
            key={channel}
            title={meta.label}
            className={`inline-flex items-center justify-center h-6 w-6 ${meta.bg} ${meta.fg}`}
          >
            {meta.svg}
          </span>
        );
      })}
    </div>
  );
}
