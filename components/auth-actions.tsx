"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight, PenLine, UserRound } from "lucide-react";
import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

type AuthPrimaryActionProps = {
  signedOutText: string;
  signedInText: string;
  signedInHref?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function NavAuthControls() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="redirect">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <Button size="sm" className="rounded-lg shadow-sm">
            Claim handle
            <ArrowRight aria-hidden="true" />
          </Button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonBox:
                "flex flex-row-reverse items-center gap-2 rounded-full border border-border/80 bg-secondary/40 hover:bg-secondary/70 hover:border-[#a3e635]/60 px-3 py-1 transition-all shadow-sm cursor-pointer",
              userButtonOuterIdentifier:
                "font-semibold text-xs text-foreground tracking-tight",
              userButtonAvatarBox: "size-6 rounded-full border border-border/60",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Profile"
              labelIcon={<UserRound className="size-4 text-[#a3e635]" />}
              href="/u/me"
            />
            <UserButton.Link
              label="Setup Editor"
              labelIcon={<PenLine className="size-4 text-[#a3e635]" />}
              href="/editor"
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </div>
  );
}

export function AuthPrimaryAction({
  signedOutText,
  signedInText,
  signedInHref = "/editor",
  variant,
  size,
}: AuthPrimaryActionProps) {
  return (
    <>
      <Show when="signed-out">
        <SignUpButton mode="redirect">
          <Button variant={variant} size={size}>
            {signedOutText}
            <ArrowRight aria-hidden="true" />
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button asChild variant={variant} size={size}>
          <Link href={signedInHref}>
            {signedInText}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Show>
    </>
  );
}
