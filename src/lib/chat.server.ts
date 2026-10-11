import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { careerAreas, company, faqs, interviewSteps, prepTips, values } from "@/data/content";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/run-id";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

function buildSystemPrompt() {
  const areas = careerAreas
    .map((a) => `- ${a.name}: ${a.description} (skills: ${a.skills.join(", ")})`)
    .join("\n");
  const steps = interviewSteps.map((s, i) => `${i + 1}. ${s.title} — ${s.body}`).join("\n");
  const tips = prepTips.map((t) => `- ${t.q}: ${t.a}`).join("\n");
  const faqText = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
  const vals = values.map((v) => `- ${v.title}: ${v.body}`).join("\n");

  return `You are the careers assistant on the ${company.name} careers page. ${company.name} is a Singapore-based company with an international audience and team.

Your job: help visitors understand career areas, the application process, interviews, and working at ${company.name}. Be warm, concise and practical. Use markdown formatting.

STRICT RULES:
- Answer only from the facts below. Never invent company facts (founding year, team size, clients, salaries, benefits, awards, specific open vacancies).
- Text in [SQUARE BRACKETS] is a placeholder the team has not confirmed yet. If a question depends on it, say the team hasn't confirmed that detail yet and suggest checking back or asking in the application form.
- There are no specific open vacancies right now; career areas are open to expressions of interest. Open roles, when listed on the page, come from the company's live roles list.
- For anything outside careers at ${company.name}, politely steer back.

COMPANY VALUES:
${vals}

CAREER AREAS (open to expressions of interest):
${areas}

INTERVIEW PROCESS:
${steps}

INTERVIEW PREP TIPS:
${tips}

FAQ:
${faqText}`;
}

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return Response.json({ error: "AI is not configured yet." }, { status: 500 });
  }

  let messages: UIMessage[];
  try {
    const body = (await request.json()) as { messages?: UIMessage[] };
    if (!Array.isArray(body.messages)) throw new Error("missing messages");
    messages = body.messages;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
    }),
    runIdFetch,
  );
}
