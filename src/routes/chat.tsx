import { useChat } from "@ai-sdk/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

import assistantLogo from "@/assets/chat-assistant.png";

const STORAGE_KEY = "rawkiz-careers-chat";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const suggestions = [
  "What career areas can I apply for?",
  "How does the interview process work?",
  "Do you hire internationally?",
  "How should I prepare my application?",
];

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
  const [initialMessages] = useState<UIMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "rawkiz-careers",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      setError(
        err.message.includes("402")
          ? "The assistant is temporarily unavailable. Please try again later."
          : "Something went wrong. Please try again.",
      );
    },
  });

  const busy = status === "submitted" || status === "streaming";

  // Persist to localStorage whenever messages settle.
  useEffect(() => {
    if (status === "ready") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, status]);

  // Keep the composer focused.
  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    sendMessage({ text: trimmed });
  };

  const reset = () => {
    setMessages([]);
    window.localStorage.removeItem(STORAGE_KEY);
    setError(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
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
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            New chat
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        <Conversation className="flex-1">
          <ConversationContent className="gap-6 py-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={assistantLogo}
                    alt=""
                    width={64}
                    height={64}
                    className="size-16 rounded-xl"
                  />
                }
                title="Hi! I'm the Rawkiz careers assistant."
                description="Ask me about career areas, how to apply, interviews, or working from Singapore with a global team."
              >
                <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.parts.map((part, j) => {
                        if (part.type === "text") {
                          return message.role === "assistant" ? (
                            <MessageResponse key={j}>{part.text}</MessageResponse>
                          ) : (
                            <p key={j} className="whitespace-pre-wrap">
                              {part.text}
                            </p>
                          );
                        }
                        return null;
                      })}
                      {message.role === "assistant" &&
                        isLast &&
                        status === "submitted" &&
                        !message.parts.some((p) => p.type === "text" && p.text) && (
                          <Shimmer>Thinking…</Shimmer>
                        )}
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {status === "submitted" &&
              messages[messages.length - 1]?.role === "user" && <Shimmer>Thinking…</Shimmer>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {error && (
          <p role="alert" className="pb-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="sticky bottom-0 bg-background pb-4 pt-2">
          <PromptInput
            onSubmit={(msg) => send(msg.text ?? "")}
            className="rounded-xl border-border bg-card"
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask about careers at Rawkiz…"
              disabled={busy}
              aria-label="Message the careers assistant"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={busy || !input.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Chat history stays in your browser — nothing is stored on our servers.
          </p>
        </div>
      </main>
    </div>
  );
}
