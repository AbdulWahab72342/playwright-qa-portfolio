import { test, expect } from '../../api/fixtures';
import { type BookingClient } from '../../api/BookingClient';
import { ADMIN, newBooking } from '../../test-data/bookings';

// Every test creates its own booking, so tests never depend on each other
// or on data that already exists on the shared demo server.
async function createBookingId(client: BookingClient): Promise<number> {
  const response = await client.createBooking(newBooking());
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.bookingid;
}

test.describe('Booking CRUD', () => {
  test('create a booking', async ({ bookingClient }) => {
    const booking = newBooking();

    const response = await bookingClient.createBooking(booking);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(booking);
  });

  test('get a booking by id', async ({ bookingClient }) => {
    const booking = newBooking();
    const created = await (await bookingClient.createBooking(booking)).json();

    const response = await bookingClient.getBooking(created.bookingid);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(booking);
  });

  test('filter bookings by first name', async ({ bookingClient }) => {
    const booking = newBooking();
    const created = await (await bookingClient.createBooking(booking)).json();

    const response = await bookingClient.getBookingIds({ firstname: booking.firstname });

    expect(response.status()).toBe(200);
    expect(await response.json()).toContainEqual({ bookingid: created.bookingid });
  });

  test('update a booking (PUT)', async ({ bookingClient }) => {
    const id = await createBookingId(bookingClient);
    const token = await bookingClient.getToken(ADMIN.username, ADMIN.password);
    const updated = newBooking({ lastname: 'Updated', totalprice: 300, depositpaid: false });

    const response = await bookingClient.updateBooking(id, updated, token);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updated);
  });

  test('partially update a booking (PATCH)', async ({ bookingClient }) => {
    const id = await createBookingId(bookingClient);
    const token = await bookingClient.getToken(ADMIN.username, ADMIN.password);

    const response = await bookingClient.partialUpdateBooking(id, { additionalneeds: 'Late checkout' }, token);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.additionalneeds).toBe('Late checkout');
    expect(body.lastname).toBe('User'); // untouched fields keep their values
  });

  test('delete a booking', async ({ bookingClient }) => {
    const id = await createBookingId(bookingClient);
    const token = await bookingClient.getToken(ADMIN.username, ADMIN.password);

    const response = await bookingClient.deleteBooking(id, token);

    // Restful Booker returns 201 for a successful delete.
    expect(response.status()).toBe(201);
    expect((await bookingClient.getBooking(id)).status()).toBe(404);
  });
});

test.describe('Booking negative cases', () => {
  test('update without a token is forbidden', async ({ bookingClient }) => {
    const id = await createBookingId(bookingClient);

    const response = await bookingClient.updateBooking(id, newBooking({ lastname: 'Unauthorized' }));

    expect(response.status()).toBe(403);
  });

  test('get a booking that does not exist', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(999999999);

    expect(response.status()).toBe(404);
  });
});
