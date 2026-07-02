import { cn } from "@/lib/utils";

export function RigTreeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
    >
      <path
        d="M32 11v31M32 42 11 55M32 42l21 13"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="9" r="7" fill="currentColor" />
      <circle cx="9" cy="56" r="7" fill="currentColor" />
      <circle cx="55" cy="56" r="7" fill="currentColor" />
    </svg>
  );
}
