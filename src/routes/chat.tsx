import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import assistantLogo from "@/assets/chat-assistant.png";

const LANDBOT_URL = "https://landbot.online/v3/H-3528417-1CUN7VKP551G23QB/index.html";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Careers Assistant | Rawkiz" },
      {
        name: "description",
        content:
          "Chat with the Rawkiz careers assistant about career areas, applications and interviews.",
      },
      { property: "og:title", content: "Careers Assistant | Rawkiz" },
      {
        property: "og:description",
        content:
          "Chat with the Rawkiz careers assistant about career areas, applications and interviews.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="flex h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back to careers page">
            <Link to="/">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <img
            src={assistantLogo}
            alt="Rawkiz careers assistant logo"
            width={32}
            height={32}
            className="size-8 rounded-md"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-base font-semibold leading-tight">
              Rawkiz Careers Assistant
            </h1>
            <p className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Ask about roles, applying & interviews
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">
        <iframe
          src={LANDBOT_URL}
          title="Rawkiz careers assistant chat"
          allow="microphone; clipboard-write"
          className="h-full w-full flex-1 rounded-xl border border-border bg-card"
        />
      </main>
    </div>
  );
}
