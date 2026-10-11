import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { company, values, careerAreas, interviewSteps, prepTips, faqs, workPassOptions, socials, isRealUrl } from "@/data/content";
import { type Application, validate, handleSubmit, fieldLabels, requiredFields } from "@/lib/application";
import { getRoles, submitApplication } from "@/server/sheets";

// Footer links render only when they point at a real destination.
const visibleSocials = socials.filter((s) => isRealUrl(s.url));

const rolesQuery = queryOptions({ queryKey: ["open-roles"], queryFn: () => getRoles(), staleTime: 5 * 60 * 1000 });

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(rolesQuery),
  head: () => ({
    meta: [
      { title: "Careers at Rawkiz | Singapore · Global" },
      { name: "description", content: "Build the future from Singapore, for the world. Explore career areas at Rawkiz and prepare your application." },
      { property: "og:title", content: "Careers at Rawkiz | Singapore · Global" },
      { property: "og:description", content: "Explore career areas at Rawkiz and prepare your application draft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const btn = "inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--primary)]`;
const btnGhost = `${btn} border border-border text-foreground hover:border-primary hover:text-primary`;

function Section({ id, num, label, title, children }: { id: string; num: string; label: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="reveal mb-14 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <span className="font-display text-7xl font-bold text-primary/90 md:text-8xl">{num}</span>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
        <h2 className="text-4xl font-bold leading-[0.95] md:col-span-9 md:text-6xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((it) => (
        <details key={it.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium focus-visible:outline-2">
            {it.q}
            <span className="font-mono text-primary transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-3xl text-muted-foreground">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

function Index() {
  useReveal();
  return (
    <main className="overflow-x-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <span className="font-display text-2xl font-bold tracking-tighter">rawkiz<span className="text-primary">.</span></span>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Careers · SG → World</span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 md:px-10 md:pt-28">
        <p className="reveal font-mono text-xs uppercase tracking-widest text-cool">● Singapore HQ / Global team</p>
        <h1 className="reveal mt-6 text-[13vw] font-bold leading-[0.85] md:text-[8.5rem]">
          Build the future.<br /><span className="text-gradient">From Singapore,</span><br />for the world.
        </h1>
        <div className="reveal mt-10 grid gap-8 md:grid-cols-12">
          <p className="text-lg text-muted-foreground md:col-span-5 md:col-start-7">
            {company.name} is {company.description}. We work across borders and time zones with people who care about craft.
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:col-start-7">
            <a href="#areas" className={btnPrimary}>Explore career areas →</a>
            <a href="#apply" className={btnGhost}>Start your application</a>
          </div>
        </div>
      </section>
      <div className="border-y border-border bg-card py-4" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-muted-foreground">
          {Array.from({ length: 2 }).flatMap((_, i) =>
            ["Engineering", "Design", "Creative", "Growth", "Data & AI", "Operations", "Singapore", "Worldwide"].map((w) => (
              <span key={w + i}>{w} <span className="text-primary">✦</span></span>
            )),
          )}
        </div>
      </div>

      <Section id="why" num="01" label="Why Rawkiz" title="Small team. Big ambition. No borders.">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.title} className="reveal group bg-background p-8 transition-colors hover:bg-card">
              <span className="font-mono text-xs text-cool">/{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl font-bold group-hover:text-primary">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="global" num="02" label="Where we work" title={<>Based in Singapore,<br /><span className="text-cool">working worldwide.</span></>}>
        <div className="reveal grid gap-10 md:grid-cols-12">
          <div className="space-y-5 text-lg text-muted-foreground md:col-span-6 md:col-start-4">
            <p>Our HQ is in Singapore, a hub that connects Asia with the rest of the world. Our collaborators span many time zones.</p>
            <p>We're open to remote and hybrid setups for international candidates, and we plan collaboration around overlapping hours, async docs and clear handoffs.</p>
            <p className="border-l-2 border-primary pl-4 font-mono text-sm text-foreground">Work passes & visas: [CONFIRM VISA & WORK-PASS POLICY]</p>
          </div>
          <div className="font-mono text-sm md:col-span-3">
            {[["SGT", "UTC+8", "HQ"], ["Overlap", "Async-first", "Docs"], ["Remote", "Hybrid", "Open"]].map(([a, b, c]) => (
              <div key={a} className="flex justify-between border-b border-border py-3"><span className="text-primary">{a}</span><span>{b}</span><span className="text-muted-foreground">{c}</span></div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="areas" num="03" label="Career areas" title="Find where you fit.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {careerAreas.map((a) => (
            <article key={a.name} className="reveal group flex flex-col border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary">
              <span className="w-fit border border-primary/50 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">Open to expressions of interest</span>
              <h3 className="mt-6 text-2xl font-bold">{a.name}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {a.skills.map((s) => <li key={s} className="bg-secondary px-2 py-1 font-mono text-xs">{s}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="roles" num="04" label="Open roles" title="Current openings.">
        <OpenRoles />
      </Section>

      <Section id="apply" num="05" label="Application draft" title="Get your application ready.">
        <ApplicationForm />
      </Section>

      <Section id="interview" num="06" label="Interview guidance" title="What to expect.">
        <p className="mb-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">Indicative process — may vary by role</p>
        <ol className="reveal mb-20 grid gap-px bg-border md:grid-cols-5">
          {interviewSteps.map((s, i) => (
            <li key={s.title} className="bg-background p-6">
              <span className="font-display text-4xl font-bold text-primary">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <h3 className="mb-6 text-3xl font-bold">How to prepare</h3>
        <Accordion items={prepTips} />
      </Section>

      <Section id="faq" num="07" label="FAQ" title="Questions, answered.">
        <Accordion items={faqs} />
      </Section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3 md:px-10">
          <div>
            <span className="font-display text-5xl font-bold tracking-tighter">rawkiz<span className="text-primary">.</span></span>
            <p className="mt-2 font-mono text-sm text-muted-foreground">Singapore · Working worldwide</p>
          </div>
          {visibleSocials.length > 0 && (
            <nav aria-label="Social" className="flex gap-5 font-mono text-sm">
              {visibleSocials.map((s) => (
                <a key={s.label} href={s.url.trim()} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{s.label}</a>
              ))}
            </nav>
          )}
          <p className="font-mono text-sm text-muted-foreground md:text-right">{company.hrEmail}</p>
        </div>
      </footer>
    </main>
  );
}

function OpenRoles() {
  const { data: roles } = useSuspenseQuery(rolesQuery);
  if (roles.length === 0) {
    return (
      <p className="reveal max-w-3xl border border-cool/40 bg-card p-5 font-mono text-sm text-cool">
        No specific vacancies right now. Tell us which area fits you above and we'll reach out when a role opens.
      </p>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {roles.map((r) => (
        <article key={r.title} className="reveal group flex flex-col border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary">
          <span className="w-fit border border-primary/50 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">{r.type || "Open"}</span>
          <h3 className="mt-6 text-2xl font-bold">{r.title}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{[r.team, r.location].filter(Boolean).join(" · ")}</p>
          <p className="mt-3 flex-1 text-sm text-muted-foreground">{r.description}</p>
          <a href="#apply" className={`${btnGhost} mt-6 w-fit`}>Apply →</a>
        </article>
      ))}
    </div>
  );
}

const empty: Application = { fullName: "", email: "", phone: "", location: "", timeZone: "", careerArea: "", experience: "", links: "", availability: "", workPass: "", motivation: "", skills: "" };

function ApplicationForm() {
  const [data, setData] = useState<Application>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Application, string>>>({});
  const [done, setDone] = useState("");
  const [sending, setSending] = useState(false);
  const set = (k: keyof Application) => (e: { target: { value: string } }) => setData({ ...data, [k]: e.target.value });

  function check() {
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) { document.getElementById(`f-${Object.keys(e)[0]}`)?.focus(); setDone(""); return false; }
    return true;
  }

  async function go(format: "pdf" | "txt") {
    if (!check()) return;
    await handleSubmit(data, format);
    setDone(`Draft downloaded as .${format}. Keep it ready to send.`);
  }

  async function send() {
    if (!check()) return;
    setSending(true);
    try {
      await submitApplication({ data });
      setDone("Application sent — thank you! We'll be in touch.");
      setData(empty);
    } catch {
      setDone("Couldn't send right now. Please download your draft and try again later.");
    } finally {
      setSending(false);
    }
  }

  const input = "w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
  const field = (k: keyof Application, el: ReactNode, wide = false) => (
    <div className={wide ? "md:col-span-2" : ""}>
      <label htmlFor={`f-${k}`} className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {fieldLabels[k]}{requiredFields.includes(k) ? <span className="text-primary"> *</span> : " (optional)"}
      </label>
      {el}
      {errors[k] && <p id={`e-${k}`} className="mt-1 text-sm text-destructive">{errors[k]}</p>}
    </div>
  );
  const p = (k: keyof Application) => ({ id: `f-${k}`, value: data[k], onChange: set(k), className: input, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <div className="reveal">
      <p className="mb-8 border-l-4 border-primary bg-card p-5 text-sm">
        Fill this in and hit submit — your application lands with our team straight away. You can also download a copy for your records.
      </p>
...
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <button type="button" onClick={send} disabled={sending} className={btnPrimary}>{sending ? "Sending…" : "Submit application"}</button>
          <button type="submit" className={btnGhost}>Download application draft</button>
          <button type="button" onClick={() => go("txt")} className={btnGhost}>Download as .txt</button>
          <p role="status" className="font-mono text-sm text-primary">{done}</p>
        </div>
      </form>
    </div>
  );
}
