import { test, expect } from "@playwright/test";

test.describe("Login Functionality", () => {
  test.beforeEach("Do login", async ({ page }) => {
    // Launch application and assert title and header
    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await expect(page.locator("//h1")).toHaveText("CURA Healthcare Service");

    // Click on "Make Appointment" link
    await page.getByRole("link", { name: "Make Appointment" }).click();
    await expect(page.getByText("Please login to make")).toBeVisible();
  });

  test("Should login successfully", async ({ page }) => {
    // Successful login flow
    await page.getByLabel("Username").fill("John Doe");
    await page.getByLabel("Password").fill("ThisIsNotAPassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Assert a text after login
    await expect(page.locator("h2")).toHaveText("Make Appointment");
  });

  test("Should prevent login with invalid credentials", async ({ page }) => {
    // Failed login flow
    await page.getByLabel("Username").fill("JohnSmith");
    await page.getByLabel("Password").fill("ThisIsNotAPassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Assert error message
    await expect(page.locator("#login")).toContainText(
      "Login failed! Please ensure the username and password are valid."
    );
  });
});
