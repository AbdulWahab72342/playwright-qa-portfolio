import { test, expect } from '../../api/fixtures';
import { ADMIN } from '../../test-data/bookings';

test.describe('Health check and authentication', () => {
  test('API is up', async ({ bookingClient }) => {
    const response = await bookingClient.ping();

    // Restful Booker returns 201 Created for its health check.
    expect(response.status()).toBe(201);
  });

  test('valid credentials return a token', async ({ bookingClient }) => {
    const response = await bookingClient.createToken(ADMIN.username, ADMIN.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid credentials return "Bad credentials"', async ({ bookingClient }) => {
    const response = await bookingClient.createToken(ADMIN.username, 'wrong_password');

    // The API reports a failed login with status 200 and a reason, not 401.
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ reason: 'Bad credentials' });
  });
});
