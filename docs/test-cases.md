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
| TC-05 | Locked-out user cannot log in | Negative | User is on the login page | 1. Enter username<br>2. Enter password<br>3. Click **Login** | `locked_out_user` / `secret_sauce` | Error "Epic sadface: Sorry, this user has been locked out." is shown; user stays on the login page | `tests/login.spec.ts` |
| TC-06 | Empty username | Negative | User is on the login page | 1. Leave username empty<br>2. Enter password<br>3. Click **Login** | (empty) / `secret_sauce` | Error "Epic sadface: Username is required" is shown | `tests/login.spec.ts` |
| TC-07 | Empty password | Negative | User is on the login page | 1. Enter username<br>2. Leave password empty<br>3. Click **Login** | `standard_user` / (empty) | Error "Epic sadface: Password is required" is shown | `tests/login.spec.ts` |
| TC-08 | Logout | Positive | User is logged in | 1. Open the side menu<br>2. Click **Logout** | — | Login page is shown with the **Login** button visible | `tests/login.spec.ts` |
| TC-09 | Remove item from cart | Positive | User is logged in | 1. Add "Sauce Labs Backpack" to cart<br>2. Open cart<br>3. Click **Remove** | Product: Sauce Labs Backpack | Cart is empty and the cart badge is hidden | `tests/cart-checkout.spec.ts` |
| TC-10 | Checkout requires customer information | Negative | User is logged in with an item in the cart | 1. Open cart, click **Checkout**<br>2. Leave all fields empty, click **Continue** | (all empty) | Error "Error: First Name is required" is shown; user stays on checkout step one | `tests/cart-checkout.spec.ts` |
| TC-11 | Order total for multiple items | Positive | User is logged in | 1. Add "Sauce Labs Backpack" and "Sauce Labs Bike Light"<br>2. Go to checkout overview | Test / User / 12345 | Item total equals the sum of item prices; Total equals Item total + Tax | `tests/cart-checkout.spec.ts` |
| TC-12 | Sort by name A to Z | Positive | User is logged in | 1. Select **Name (Z to A)**<br>2. Select **Name (A to Z)** | — | Product names are in ascending alphabetical order | `tests/inventory.spec.ts` |
| TC-13 | Sort by name Z to A | Positive | User is logged in | 1. Select **Name (Z to A)** | — | Product names are in descending alphabetical order | `tests/inventory.spec.ts` |
| TC-14 | Sort by price low to high | Positive | User is logged in | 1. Select **Price (low to high)** | — | Product prices are in ascending order | `tests/inventory.spec.ts` |
| TC-15 | Sort by price high to low | Positive | User is logged in | 1. Select **Price (high to low)** | — | Product prices are in descending order | `tests/inventory.spec.ts` |

## Out of scope

- Other demo users (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`): they simulate deliberate bugs and slowness, which would need separate tests with expected failures
- Visual regression and accessibility checks
- Cross-browser runs (Firefox, WebKit)
