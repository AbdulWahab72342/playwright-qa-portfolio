import { type APIRequestContext, type APIResponse } from '@playwright/test';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
}

// API equivalent of a page object: one method per endpoint, so tests
// never build URLs or headers themselves. Methods return the raw response
// so each test can assert on status codes as well as the body.
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async getToken(username: string, password: string): Promise<string> {
    const response = await this.createToken(username, password);
    const body = await response.json();
    return body.token;
  }

  getBookingIds(filters?: Record<string, string>): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  // Write operations authenticate with a token sent as a cookie.
  updateBooking(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.auth(token) });
  }

  partialUpdateBooking(id: number, fields: Partial<Booking>, token: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.auth(token) });
  }

  deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.auth(token) });
  }

  private auth(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }
}
