# Test Cases

Each test case below is automated as one Playwright test.

## UI — Sauce Demo

Application under test: https://www.saucedemo.com
Test data: public demo credentials shown on the login page (`standard_user` / `secret_sauce`).

| ID | Title | Type | Preconditions | Steps | Test data | Expected result | Automated in |
|---|---|---|---|---|---|---|---|
| TC-01 | Valid login | Positive | User is on the login page | 1. Enter username<br>2. Enter password<br>3. Click **Login** | `standard_user` / `secret_sauce` | User is redirected to `inventory.html` and the **Products** title is shown | `tests/ui/login.spec.ts` |
| TC-02 | Invalid login shows error | Negative | User is on the login page | 1. Enter username<br>2. Enter wrong password<br>3. Click **Login** | `standard_user` / `wrong_password` | Error "Epic sadface: Username and password do not match any user in this service" is shown; user stays on the login page | `tests/ui/login.spec.ts` |
| TC-03 | Add item to cart | Positive | User is logged in | 1. Click **Add to cart** on "Sauce Labs Backpack"<br>2. Open the cart | Product: Sauce Labs Backpack | Cart badge shows `1`; cart contains exactly "Sauce Labs Backpack" | `tests/ui/cart-checkout.spec.ts` |
| TC-04 | Complete checkout | End-to-end | User is logged in | 1. Add "Sauce Labs Backpack" to cart<br>2. Open cart, click **Checkout**<br>3. Enter first name, last name, postal code, click **Continue**<br>4. Click **Finish** | Test / User / 12345 | User lands on `checkout-complete.html` and "Thank you for your order!" is shown | `tests/ui/cart-checkout.spec.ts` |
| TC-05 | Locked-out user cannot log in | Negative | User is on the login page | 1. Enter username<br>2. Enter password<br>3. Click **Login** | `locked_out_user` / `secret_sauce` | Error "Epic sadface: Sorry, this user has been locked out." is shown; user stays on the login page | `tests/ui/login.spec.ts` |
| TC-06 | Empty username | Negative | User is on the login page | 1. Leave username empty<br>2. Enter password<br>3. Click **Login** | (empty) / `secret_sauce` | Error "Epic sadface: Username is required" is shown | `tests/ui/login.spec.ts` |
| TC-07 | Empty password | Negative | User is on the login page | 1. Enter username<br>2. Leave password empty<br>3. Click **Login** | `standard_user` / (empty) | Error "Epic sadface: Password is required" is shown | `tests/ui/login.spec.ts` |
| TC-08 | Logout | Positive | User is logged in | 1. Open the side menu<br>2. Click **Logout** | — | Login page is shown with the **Login** button visible | `tests/ui/login.spec.ts` |
| TC-09 | Remove item from cart | Positive | User is logged in | 1. Add "Sauce Labs Backpack" to cart<br>2. Open cart<br>3. Click **Remove** | Product: Sauce Labs Backpack | Cart is empty and the cart badge is hidden | `tests/ui/cart-checkout.spec.ts` |
| TC-10 | Checkout requires customer information | Negative | User is logged in with an item in the cart | 1. Open cart, click **Checkout**<br>2. Leave all fields empty, click **Continue** | (all empty) | Error "Error: First Name is required" is shown; user stays on checkout step one | `tests/ui/cart-checkout.spec.ts` |
| TC-11 | Order total for multiple items | Positive | User is logged in | 1. Add "Sauce Labs Backpack" and "Sauce Labs Bike Light"<br>2. Go to checkout overview | Test / User / 12345 | Item total equals the sum of item prices; Total equals Item total + Tax | `tests/ui/cart-checkout.spec.ts` |
| TC-12 | Sort by name A to Z | Positive | User is logged in | 1. Select **Name (Z to A)**<br>2. Select **Name (A to Z)** | — | Product names are in ascending alphabetical order | `tests/ui/inventory.spec.ts` |
| TC-13 | Sort by name Z to A | Positive | User is logged in | 1. Select **Name (Z to A)** | — | Product names are in descending alphabetical order | `tests/ui/inventory.spec.ts` |
| TC-14 | Sort by price low to high | Positive | User is logged in | 1. Select **Price (low to high)** | — | Product prices are in ascending order | `tests/ui/inventory.spec.ts` |
| TC-15 | Sort by price high to low | Positive | User is logged in | 1. Select **Price (high to low)** | — | Product prices are in descending order | `tests/ui/inventory.spec.ts` |

## API — Restful Booker

API under test: https://restful-booker.herokuapp.com ([API docs](https://restful-booker.herokuapp.com/apidoc/index.html))
Test data: default admin account `admin` / `password123`; each test creates its own booking with a unique first name.

| ID | Title | Type | Request | Expected result | Automated in |
|---|---|---|---|---|---|
| API-01 | Health check | Positive | `GET /ping` | Status 201 | `tests/api/auth.spec.ts` |
| API-02 | Valid credentials return a token | Positive | `POST /auth` with admin credentials | Status 200; body contains a non-empty `token` | `tests/api/auth.spec.ts` |
| API-03 | Invalid credentials | Negative | `POST /auth` with a wrong password | Status 200; body is `{ "reason": "Bad credentials" }` | `tests/api/auth.spec.ts` |
| API-04 | Create a booking | Positive | `POST /booking` with a valid booking | Status 200; body has a numeric `bookingid` and echoes the booking | `tests/api/booking.spec.ts` |
| API-05 | Get a booking by id | Positive | `GET /booking/{id}` for a new booking | Status 200; body equals the created booking | `tests/api/booking.spec.ts` |
| API-06 | Filter bookings by first name | Positive | `GET /booking?firstname={name}` | Status 200; result contains the new booking's id | `tests/api/booking.spec.ts` |
| API-07 | Update a booking | Positive | `PUT /booking/{id}` with token cookie | Status 200; body equals the new booking | `tests/api/booking.spec.ts` |
| API-08 | Partially update a booking | Positive | `PATCH /booking/{id}` with token cookie, `additionalneeds` only | Status 200; `additionalneeds` changed, other fields unchanged | `tests/api/booking.spec.ts` |
| API-09 | Delete a booking | Positive | `DELETE /booking/{id}` with token cookie | Status 201; a following `GET` returns 404 | `tests/api/booking.spec.ts` |
| API-10 | Update without a token | Negative | `PUT /booking/{id}` without token | Status 403 | `tests/api/booking.spec.ts` |
| API-11 | Get a booking that does not exist | Negative | `GET /booking/999999999` | Status 404 | `tests/api/booking.spec.ts` |

Note: API-01, API-03 and API-09 assert the status codes Restful Booker actually returns (201 for ping and delete, 200 for a failed login). A production API would normally use 200/204 and 401; these are documented quirks of the demo API, not test mistakes.

## Out of scope

- Other demo users (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`): they simulate deliberate bugs and slowness, which would need separate tests with expected failures
- Visual regression and accessibility checks
- Cross-browser runs (Firefox, WebKit)
- API: JSON schema validation, XML responses, and load or performance testing
