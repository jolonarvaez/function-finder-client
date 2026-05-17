"use client";

import { useState } from "react";
import { Link2Icon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CopyLinkButtonProps = Readonly<{
  text?: string;
  url?: string;
  className?: string;
}>;

export function CopyLinkButton({ text = "Copy Link", url, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const target = url ?? globalThis.location.href;
    navigator.clipboard.writeText(target).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={text}
      onClick={handleCopy}
      className={className ?? "w-fit gap-1.5 px-2"}
    >
      {copied ? <CheckIcon className="size-4" /> : <Link2Icon className="size-4" />}
      {copied ? "Copied!" : text}
    </Button>
  );
}
