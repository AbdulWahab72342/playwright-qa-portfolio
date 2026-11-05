import { test as base } from '@playwright/test';
import { BookingClient } from './BookingClient';

// Custom fixture: every API test receives a ready-made BookingClient
// instead of creating one by hand.
export const test = base.extend<{ bookingClient: BookingClient }>({
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },
});

export { expect } from '@playwright/test';
