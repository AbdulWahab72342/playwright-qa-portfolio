# playwright-qa-portfolio

[![Playwright Tests](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml)

UI test automation for [Sauce Demo](https://www.saucedemo.com), a public practice e-commerce site, written with Playwright and TypeScript using the Page Object Model.

## What is tested

15 automated tests, grouped by feature:

| Spec file | Area | Tests |
|---|---|---|
| `tests/login.spec.ts` | Authentication | Valid login, wrong password, locked-out user, empty username, empty password, logout |
| `tests/inventory.spec.ts` | Product sorting | Name A→Z, name Z→A, price low→high, price high→low |
| `tests/cart-checkout.spec.ts` | Cart and checkout | Add to cart, remove from cart, complete checkout, checkout form validation, order total for multiple items |

Detailed test cases (steps, test data, expected results): [`docs/test-cases.md`](docs/test-cases.md)

## Tech stack

- [Playwright Test](https://playwright.dev) — test runner, browser automation, assertions, HTML report
- TypeScript
- Page Object Model — page selectors and actions live in `pages/`, tests in `tests/` only describe behaviour and assertions
- Chromium (desktop Chrome profile)
- GitHub Actions — runs the suite on every pull request and on pushes to `main`

## Project structure

```
pages/                  Page objects (one class per screen)
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/                  Test specs
  login.spec.ts
  inventory.spec.ts
  cart-checkout.spec.ts
test-data/              Shared test data (demo users)
  users.ts
playwright.config.ts    Base URL, browser, reporters, trace/screenshot settings
tsconfig.json           TypeScript settings for type-checking
.github/workflows/      CI pipeline (GitHub Actions)
docs/test-cases.md      Written test cases behind the automated tests
```

## How to run locally

Requires Node.js 20 or newer (the minimum supported by Playwright 1.63).

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

`.github/workflows/playwright.yml` runs on every pull request and on every push to `main`:

1. Installs dependencies with `npm ci`
2. Runs the Playwright tests inside the official Playwright Docker image (`mcr.microsoft.com/playwright`), which already contains the browsers and their system libraries
3. Uploads the HTML report as the `playwright-report` artifact (kept 14 days), including when tests fail

The image tag in the workflow must match the `@playwright/test` version in `package.json`; update both together.

To view a report, open the workflow run in the **Actions** tab, download `playwright-report`, unzip it and run `npx playwright show-report <unzipped-folder>`.
