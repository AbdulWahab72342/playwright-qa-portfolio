# Test Cases — Sauce Demo

Application under test: https://www.saucedemo.com
Test data: public demo credentials shown on the login page (`standard_user` / `secret_sauce`).

Each test case below is automated as one Playwright test.

| ID | Title | Type | Preconditions | Steps | Test data | Expected result | Automated in |
|---|---|---|---|---|---|---|---|
| TC-01 | Valid login | Positive | User is on the login page | 1. Enter username<br>2. Enter password<br>3. Click **Login** | `standard_user` / `secret_sauce` | User is redirected to `inventory.html` and the **Products** title is shown | `tests/login.spec.ts` |
| TC-02 | Invalid login shows error | Negative | User is on the login page | 1. Enter username<br>2. Enter wrong password<br>3. Click **Login** | `standard_user` / `wrong_password` | Error "Epic sadface: Username and password do not match any user in this service" is shown; user stays on the login page | `tests/login.spec.ts` |
| TC-03 | Add item to cart | Positive | User is logged in | 1. Click **Add to cart** on "Sauce Labs Backpack"<br>2. Open the cart | Product: Sauce Labs Backpack | Cart badge shows `1`; cart contains exactly "Sauce Labs Backpack" | `tests/cart-checkout.spec.ts` |
| TC-04 | Complete checkout | End-to-end | User is logged in | 1. Add "Sauce Labs Backpack" to cart<br>2. Open cart, click **Checkout**<br>3. Enter first name, last name, postal code, click **Continue**<br>4. Click **Finish** | Test / User / 12345 | User lands on `checkout-complete.html` and "Thank you for your order!" is shown | `tests/cart-checkout.spec.ts` |

## Not yet covered

Candidate cases for future iterations:

- Locked-out user (`locked_out_user`) sees the locked-out error
- Login with empty username or empty password
- Checkout with missing customer information shows a validation error
- Remove an item from the cart
- Order total is correct for multiple items
- Product sorting (name and price)
- Logout returns the user to the login page
