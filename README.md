# playwright-qa-portfolio

UI test automation for [Sauce Demo](https://www.saucedemo.com), a public practice e-commerce site, written with Playwright and TypeScript using the Page Object Model.

## What is tested

| Spec file | Test | What it checks |
|---|---|---|
| `tests/login.spec.ts` | Valid login | `standard_user` logs in and lands on the Products page |
| `tests/login.spec.ts` | Invalid login | Wrong password shows the expected error message and the user stays on the login page |
| `tests/cart-checkout.spec.ts` | Add item to cart | Adding a product updates the cart badge to `1` and the product appears in the cart |
| `tests/cart-checkout.spec.ts` | Complete checkout | Cart → customer info → overview → finish shows "Thank you for your order!" |

## Tech stack

- [Playwright Test](https://playwright.dev) — test runner, browser automation, assertions, HTML report
- TypeScript
- Page Object Model — page selectors and actions live in `pages/`, tests in `tests/` only describe behaviour and assertions
- Chromium (desktop Chrome profile)

## Project structure

```
pages/                  Page objects (one class per screen)
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/                  Test specs
  login.spec.ts
  cart-checkout.spec.ts
playwright.config.ts    Base URL, browser, reporters, trace/screenshot settings
tsconfig.json           TypeScript settings for type-checking
```

## How to run locally

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
```

Run all tests (headless):

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open the HTML report from the last run:

```bash
npm run report
```

Type-check the project:

```bash
npm run typecheck
```

On failure, Playwright saves a screenshot and a trace in `test-results/`; both are also attached to the HTML report.
