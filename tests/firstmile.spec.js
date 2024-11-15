const { test, expect } = require("@playwright/test");

const firstMileHomePage = "https://www.firstmile.com/";
const trackingURL = "https://track.firstmile.com/";
const badTrackinNumbers = ["1234", "5678", "91011"];

test("has title", async ({ page }) => {
  await page.goto(firstMileHomePage);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FirstMile/);
});

test.describe("track a package", () => {
  test("no package found", async ({ page }) => {
    await page.goto(firstMileHomePage);
    const page1Promise = page.waitForEvent("popup");
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Track Packages" })
      .click();
    const page1 = await page1Promise;
    await page1
      .getByPlaceholder("Enter your tracking number", { exact: true })
      .fill(badTrackinNumbers[0]);
    await page1.getByRole("button", { name: "Track Shipment" }).click();
    await expect(page1.locator("h2")).toContainText(
      `Could not find tracking info for: ${badTrackinNumbers[0]}`
    );
    await page1.getByRole("link", { name: "Specify another tracking" }).click();
    await expect(
      page1.getByRole("button", { name: "Track Shipment" })
    ).toBeVisible();
  });
  test.fixme("package found", async ({ page }) => {
    console.log("need a valid tracking number to test");
  });
});

test.describe("multiple packages", () => {
  test("can't find packages", async ({ page }) => {
    await page.goto(trackingURL);
    await page.getByText("Enter up to 50 tracking numbers").click();
    const multipleTextArea = page.getByPlaceholder(
      "Enter your tracking numbers"
    );
    await expect(multipleTextArea).toBeVisible();
    await multipleTextArea.fill(badTrackinNumbers.join("\n"));
    await page.getByRole("button", { name: "Track Shipment" }).click();
    for (const number of badTrackinNumbers) {
      await expect(
        page.getByText(`${number} Could not find tracking`)
      ).toBeVisible();
    }
    await page.getByRole("link", { name: "Track Another Package ?" }).click();
    await expect(
      page.getByRole("button", { name: "Track Shipment" })
    ).toBeVisible();
  });
});

test("visual test", async ({ page }) => {
  await page.goto(firstMileHomePage);
  await expect(page).toHaveScreenshot();
});
