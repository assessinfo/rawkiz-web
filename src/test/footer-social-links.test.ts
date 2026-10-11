import { describe, expect, it } from "vitest";

import { socials, isRealUrl } from "@/data/content";

// The footer shows a social link only when its url holds a real destination.
describe("Footer social links", () => {
  it("treats empty, # and [PLACEHOLDER] urls as no destination", () => {
    expect(isRealUrl("")).toBe(false);
    expect(isRealUrl("   ")).toBe(false);
    expect(isRealUrl("#")).toBe(false);
    expect(isRealUrl("[ADD LINKEDIN URL]")).toBe(false);
    expect(isRealUrl("http://")).toBe(false);
  });

  it("treats a full http(s) or mailto url as a destination", () => {
    expect(isRealUrl("https://www.linkedin.com/company/rawkiz")).toBe(true);
    expect(isRealUrl("  https://instagram.com/rawkiz  ")).toBe(true);
    expect(isRealUrl("mailto:hr@rawkiz.com")).toBe(true);
  });

  it("offers LinkedIn, Instagram and X as editable slots, each with its own url", () => {
    expect(socials.map((s) => s.label)).toEqual(["LinkedIn", "Instagram", "X"]);
    expect(socials.every((s) => typeof s.url === "string")).toBe(true);
  });
});
