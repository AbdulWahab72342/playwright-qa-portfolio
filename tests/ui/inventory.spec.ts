import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { PASSWORD, USERS } from '../../test-data/users';

test.describe('Product sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
  });

  // Each test sorts on the page, then checks the result against
  // the same list sorted in code.
  test('sort by name A to Z', async () => {
    // A to Z is the default, so sort Z to A first to prove the sort really changes the list.
    await inventoryPage.sortBy('za');
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort());
  });

  test('sort by name Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
