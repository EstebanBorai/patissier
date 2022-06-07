import { describe, expect, it } from 'vitest';

import { CookieBuilder, SameSite } from '../src';

describe('CookieBuilder', () => {
  it('creates an empty cookie by default', () => {
    const cookie = new CookieBuilder().build();

    expect(cookie.name).toBeNull();
    expect(cookie.value).toBeNull();
    expect(cookie.domain).toBeNull();
    expect(cookie.expires).toBeNull();
    expect(cookie.httpOnly).toBeNull();
    expect(cookie.maxAge).toBeNull();
    expect(cookie.path).toBeNull();
    expect(cookie.sameSite).toBeNull();
    expect(cookie.secure).toBeNull();
  });

  it('sets underlying cookie name', () => {
    const builder = new CookieBuilder().name('token');

    expect(builder['_cookie']['_name']).toStrictEqual('token');
  });

  it('sets underlying cookie value', () => {
    const builder = new CookieBuilder().value('1234');

    expect(builder['_cookie']['_value']).toStrictEqual('1234');
  });

  it('sets underlying cookie domain', () => {
    const builder = new CookieBuilder().domain('example.com');

    expect(builder['_cookie']['_domain']).toStrictEqual('example.com');
  });

  it('sets underlying cookie expires', () => {
    const now = new Date();
    const builder = new CookieBuilder().expires(now);

    expect(builder['_cookie']['_expires']).toBe(now);
  });

  it('sets underlying cookie http only', () => {
    const builder = new CookieBuilder().httpOnly();

    expect(builder['_cookie']['_httpOnly']).toStrictEqual(true);
  });

  it('sets underlying cookie max age', () => {
    const builder = new CookieBuilder().maxAge(7 * 24 * 60 * 60);

    expect(builder['_cookie']['_maxAge']).toStrictEqual(604800);
  });

  it('sets underlying cookie path', () => {
    const builder = new CookieBuilder().path('/docs');

    expect(builder['_cookie']['_path']).toStrictEqual('/docs');
  });

  it('sets underlying cookie same site', () => {
    const builder = new CookieBuilder().sameSite(SameSite.Strict);

    expect(builder['_cookie']['_sameSite']).toStrictEqual(SameSite.Strict);
  });

  it('sets underlying cookie path', () => {
    const builder = new CookieBuilder().secure();

    expect(builder['_cookie']['_secure']).toStrictEqual(true);
  });

  it('builds a cookie into a string', () => {
    const cookie = new CookieBuilder()
      .name('pepperoni')
      .value('pizza_is_so_good')
      .sameSite(SameSite.Lax)
      .maxAge(12 * 24 * 60 * 60)
      .domain('example.com')
      .path('/')
      .secure()
      .httpOnly()
      .build();

    expect(cookie.toString()).toStrictEqual(
      'pepperoni=pizza_is_so_good; Max-Age=1036800; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Lax',
    );
  });
});
