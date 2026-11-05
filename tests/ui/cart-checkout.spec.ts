import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PASSWORD, USERS } from '../../test-data/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart and checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Every test here starts from a logged-in state.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
  });

  test('user can add an item to the cart', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.openCart();
    await expect(cartPage.cartItemNames).toHaveText([BACKPACK]);
  });

  test('user can remove an item from the cart', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.removeItem(BACKPACK);

    await expect(cartPage.cartItemNames).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('user can complete checkout', async ({ page }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout requires customer information', async ({ page }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('', '', '');

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('order total is correct for multiple items', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Test', 'User', '12345');

    const prices = await checkoutPage.getItemPrices();
    const expectedSubtotal = prices.reduce((sum, price) => sum + price, 0);
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(prices).toHaveLength(2);
    // toBeCloseTo avoids floating-point errors such as 29.99 + 9.99 = 39.980000000000004.
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
