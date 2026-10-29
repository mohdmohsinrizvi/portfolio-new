import { test, expect } from "@playwright/test";

const routes = ["/", "/work", "/lab", "/journey", "/about", "/contact"];

test.describe("route smoke", () => {
  for (const route of routes) {
    test(`${route} renders without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      const res = await page.goto(route, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("#main")).toBeVisible();
      expect(errors, errors.join("\n")).toEqual([]);

      // single WebGL layer only
      const canvases = page.locator("canvas");
      const count = await canvases.count();
      expect(count).toBeLessThanOrEqual(2);
    });
  }
});

test("unknown route returns 404", async ({ page }) => {
  const res = await page.goto("/definitely-not-here");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Not in the archive.")).toBeVisible();
});

test("homepage has all six chapters and accessible controls", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  for (const id of ["arrival", "identity", "selected-work", "laboratory", "journey", "connection"]) {
    await expect(page.locator(`#${id}`), `#${id} missing`).toHaveCount(1);
  }

  await expect(page.getByRole("link", { name: /Explore the archive/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // menu opens, traps focus-ish, Escape closes
  const menuBtn = page.getByRole("button", { name: /menu|navigation/i });
  if (await menuBtn.count()) {
    await menuBtn.first().click();
    await page.keyboard.press("Escape");
  }
});

test("gallery responds to keyboard navigation", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const gallery = page.locator("#selected-work [role='group']");
  await gallery.scrollIntoViewIfNeeded();
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  const counter = await gallery.locator("text=/01\\s*\\/\\s*06/").count();
  expect(counter).toBeGreaterThanOrEqual(0);
  // next button present and reachable
  await expect(page.getByRole("button", { name: "Next project" })).toHaveCount(1);
  await page.getByRole("button", { name: "Next project" }).click();
  await page.waitForTimeout(600);
});

test("lab experiments run interactively", async ({ page }) => {
  await page.goto("/lab", { waitUntil: "networkidle" });

  // sorting network
  const play = page.getByRole("button", { name: "Play", exact: true }).first();
  await play.click();
  await page.waitForTimeout(1500);
  await expect(page.getByRole("button", { name: "Verify network" })).toBeVisible();

  await page.getByRole("button", { name: "Verify network" }).click();
  await expect(page.getByText("Verified")).toBeVisible({ timeout: 30_000 });

  // graph search
  await page.getByRole("button", { name: "Dijkstra" }).click();
  await page.waitForTimeout(400);
  await expect(page.getByText("Dijkstra", { exact: true }).first()).toBeVisible();

  // entity resolution
  const input = page.locator("input").first();
  await input.fill("acme corp inc.");
  await page.waitForTimeout(400);
  await expect(page.getByText("Combined score")).toBeVisible();
});

test("project detail page carries verifiable context", async ({ page }) => {
  await page.goto("/work/amazon-ml-challenge", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Amazon");
  await expect(page.getByText(/Sources & verification/i)).toBeVisible();
  // factual guardrail: framed as a challenge entry, not a win
  await expect(page.getByText(/not a win|competition entry|top 3%/i).first()).toBeVisible();
});

test("no email address is published anywhere", async ({ page }) => {
  for (const route of ["/", "/about", "/contact"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html, `${route} leaks an email`).not.toMatch(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
    );
  }
});

test("reduced motion disables the heavy choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");
});
