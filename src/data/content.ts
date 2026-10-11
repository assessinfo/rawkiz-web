// Edit careers content here — no component changes needed.

export const company = {
  name: "Rawkiz",
  description: "[WHAT RAWKIZ DOES — one-line company description]",
  hrEmail: "[ADD HR CONTACT EMAIL WHEN AVAILABLE]",
};

// Footer social links. Put a full URL (https://…) in `url` to show the link.
// Leave it "" — or keep any [PLACEHOLDER] text — and the link stays hidden.
export const socials = [
  { label: "LinkedIn", url: "" },
  { label: "Instagram", url: "" },
  { label: "X", url: "" },
];

// Only a real http(s)/mailto destination counts as filled in.
export const isRealUrl = (url: string) => /^(https?:\/\/|mailto:)\S+$/i.test(url.trim());

export const values = [
  { title: "Global by default", body: "Singapore HQ, teammates and collaborators across time zones. Thank you" },
  { title: "Craft + technology", body: "We care about how things are made as much as what they do." },
  { title: "Ownership", body: "Small teams, real responsibility, work you can point to." },
  { title: "Always learning", body: "Space to grow skills and try new things. [CONFIRM LEARNING BUDGET / PROGRAMS]" },
];

export const careerAreas = [
  { name: "Engineering & Development", description: "Build reliable, fast products across web, mobile and backend systems.", skills: ["TypeScript", "React", "APIs", "Cloud"] },
  { name: "Product & UX/UI Design", description: "Shape experiences from research and flows to polished interfaces.", skills: ["Figma", "Research", "Prototyping", "Design systems"] },
  { name: "Creative & Content", description: "Tell stories through words, visuals, motion and video.", skills: ["Copywriting", "Motion", "Video", "Art direction"] },
  { name: "Marketing & Growth", description: "Grow audiences and communities across markets.", skills: ["Performance", "SEO", "Social", "Analytics"] },
  { name: "Data & AI", description: "Turn data into insight and build intelligent features.", skills: ["Python", "SQL", "ML", "LLMs"] },
  { name: "Operations & Partnerships", description: "Keep things running and build relationships that move us forward.", skills: ["Ops", "BizDev", "Finance", "Project mgmt"] },
];

export const workPassOptions = [
  "Singapore Citizen / PR",
  "Holds a valid Singapore pass",
  "Will need sponsorship",
  "Remote from overseas",
];

export const interviewSteps = [
  { title: "Application review", body: "We read every draft and look at your work examples." },
  { title: "Intro call", body: "A short conversation to get to know each other." },
  { title: "Skills conversation or practical task", body: "A focused discussion or small, respectful task." },
  { title: "Team conversation", body: "Meet the people you'd work with." },
  { title: "Offer", body: "If it's a match, we'll make you an offer." },
];

export const prepTips = [
  { q: "Research Rawkiz", a: "Look at what we make and think about where you'd add value." },
  { q: "Prepare portfolio & work examples", a: "Pick 2–3 pieces you can talk through: the problem, your role, the result." },
  { q: "Use the STAR method", a: "For experience questions: Situation, Task, Action, Result. Keep it concrete." },
  { q: "Questions to ask us", a: "How the team works, what success looks like, how feedback happens." },
  { q: "Remote interviews across time zones", a: "Do a tech check, find a quiet space, and confirm the time in SGT (UTC+8)." },
  { q: "What we look for", a: "Curiosity, craft, communication and ownership." },
];

export const faqs = [
  { q: "Do you hire internationally?", a: "Yes, we're open to talent worldwide. [CONFIRM INTERNATIONAL HIRING POLICY]" },
  { q: "Do you offer remote work?", a: "We're open to remote and hybrid setups depending on the role. [CONFIRM REMOTE POLICY]" },
  { q: "Do I need a work pass for Singapore?", a: "If you'd be based in Singapore and aren't a Citizen/PR, you'll likely need one. [CONFIRM VISA & WORK-PASS POLICY]" },
  { q: "What happens after I download my draft?", a: "Keep it ready. When applications open, you'll be able to send it to us." },
  { q: "Do you accept internships?", a: "[CONFIRM INTERNSHIP POLICY]" },
  { q: "How long does the process take?", a: "Typically [ADD TYPICAL TIMELINE], depending on the role." },
];
