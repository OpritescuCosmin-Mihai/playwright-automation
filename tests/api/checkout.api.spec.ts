import { test, expect, type APIRequestContext } from "@playwright/test";
import { DEMO_USER } from "../../test-data/users";

async function login(request: APIRequestContext) {
  const res = await request.post("/api/auth/login", {
    data: { email: DEMO_USER.email, password: DEMO_USER.password },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe("API - Checkout", () => {
  test("checkout - happy path: non-empty cart returns an orderId", async ({ request }) => {
    await request.post("/api/test/seed", { data: { name: "user-cart-has-items" } });
    await login(request);

    const res = await request.post("/api/orders");
    const responseBody = await res.json();

    expect(res.status()).toBe(200);
    expect(responseBody.orderId).toBeTruthy();
  });

  test("checkout - error: empty cart returns 400 cart_empty", async ({ request }) => {
    await request.post("/api/test/seed", { data: { name: "user-empty-cart" } });
    await login(request);

    const res = await request.post("/api/orders");
    const responseBody = await res.json();

    expect(res.status()).toBe(400);
    expect(responseBody.error).toBe("cart_empty");
  });
});