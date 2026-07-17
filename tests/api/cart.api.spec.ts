import { test, expect } from "@playwright/test";
import { DEMO_USER } from "../../test-data/users";

const PRODUCT_ID = "p-elec-1"; // Gaming Laptop

test.describe("API - Cart", () => {
  test("add to cart - happy path: authenticated add returns the product", async ({ request }) => {
    // Arrange: log in — the login response's cookie is stored on this request context
    const login = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: DEMO_USER.password },
    });
    expect(login.ok()).toBeTruthy();

    // Act: the same context automatically sends the session cookie
    const res = await request.post("/api/cart", { data: { productId: PRODUCT_ID } });
    const cart = await res.json();
    const ids = cart.items.map((item: any) => item.product.id);

    // Assert
    expect(res.status()).toBe(200);
    expect(ids).toContain(PRODUCT_ID);
  });

  test("add to cart - error: without auth returns 401", async ({ request }) => {
    // No login on this fresh context -> no session cookie
    const res = await request.post("/api/cart", { data: { productId: PRODUCT_ID } });
    const responseBody = await res.json();

    expect(res.status()).toBe(401);    
    expect(responseBody.error).toBe("unauthorized");
  });

  test("add to cart - error: unknown product returns 404", async ({ request }) => {
    await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: DEMO_USER.password },
    });

    const res = await request.post("/api/cart", { data: { productId: "does-not-exist" } });
    const responseBody = await res.json();

    expect(res.status()).toBe(404);
    expect(responseBody.error).toBe("product_not_found");
  });

  test("remove from cart - happy path: the item is gone", async ({ request }) => {
    await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: DEMO_USER.password },
    });
    await request.post("/api/cart", { data: { productId: PRODUCT_ID } }); // ensure present

    const res = await request.delete(`/api/cart/${PRODUCT_ID}`);
    const ids = (await res.json()).items.map((i: any) => i.product.id);

    expect(res.status()).toBe(200);
    expect(ids).not.toContain(PRODUCT_ID);
  });
});