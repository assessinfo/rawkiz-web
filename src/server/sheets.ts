import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1x6Yok1TWkhbzGmNCEYso7iXs15V7Fl8KsLAcUEBF6Ks";
const GATEWAY = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}`;

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) throw new Error("Google Sheets connection is not configured.");
  return { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" };
}

export type Role = { title: string; team: string; location: string; type: string; description: string };

// Reads the Roles tab. Rows with Open = "yes" (case-insensitive) are shown on the page.
export const getRoles = createServerFn({ method: "GET" }).handler(async (): Promise<Role[]> => {
  const res = await fetch(`${GATEWAY}/values/Roles!A2:F1000`, { headers: gatewayHeaders() });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Sheets read failed [${res.status}]: ${body}`);
    throw new Error(`Could not load open roles [${res.status}]`);
  }
  const json = (await res.json()) as { values?: string[][] };
  return (json.values ?? [])
    .filter((r) => (r[5] ?? "").trim().toLowerCase() === "yes" && r[0]?.trim())
    .map((r) => ({ title: r[0] ?? "", team: r[1] ?? "", location: r[2] ?? "", type: r[3] ?? "", description: r[4] ?? "" }));
});

type Submission = {
  fullName: string; email: string; phone: string; location: string; timeZone: string;
  careerArea: string; experience: string; workPass: string; links: string;
  availability: string; skills: string; motivation: string;
};

// Appends one row to the Applications tab.
export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((d: Submission) => d)
  .handler(async ({ data }) => {
    const row = [
      new Date().toISOString(), data.fullName, data.email, data.phone, data.location, data.timeZone,
      data.careerArea, data.experience, data.workPass, data.links, data.availability, data.skills,
      data.motivation, "Careers page",
    ];
    const res = await fetch(`${GATEWAY}/values/Applications!A:N:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: gatewayHeaders(),
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets append failed [${res.status}]: ${body}`);
      throw new Error(`Could not save your application [${res.status}]`);
    }
    return { ok: true };
  });
