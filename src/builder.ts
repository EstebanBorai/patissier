import { Cookie, SameSite } from "./cookie.js";

/**
 * Implements the [builder pattern][1] for the `Cookie` class,
 * to allow cookies creation with ease.
 *
 * ```js
 * import { CookieBuilder, SameSite } from 'patissier';
 *
 * const cookie = new CookieBuilder()
 *   .name('pepperoni')
 *   .value('pizza_is_so_good')
 *   .sameSite(SameSite.Lax)
 *   .maxAge(12 * 24 * 60 * 60)
 *   .domain('example.com')
 *   .path('/')
 *   .secure()
 *   .httpOnly()
 *   .build();
 * ```
 *
 * [1]: https://en.wikipedia.org/wiki/Builder_pattern
 */
export class CookieBuilder {
  private readonly _cookie: Cookie;

  constructor() {
    this._cookie = new Cookie();
  }

  name(value: string): CookieBuilder {
    this._cookie.setName(value);

    return this;
  }

  value(value: string): CookieBuilder {
    this._cookie.setValue(value);

    return this;
  }

  sameSite(value: SameSite): CookieBuilder {
    this._cookie.setSameSite(value);

    return this;
  }

  expires(date: Date): CookieBuilder {
    this._cookie.setExpires(date);

    return this;
  }

  maxAge(seconds: number): CookieBuilder {
    this._cookie.setMaxAge(seconds);

    return this;
  }

  domain(domain: string): CookieBuilder {
    this._cookie.setDomain(domain);

    return this;
  }

  path(path: string): CookieBuilder {
    this._cookie.setPath(path);

    return this;
  }

  /**
   * Sets the `Secure` attribute for the underlying `Cookie`.
   */
  secure(): CookieBuilder {
    this._cookie.setSecure(true);

    return this;
  }

  /**
   * Sets the `HttpOnly` attribute for the underlying `Cookie`.
   */
  httpOnly(): CookieBuilder {
    this._cookie.setHttpOnly(true);

    return this;
  }

  build(): Cookie {
    return this._cookie;
  }
}
