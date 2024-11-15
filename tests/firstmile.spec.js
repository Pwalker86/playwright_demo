const { test, expect } = require("@playwright/test");

test("has title", async ({ page }) => {
  await page.goto("https://www.firstmile.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FirstMile/);
});

test("test", async ({ page }) => {
  await page.goto("https://www.firstmile.com/");
  const page1Promise = page.waitForEvent("popup");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Track Packages" })
    .click();
  const page1 = await page1Promise;
  await expect(page1.getByText("Enter up to 50 tracking")).toBeVisible();
});

test("visual test", async ({ page }) => {
  await page.goto("https://playwright.dev");
  await expect(page).toHaveScreenshot();
});
