# playwright-qa-portfolio

[![Playwright Tests](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AbdulWahab72342/playwright-qa-portfolio/actions/workflows/playwright.yml)

UI and API test automation with Playwright and TypeScript:

- **UI:** [Sauce Demo](https://www.saucedemo.com), a public practice e-commerce site, tested with the Page Object Model
- **API:** [Restful Booker](https://restful-booker.herokuapp.com), a public practice hotel booking REST API

## What is tested

26 automated tests: 15 UI and 11 API.

| Spec file | Area | Tests |
|---|---|---|
| `tests/ui/login.spec.ts` | Authentication | Valid login, wrong password, locked-out user, empty username, empty password, logout |
| `tests/ui/inventory.spec.ts` | Product sorting | Name A→Z, name Z→A, price low→high, price high→low |
| `tests/ui/cart-checkout.spec.ts` | Cart and checkout | Add to cart, remove from cart, complete checkout, checkout form validation, order total for multiple items |
| `tests/api/auth.spec.ts` | Health and auth | Health check, valid token, invalid credentials |
| `tests/api/booking.spec.ts` | Booking CRUD | Create, get by id, filter by name, update (PUT), partial update (PATCH), delete, update without token (403), missing booking (404) |

Detailed test cases (steps, test data, expected results): [`docs/test-cases.md`](docs/test-cases.md)

## Tech stack

- [Playwright Test](https://playwright.dev) — test runner, browser automation, assertions, HTML report
- TypeScript
- Page Object Model — page selectors and actions live in `pages/`, UI tests only describe behaviour and assertions
- API client — `api/BookingClient.ts` wraps each endpoint, and a custom fixture hands it to every API test
- Chromium (desktop Chrome profile) for UI tests; API tests need no browser
- GitHub Actions — runs the suite on every pull request and on pushes to `main`

## Project structure

```
pages/                  Page objects for the UI tests (one class per screen)
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
api/                    API client and fixture for the API tests
  BookingClient.ts
  fixtures.ts
tests/
  ui/                   UI specs (Sauce Demo)
    login.spec.ts
    inventory.spec.ts
    cart-checkout.spec.ts
  api/                  API specs (Restful Booker)
    auth.spec.ts
    booking.spec.ts
test-data/              Shared test data
  users.ts              Sauce Demo users
  bookings.ts           Admin credentials and booking builder
playwright.config.ts    Two projects: `ui` (browser) and `api` (no browser)
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

Run only the UI or only the API tests:

```bash
npm run test:ui
```

```bash
npm run test:api
```

Run the UI tests with a visible browser:

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
2. Runs the `ui` and `api` projects inside the official Playwright Docker image (`mcr.microsoft.com/playwright`), which already contains the browsers and their system libraries
3. Uploads the HTML report as the `playwright-report` artifact (kept 14 days), including when tests fail

The image tag in the workflow must match the `@playwright/test` version in `package.json`; update both together.

To view a report, open the workflow run in the **Actions** tab, download `playwright-report`, unzip it and run `npx playwright show-report <unzipped-folder>`.
