import { describe, expect, it } from 'vitest';

import { Cookie } from '../src';

describe('cookie', () => {
  it('creates a cookie with all attributes as null by default', () => {
    const cookie = new Cookie();

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

  it('builds a cookie into a string', () => {
    const cookie = new Cookie();

    cookie.setName('biscuits');
    cookie.setValue('with_tea');

    expect(cookie.toString()).toStrictEqual('biscuits=with_tea');
  });

  it('complains on invalid cookie names provided', () => {
    const cookie = new Cookie();
    const invalidCookieNames = [
      'some;cookie',
      '"some_cookie"',
      'http:\\\\',
      'hello world',
      '@jamesbond',
      '/giphy',
      'token?',
    ];

    expect.assertions(invalidCookieNames.length);
    invalidCookieNames.forEach((val) => expect(() => cookie.setName(val))
        .toThrowError(/^Invalid cookie name provided$/));
  });

  it('complains on invalid cookie values provided', () => {
    const cookie = new Cookie();
    const invalidCookieValues = [
      'some;cookie',
      '"some_cookie"',
      'http:\\\\',
      'hello world',
    ];

    expect.assertions(invalidCookieValues.length);
    invalidCookieValues.forEach((val) => expect(() => cookie.setValue(val))
      .toThrowError(/^Invalid cookie value provided$/));
  });

  it('parses string into byte array', () => {
    const bytes = Cookie['bytes'];
    const uint8 = bytes('Hello World!');
    const expec = new Uint8Array([
      72,
      101,
      108,
      108,
      111,
      32,
      87,
      111,
      114,
      108,
      100,
      33,
    ]);

    expect(uint8).toEqual(expec);
  });
});
