import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register by entering email", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click({ force: true });

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email, {
      force: true,
    });
    cy.findByRole("button", { name: /create account/i }).click({ force: true });
  });

  it("should allow you to login by entering email", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /log in/i }).click({ force: true });

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByRole("button", { name: /Email a login link/i }).click({
      force: true,
    });
  });
});
