import { test, expect } from "@playwright/test";

/**
 * 1. Login as standard user
 * 2. Get a list of all products with its price
 * 3. Assert that all products have non-zero dollar price
 */

test.describe("Inventory Feature", () => {
  test.beforeEach("Do login", async ({ page }) => {
    // Launch application
    await page.goto("https://www.saucedemo.com/");
    await expect(page.getByText("Swag Labs")).toBeVisible();

    // Perform login
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    // Assertion after login
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page).toHaveURL(/.*\/inventory/);
  });

  test("Should display products with non-zero price", async ({ page }) => {
    // Get list of all products

    const productsElements = page.locator(".inventory_item");
    await expect(productsElements).toHaveCount(6);

    // Get Product Names and Prices
    const productsCount = await productsElements.count();

    let productPriceArray = [];
    for (let i = 0; i < productsCount; i++) {
      const productName = await productsElements
        .nth(i)
        .locator(".inventory_item_name")
        .innerText();
      const productPrice = await productsElements
        .nth(i)
        .locator(".inventory_item_price")
        .innerText();

      console.log(`Product Name: ${productName} | Price: ${productPrice}`);
      productPriceArray.push(productPrice);
    }
    console.log("Product Price Array: ", productPriceArray);

    /**
     * Replace the $ with ""
     * Iterate through each price and ensure its greater than 0
     */
    let modifiedArray = productPriceArray.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    console.log("Modified Price Array: ", modifiedArray);

    let priceWithInvalidValues = modifiedArray.filter((price) => price <= 0);
    if (priceWithInvalidValues.length > 0) {
      console.log(" >> ERROR: Some products have invalid prices");
    } else {
      console.log(" >> SUCCESS: All products have valid prices");
    }

    expect(priceWithInvalidValues.length).toBe(0);
    expect(priceWithInvalidValues).toHaveLength(0);

    /**
     * Assignment:
     * 1. Pick up the first product displayed on the page
     * 2. Click on "Add to Cart"
     * 3. Proceed until checkout
     * 4. Assert the confirmation message
     */

    const desiredProductName = await productsElements
      .nth(0)
      .locator(".inventory_item_name")
      .innerText();
    console.log("Desired Product to add to cart: ", desiredProductName);

    await productsElements.nth(0).locator("button").click();
    await page.locator(".shopping_cart_link").click();

    await expect(page.locator(".inventory_item_name")).toHaveText(
      desiredProductName
    );
    await page.getByRole("button", { name: "Checkout" }).click();

    await expect(page.locator(".title")).toHaveText(
      "Checkout: Your Information"
    );
    await page.getByPlaceholder("First Name").fill("John");
    await page.getByPlaceholder("Last Name").fill("Doe");
    await page.getByPlaceholder("Zip/Postal Code").fill("12345");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.locator(".title")).toHaveText("Checkout: Overview");
    await expect(page.locator(".inventory_item_name")).toHaveText(
      desiredProductName
    );

    await page.getByRole("button", { name: "Finish" }).click();
    await expect(page.locator("h2.complete-header")).toHaveText(
      "Thank you for your order!"
    );
    await expect(page.getByRole("button", { name: "Back Home" })).toBeVisible();
  });
});
