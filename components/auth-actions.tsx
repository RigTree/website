"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
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
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm">
            Claim handle
            <ArrowRight aria-hidden="true" />
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button asChild variant="ghost" size="sm">
          <Link href="/editor">Editor</Link>
        </Button>
        <UserButton />
      </Show>
    </>
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
        <SignUpButton mode="modal">
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
