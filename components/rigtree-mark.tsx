import Image from "next/image";
import { cn } from "@/lib/utils";

export function RigTreeMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="RigTree Logo"
      width={64}
      height={64}
      className={cn("size-5 object-contain", className)}
    />
  );
}
