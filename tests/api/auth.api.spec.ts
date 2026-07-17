import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { DEMO_USER } from '../../test-data/users';

test.describe("API - Auth", () => {
  test('register - happy path: 201 with the new user', async ({ request }) => {
    const user ={
      name: faker.person.firstName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
    };

    const response = await request.post("/api/auth/register", { data: user });
    const responseBody = await response.json();

    expect(response.status()).toBe(201);
    expect(responseBody.user.email).toBe(user.email);
    expect(responseBody.user.name).toBe(user.name);
  });

  test('register - error: existing email returns 409', async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: {
        name: "Dup",
        email: DEMO_USER.email,
        password: faker.internet.password({ length: 10 }),
      }
    });
    const responseBody = await res.json();

    expect(res.status()).toBe(409);
    expect(responseBody.error).toBe('Email is already registered');
  });

  test("register - validation: empty fields returns 400 (name first)", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: "", email: "", password: "" },
    });
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBe("Name is required");
  });

  test("register - validation: missing name returns 400", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: "", email: faker.internet.email(), password: faker.internet.password({ length: 10 }) },
    });
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBe("Name is required");
  });

  test("register - validation: invalid email returns 400", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: faker.person.firstName(), email: "not-an-email", password: faker.internet.password({ length: 10 }) },
    });
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.field).toBe("email");
    expect(body.error).toBe("Enter a valid email");
  });

  test("register - validation: short password returns 400", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: faker.person.firstName(), email: faker.internet.email(), password: "123" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.field).toBe("password");
    expect(body.error).toBe("Password must be at least 6 characters");
  });

  test("register - boundary: 6-char password succeeds (201)", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: faker.person.firstName(), email: faker.internet.email().toLowerCase(), password: "123456" },
    });

    expect(res.status()).toBe(201);
  });

  test('login - happy path: 200 with the user', async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: DEMO_USER.password },
    });
    const responseBody = await res.json();
    
    expect(res.status()).toBe(200);
    expect(responseBody.user.email).toBe(DEMO_USER.email);
  });

  test('login - error: wrong password returns 401', async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: "wrong-password" },
    });
    const responseBody = await res.json();

    expect(res.status()).toBe(401);
    expect(responseBody.error).toBe('Invalid email or password');
  });

  test("login - validation: missing password returns 400", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: "" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.field).toBe("password");
    expect(body.error).toBe("Password is required");
  });

  test("login - validation: invalid email returns 400", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "not-an-email", password: DEMO_USER.password },
    });
    const responseBody = await res.json();

    expect(res.status()).toBe(400);
    expect(responseBody.error).toBe("Enter a valid email");
  });

  test("login - error: non-existing email returns 401", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: faker.internet.email(), password: DEMO_USER.password },
    });
    const responseBody = await res.json();

    expect(res.status()).toBe(401);
    expect(responseBody.error).toBe("Invalid email or password");
  });
});