import { test, expect } from "@playwright/test";

const firstMileHomePage = "https://www.firstmile.com/";
const trackingURL = "https://track.firstmile.com/";
const badTrackinNumbers = ["1234", "5678", "91011"];

test.describe("landing", () => {
  test("Home page loads", async ({ page }) => {
    await page.goto(firstMileHomePage);
    await expect(page).toHaveTitle(/FirstMile/);
  });

  test("Accept Cookies", async ({ page }) => {
    await page.goto(firstMileHomePage);
    await expect(page.locator("#hs-eu-cookie-confirmation")).toBeVisible();
    await page.getByRole("button", { name: "Accept Cookies" }).click();
    await expect(page.locator("#hs-eu-cookie-confirmation")).not.toBeVisible();
  });

  test("Request a Quote", async ({ page }) => {
    await page.goto(firstMileHomePage);
    const page1Promise = page.waitForEvent("popup");
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Get a Quote" })
      .click();
    const page1 = await page1Promise;
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByText("First Name*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("First Name*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Last Name*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Business Email*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Phone Number*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Website URL*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Company Name*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("Average Daily Shipping Volume*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByLabel("How Did You Hear About Us?*")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByText("Firstmile.com needs the")
    ).toBeVisible();
    await expect(
      page1
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByRole("button", { name: "Submit" })
    ).toBeVisible();
  });
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
  test.fixme("can find packages", async ({ page }) => {
    console.log("need a valid tracking number to test");
  });
});

test("visual test", async ({ page }) => {
  await page.goto(firstMileHomePage);
  await expect(page).toHaveScreenshot();
});
