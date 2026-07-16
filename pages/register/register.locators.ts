import { Page } from "@playwright/test";

export const registerLocators = (page: Page) => ({
  form: () => page.getByTestId("register-form"),
  nameInput: () => page.getByTestId("register-name-input"),
  emailInput: () => page.getByTestId("register-email-input"),
  passwordInput: () => page.getByTestId("register-password-input"),
  submitButton: () => page.getByTestId("register-btn"),
  nameError: () => page.getByTestId("name-error"),
  emailError: () => page.getByTestId("email-error"),
  passwordError: () => page.getByTestId("password-error"),
});