# playwright-qa-portfolio

[![Playwright Tests](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml)

UI test automation for [Sauce Demo](https://www.saucedemo.com), a public practice e-commerce site, written with Playwright and TypeScript using the Page Object Model.

## What is tested

| Spec file | Test | What it checks |
|---|---|---|
| `tests/login.spec.ts` | Valid login | `standard_user` logs in and lands on the Products page |
| `tests/login.spec.ts` | Invalid login | Wrong password shows the expected error message and the user stays on the login page |
| `tests/cart-checkout.spec.ts` | Add item to cart | Adding a product updates the cart badge to `1` and the product appears in the cart |
| `tests/cart-checkout.spec.ts` | Complete checkout | Cart → customer info → overview → finish shows "Thank you for your order!" |

Detailed test cases (steps, test data, expected results): [`docs/test-cases.md`](docs/test-cases.md)

## Tech stack

- [Playwright Test](https://playwright.dev) — test runner, browser automation, assertions, HTML report
- TypeScript
- Page Object Model — page selectors and actions live in `pages/`, tests in `tests/` only describe behaviour and assertions
- Chromium (desktop Chrome profile)
- GitHub Actions — runs the suite on every push and pull request

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
.github/workflows/      CI pipeline (GitHub Actions)
docs/test-cases.md      Written test cases behind the automated tests
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

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request:

1. Installs dependencies with `npm ci`
2. Installs Chromium and its system dependencies
3. Runs the Playwright tests
4. Uploads the HTML report as the `playwright-report` artifact (kept 14 days), including when tests fail

To view a report, open the workflow run in the **Actions** tab, download `playwright-report`, unzip it and run `npx playwright show-report <unzipped-folder>`.
