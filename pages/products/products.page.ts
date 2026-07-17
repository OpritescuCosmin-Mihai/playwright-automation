import { test, type Page, type Locator } from "@playwright/test";
import { productsLocators } from "./products.locators";

export class ProductsPage {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = productsLocators(page);
  }

  async goto(): Promise<void> {
    await test.step("Open the products page", async () => {
      await this.page.goto("/products");
    });
  }

  async search(term: string): Promise<void> {
    await test.step(`Search for "${term}"`, async () => {
      await this.el.searchInput().fill(term);
    });
  }

  async filterByCategory(category: string): Promise<void> {
    await test.step(`Filter by category "${category}"`, async () => {
      await this.el.categoryOption(category).click();
    });
  }

  async filterByRating(min: number): Promise<void> {
    await test.step(`Filter by rating ${min}+`, async () => {
      await this.el.ratingOption(min).click();
    });
  }

  async addFirstToCart(): Promise<void> {
  await test.step("Add the first product to the cart", async () => {
    await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes("/api/cart") && r.request().method() === "POST",
      ),
      this.el.addToCartFirst().click(),
    ]);
  });
}

  // assertion-facing locators
  list(): Locator { return this.el.list(); }
  resultsCount(): Locator { return this.el.resultsCount(); }
  pageInfo(): Locator { return this.el.pageInfo(); }
  pagination(): Locator { return this.el.pagination(); }
  noResults(): Locator { return this.el.noResults(); }
  productHeading(name: string): Locator { return this.page.getByRole("heading", { name }); }
}