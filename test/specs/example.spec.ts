import { test } from "@playwright/test";

test.describe("Portfolio HOME", () => {
  test("Access to index", async ({ page, browserName }) => {
    await page.goto("http://localhost:58125/");
    await page.screenshot({ path: `test/output/screenshot/index.${browserName}.png`, fullPage: true });
  });
});
