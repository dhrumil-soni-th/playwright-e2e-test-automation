import { test, expect } from "@playwright/test";

test.describe("Book Appointment Functionality", () => {
  test.beforeEach("Do login", async ({ page }) => {
    // Launch application and assert title and header
    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await expect(page.locator("//h1")).toHaveText("CURA Healthcare Service");

    // Click on "Make Appointment" link
    await page.getByRole("link", { name: "Make Appointment" }).click();
    await expect(page.getByText("Please login to make")).toBeVisible();

    await page.getByLabel("Username").fill("John Doe");
    await page.getByLabel("Password").fill("ThisIsNotAPassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("h2")).toHaveText("Make Appointment");
  });

  test("Appointment Book Flow using codegen", async ({ page }) => {
    // Fill appointment form
    await page
      .getByRole("checkbox", { name: "Apply for hospital readmission" })
      .check();
    await page.getByRole("radio", { name: "Medicaid" }).check();
    await page.getByRole("textbox", { name: "Visit Date (Required)" }).click();
    await page.getByRole("cell", { name: "25", exact: true }).click();
    await page.getByRole("textbox", { name: "Comment" }).click();
    await page.getByRole("textbox", { name: "Comment" }).fill("Testing");
    await page.getByRole("button", { name: "Book Appointment" }).click();

    // Assert appointment confirmation
    await expect(
      page.getByRole("heading", { name: "Appointment Confirmation" })
    ).toBeVisible();
    await expect(page.locator("h2")).toContainText("Appointment Confirmation");
  });
});
