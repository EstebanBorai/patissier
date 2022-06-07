import { describe, expect, it } from 'vitest';

import { Cookie } from '../src';
import { SameSite } from '../src/cookie';

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
    invalidCookieNames.forEach((val) =>
      expect(() => cookie.setName(val)).toThrowError(
        /^Invalid cookie name provided$/,
      ),
    );
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
    invalidCookieValues.forEach((val) =>
      expect(() => cookie.setValue(val)).toThrowError(
        /^Invalid cookie value provided$/,
      ),
    );
  });

  it('parses string into byte array', () => {
    const bytes = Cookie['bytes'];
    const uint8 = bytes('Hello World!');
    const expec = new Uint8Array([
      72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33,
    ]);

    expect(uint8).toEqual(expec);
  });

  it('creates a cookie w/o any attributes', () => {
    const cookie = new Cookie();
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    cookie.setName('token');
    cookie.setValue(jwtToken);

    expect(cookie.toString()).toStrictEqual(`token=${jwtToken}`);
  });

  it('creates a cookie with expirity date', () => {
    const now = new Date();
    const cookie = new Cookie();

    cookie.setName('pieCookingTime');
    cookie.setValue('thePieWillBeReadyWhenTheCookieExpires');
    cookie.setExpires(now);

    expect(cookie.toString()).toStrictEqual(
      `pieCookingTime=thePieWillBeReadyWhenTheCookieExpires; Expires=${now.toUTCString()}`,
    );
  });

  it('complains when a unexpected data type is provided for expires', () => {
    expect.assertions(2);

    const cookie = new Cookie();

    cookie.setName('pieCookingTime');
    cookie.setValue('thePieWillBeReadyWhenTheCookieExpires');

    expect(() =>
      cookie.setExpires(String('Hello') as unknown as Date),
    ).toThrowError(TypeError);
    expect(() =>
      cookie.setExpires(String('Hello') as unknown as Date),
    ).toThrowErrorMatchingSnapshot();
  });

  it('creates a cookie with same-site lax', () => {
    const cookie = new Cookie();
    const jwtToken = 'someJwtToken';

    cookie.setName('token');
    cookie.setValue(jwtToken);
    cookie.setSameSite(SameSite.Lax);

    expect(cookie.toString()).toStrictEqual(`token=${jwtToken}; SameSite=Lax`);
  });

  it('creates a cookie with same-site none', () => {
    const cookie = new Cookie();
    const jwtToken = 'someJwtToken';

    cookie.setName('token');
    cookie.setValue(jwtToken);
    cookie.setSameSite(SameSite.None);

    expect(cookie.toString()).toStrictEqual(`token=${jwtToken}; SameSite=None`);
  });

  it('creates a cookie with same-site strict', () => {
    const cookie = new Cookie();
    const jwtToken = 'someJwtToken';

    cookie.setName('token');
    cookie.setValue(jwtToken);
    cookie.setSameSite(SameSite.Strict);

    expect(cookie.toString()).toStrictEqual(
      `token=${jwtToken}; SameSite=Strict`,
    );
  });

  it('creates a cookie with max-age', () => {
    const cookie = new Cookie();

    cookie.setName('pieCookingTime');
    cookie.setValue('thePieWillBeReadyWhenTheCookieExpires');
    cookie.setMaxAge(10000);

    expect(cookie.toString()).toStrictEqual(
      `pieCookingTime=thePieWillBeReadyWhenTheCookieExpires; Max-Age=10000`,
    );
  });

  it('complains when a unexpected data type is provided for max-age', () => {
    expect.assertions(2);

    const cookie = new Cookie();

    cookie.setName('pieCookingTime');
    cookie.setValue('thePieWillBeReadyWhenTheCookieExpires');

    expect(() =>
      cookie.setMaxAge(new Date() as unknown as number),
    ).toThrowError(TypeError);
    expect(() =>
      cookie.setMaxAge(new Date() as unknown as number),
    ).toThrowErrorMatchingSnapshot();
  });

  it('creates a cookie with path', () => {
    const cookie = new Cookie();

    cookie.setName('token');
    cookie.setValue('coolToken');
    cookie.setPath('/account');

    expect(cookie.toString()).toStrictEqual(`token=coolToken; Path=/account`);
  });

  it('complains if the argument to `setPath` doest starts with forward slash (/)', () => {
    const cookie = new Cookie();

    cookie.setName('token');
    cookie.setValue('coolToken');

    expect.assertions(2);
    expect(() => cookie.setPath('cookies')).toThrowError(
      'Invalid value provided to `Path`. Expected a string prefixed with the forward slash character. E.g. `/docs`.',
    );
    expect(() => cookie.setPath('cookies')).toThrowErrorMatchingSnapshot();
  });

  it('complains if the argument to `setPath` is not an instance of string', () => {
    const cookie = new Cookie();

    cookie.setName('token');
    cookie.setValue('coolToken');

    expect(() => cookie.setPath(1 as unknown as string)).toThrowError(
      'Expected a value of type "string". But received "Number" instead.',
    );
    expect(() =>
      cookie.setPath(1 as unknown as string),
    ).toThrowErrorMatchingSnapshot();
  });
});
