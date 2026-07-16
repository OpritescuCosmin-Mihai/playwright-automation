import { Page } from "@playwright/test";

export const productsLocators = (page: Page) => ({
  list: () => page.getByTestId("product-list"),
  cards: () => page.getByTestId("product-card"),
  card: (id: string) =>
    page.locator(`[data-testid="product-card"][data-product-id="${id}"]`),
  searchInput: () => page.getByTestId("search-input"),
  resultsCount: () => page.getByTestId("results-count"),
  noResults: () => page.getByTestId("no-results-message"),
  pagination: () => page.getByTestId("pagination"),
  pageInfo: () => page.getByTestId("page-info"),
  categoryOption: (category: string) => page.getByTestId(`category-option-${category}`),
  ratingOption: (min: number) =>
    page.locator(`[data-testid="rating-option"][data-rating="${min}"]`),
  addToCartFirst: () => page.getByTestId("add-to-cart-btn").first(),
  addToCartFor: (id: string) =>
    page.locator(`[data-testid="add-to-cart-btn"][data-product-id="${id}"]`),
});