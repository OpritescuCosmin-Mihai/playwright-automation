import { Page } from "@playwright/test";

export const loginLocators = (page: Page) => ({
  form: () => page.getByTestId("login-form"),
  emailInput: () => page.getByTestId("login-email-input"),
  passwordInput: () => page.getByTestId("login-password-input"),
  submitButton: () => page.getByTestId("login-btn"),
  error: () => page.getByTestId("login-error"),
});