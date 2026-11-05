import { type Booking } from '../api/BookingClient';

// Default admin account documented by Restful Booker.
export const ADMIN = { username: 'admin', password: 'password123' } as const;

// Builds a valid booking. A unique first name keeps tests independent,
// because the API is shared with everyone who uses the public demo.
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: `Test${Date.now()}${Math.floor(Math.random() * 1000)}`,
    lastname: 'User',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
