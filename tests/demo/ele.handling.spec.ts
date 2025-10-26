import { test, expect } from "@playwright/test";

test.describe("Book Appointment Functionality", () => {
  test.beforeEach("Do login with valid credentials", async ({ page }) => {
    // Launch application and assert title and header
    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await expect(page.locator("//h1")).toHaveText("CURA Healthcare Service");

    /**
     * ELEMENT: Button, Link
     * ACTIONS: click, press, dblclick, right click, hover
     */

    // Click on "Make Appointment" link
    // await page.getByRole("link", { name: "Make Appointment" }).click();
    // await page.getByRole("link", { name: "Make Appointment" }).press("Enter");
    // await page.getByRole("link", { name: "Make Appointment" }).dblclick();
    // await page
    //   .getByRole("link", { name: "Make Appointment" })
    //   .click({ button: "right" });

    // await page.getByRole("link", { name: "Make Appointment" }).hover();
    await page
      .getByRole("link", { name: "Make Appointment" })
      .click({ timeout: 5000 });
    await expect(page.getByText("Please login to make")).toBeVisible();

    /**
     * ELEMENT: Textbox, Textarea
     * ACTIONS: fill, clear, type
     * 1. ✅ Clear/Click before typing
     * 2. ✅ Use fill for instant text input
     * 3. ✅ Press sequentially for simulating real user typing
     */

    await page.getByLabel("Username").clear();
    await page.getByLabel("Username").fill("John Doe");

    // await page.getByLabel("Password").fill("ThisIsNotAPassword");
    await page
      .getByLabel("Password")
      .pressSequentially("ThisIsNotAPassword", { delay: 100 });
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("h2")).toHaveText("Make Appointment");
  });

  test("Should make an appointment with non-default values", async ({
    page,
  }) => {
    // Fill appointment form

    /**
     * ELEMENT: Dropdown, Select
     * ACTIONS:
     * 1. ✅ Assert the default selected option
     * 2. ✅ Select option by label, index
     * 3. ✅ Assert the count of options
     * 4. ✅ get all options and their text
     */

    // 1. Assert the default selected option
    await expect(page.getByLabel("Facility")).toHaveValue(
      "Tokyo CURA Healthcare Center"
    );

    // 2. Dropdown selection - selectOption by value, label, index
    await page
      .getByLabel("Facility")
      .selectOption("Hongkong CURA Healthcare Center");

    await page
      .getByLabel("Facility")
      .selectOption({ label: "Seoul CURA Healthcare Center" });

    await page.getByLabel("Facility").selectOption({ index: 0 });

    // 3. Assert the count of options
    const noOfOptions = page.getByLabel("Facility").locator("option");
    await expect(noOfOptions).toHaveCount(3);

    // 4. get all options and their text
    let listOfOptions = [];
    const options = await noOfOptions.all();
    for (const option of options) {
      let optionText = await option.textContent();
      if (optionText) {
        optionText = optionText.trim();
        listOfOptions.push(optionText);
      }
    }
    console.log(`List of options: ${listOfOptions}`);

    /**
     * ELEMENT: Checkbox, Radio Button
     * ACTIONS:
     *1. Assert the default state (checked/unchecked)
     *2. Check/Uncheck
     *
     *  ACTIONS:
     * Radio Button - Allows to select only one option from a group
     * Checkbox - Allows to select multiple options from a group
     */

    // Checkbox and radio button selections
    // await page
    //   .getByRole("checkbox", { name: "Apply for hospital readmission" })
    //   .click();
    await page
      .getByRole("checkbox", { name: "Apply for hospital readmission" })
      .check();

    // Radio Button selection
    // Assert the default state (checked/unchecked)
    // await expect(page.getByRole("radio", { name: "Medicare" })).toBeChecked();
    await expect(page.getByText("Medicare")).toBeChecked();
    await page.getByRole("radio", { name: "Medicaid" }).check();
    await expect(page.getByText("Medicare")).not.toBeChecked();

    await page.getByRole("textbox", { name: "Visit Date (Required)" }).click();
    await page.getByRole("cell", { name: "25", exact: true }).click();

    // Multi-line text input
    await page.getByRole("textbox", { name: "Comment" }).click();
    await page.getByRole("textbox", { name: "Comment" }).fill("Testing");

    // Button click to book appointment
    await page.getByRole("button", { name: "Book Appointment" }).click();

    // Assert appointment confirmation
    await expect(
      page.getByRole("heading", { name: "Appointment Confirmation" })
    ).toBeVisible();
    await expect(page.locator("h2")).toContainText("Appointment Confirmation");
  });
});
