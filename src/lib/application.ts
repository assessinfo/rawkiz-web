import { company } from "@/data/content";

export type Application = {
  fullName: string; email: string; phone: string; location: string; timeZone: string;
  careerArea: string; experience: string; links: string; availability: string;
  workPass: string; motivation: string; skills: string;
};

export const fieldLabels: Record<keyof Application, string> = {
  fullName: "Full name", email: "Email", phone: "Phone", location: "Country / City",
  timeZone: "Time zone", careerArea: "Career area", experience: "Years of experience",
  links: "Portfolio / LinkedIn / GitHub", availability: "Availability / notice period",
  workPass: "Work-pass status", motivation: "Motivation", skills: "Key skills",
};

export const requiredFields: (keyof Application)[] = [
  "fullName", "email", "location", "timeZone", "careerArea", "experience", "workPass", "motivation", "skills",
];

export function validate(a: Application) {
  const e: Partial<Record<keyof Application, string>> = {};
  for (const k of requiredFields) if (!a[k].trim()) e[k] = `${fieldLabels[k]} is required`;
  if (a.email && !/^\S+@\S+\.\S+$/.test(a.email)) e.email = "Enter a valid email";
  return e;
}

function today() { return new Date().toLocaleDateString("en-SG", { dateStyle: "long" }); }

export function toText(a: Application) {
  return [`${company.name.toUpperCase()} — APPLICATION DRAFT`, `Date: ${today()}`, "",
    ...(Object.keys(fieldLabels) as (keyof Application)[]).map((k) => `${fieldLabels[k]}:\n${a[k] || "—"}\n`)].join("\n");
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click();
  URL.revokeObjectURL(url);
}

export function downloadTxt(a: Application) {
  download(new Blob([toText(a)], { type: "text/plain" }), "rawkiz-application-draft.txt");
}

export async function downloadPdf(a: Application) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFillColor(11, 11, 15); doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(198, 255, 0); doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.text("RAWKIZ", 15, 20);
  doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`Application draft · ${today()}`, 195, 20, { align: "right" });
  let y = 44;
  doc.setTextColor(20, 20, 20);
  for (const k of Object.keys(fieldLabels) as (keyof Application)[]) {
    const lines = doc.splitTextToSize(a[k] || "—", 180);
    if (y + 8 + lines.length * 5 > 285) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(110, 110, 110);
    doc.text(fieldLabels[k].toUpperCase(), 15, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(20, 20, 20);
    doc.text(lines, 15, y + 6);
    y += 12 + lines.length * 5;
  }
  doc.save("rawkiz-application-draft.pdf");
}

// TODO: Replace this download-only handler with a real submission (email/service) once an HR inbox exists.
export async function handleSubmit(a: Application, format: "pdf" | "txt") {
  if (format === "pdf") await downloadPdf(a); else downloadTxt(a);
}
