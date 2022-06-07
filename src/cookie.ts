/**
 * A map of characters and their Unicode charcode to avoid executing
 * `String.prototype.charCodeAt` on every `String` when running validations.
 */
const CHAR_CODES = {
  ' ': 32,
  '"': 34,
  '(': 40,
  ')': 41,
  ',': 44,
  '/': 47,
  ':': 58,
  ';': 59,
  '<': 60,
  '=': 61,
  '>': 62,
  '?': 63,
  '@': 64,
  '[': 91,
  '\\': 92,
  ']': 93,
  '{': 123,
  '}': 125,
};

/**
 * Regular Expression to validate domains provided to the `domain` cookie
 * attribute.
 *
 * Earlier specifications for the cookie domain, allowed the preceding dot,
 * but most recent versions ignore the preceding dot. This implementation
 * supports it to provide backwards compatibility.
 */
export const DOMAIN_REGEXP =
  /^(\.)?((?:(?:(?:\w[.\-+]?)*)\w)+)((?:(?:(?:\w[.\-+]?){0,62})\w)+)\.(\w{2,6})$/;

/**
 * Values supported by the `SameSite` attribute.
 */
export enum SameSite {
  /**
   * Cookies will be sent in all contexts, i.e. in responses to both first-party
   * and cross-site requests. If SameSite=None is set, the cookie Secure
   * attribute must also be set (or the cookie will be blocked).
   */
  None = 'None',
  /**
   * Cookies are not sent on normal cross-site subrequests (for example to load
   * images or frames into a third party site), but are sent when a user is
   * navigating to the origin site (i.e., when following a link).
   */
  Lax = 'Lax',
  /**
   * Cookies will only be sent in a first-party context and not be sent along
   * with requests initiated by third party websites.
   */
  Strict = 'Strict',
}

/**
 * `Cookie` represents a RFC6265 specification cookie.
 *
 * Refer: https://www.rfc-editor.org/rfc/rfc6265
 * MDN Documentation: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 */
export class Cookie {
  private _name: string;
  private _value: string;
  private _expires: Date;
  private _maxAge: number;
  private _domain: string;
  private _path: string;
  private _secure: boolean;
  private _httpOnly: boolean;
  private _sameSite: SameSite;

  constructor() {
    this._name = null;
    this._value = null;
    this._expires = null;
    this._maxAge = null;
    this._domain = null;
    this._path = null;
    this._secure = null;
    this._httpOnly = null;
    this._sameSite = null;
  }

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  get expires(): Date {
    return this._expires;
  }

  get maxAge(): number {
    return this._maxAge;
  }

  get domain(): string {
    return this._domain;
  }

  get path(): string {
    return this._path;
  }

  get secure(): boolean {
    return this._secure;
  }

  get httpOnly(): boolean {
    return this._httpOnly;
  }

  /**
   * Allows you to declare if your cookie should be restricted to a
   * first-party or same-site context.
   */
  get sameSite(): SameSite {
    return this._sameSite;
  }

  /**
   * A <cookie-name> can contain any US-ASCII characters except for: the
   * control character, space, or a tab. It also must not contain a separator
   * characters like the following: ( ) < > @ , ; : \ " / [ ] ? = { }.
   */
  setName(name: string): void {
    const isValid = Cookie.bytes(name).every(Cookie.isAllowedNameByte);

    if (isValid) {
      this._name = name;
      return;
    }

    throw new Error('Invalid cookie name provided');
  }

  /**
   * A <cookie-value> can optionally be wrapped in double quotes and include
   * any US-ASCII character excluding a control character, Whitespace, double
   * quotes, comma, semicolon, and backslash.
   */
  setValue(value: string): void {
    const isValid = Cookie.bytes(value).every(Cookie.isAllowedValueByte);

    if (isValid) {
      this._value = value;
      return;
    }

    throw new Error('Invalid cookie value provided');
  }

  /**
   * Declare wether the cookie should be restricted to a first-party or
   * same-site context.
   *
   * - If Same-Site is not specified, then it defaults to `Lax`.
   *
   * - If the cookie's `SameSite` attribute's value is `None`, then the `Secure`
   * attribute must be specified.
   *
   * - If the cookie is sent to the same domain but with a different scheme,
   * then it wont be sent.
   *
   * Refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   */
  setSameSite(value: SameSite): void {
    this._sameSite = value;
  }

  /**
   * Sets the `Expires` attribute for the cookie.
   *
   * The `Expires` attribute specifies the deadline of the cookie. This date
   * instance is relative to the client's system clock and not the server's.
   *
   * If this value is not specified, the cookie becomes a session cookie, which
   * means that the cookie wont persist when the client shut down.
   */
  setExpires(date: Date): void {
    if (date instanceof Date) {
      this._expires = date;
      return;
    }

    throw new TypeError(
      `Expected a "Date" instance. But received "${
        date?.['constructor']?.['name'] || typeof date
      }" instead.`,
    );
  }

  /**
   * Sets the `Max-Age` attribute for the cookie.
   *
   * The `Max-Age` attribute accepts a number representing the TTL in seconds
   * for the cookie. Whenever a 0 or negative value is provided, the cookie
   * will be considered as expired.
   *
   * Is important to note, that `Max-Age` has precedence over `Expires`, this
   * means, that if both attibutes are present, `Max-Age` will defne the final
   * behavior.
   */
  setMaxAge(seconds: number): void {
    if (typeof seconds === 'number') {
      this._maxAge = seconds;
      return;
    }

    throw new TypeError(
      `Expected a value of type "number". But received "${
        seconds?.['constructor']?.['name'] || typeof seconds
      }" instead.`,
    );
  }

  /**
   * Defines the host to which the cookie will be sent.
   *
   * NOTE: Leading dots in domain names (.example.com) are ignored.
   */
  setDomain(domain: string): void {
    if (DOMAIN_REGEXP.test(domain)) {
      this._domain = domain;
      return;
    }

    throw new Error('Invalid domain provided.');
  }

  toString(): string {
    if (this._value === null || this._name === null) {
      throw new Error(
        'Invalid Cookie. You must provide a name and a value for your Cookie.',
      );
    }

    const parts = [`${this._name}=${this._value}`];

    if (this._expires !== null) {
      parts.push(`Expires=${this._expires.toUTCString()}`);
    }

    if (this._maxAge !== null) {
      parts.push(`Max-Age=${this._maxAge}`);
    }

    if (this._domain !== null) {
      parts.push(`Domain=${this._domain}`);
    }

    if (this._path !== null) {
      parts.push(`Path=${this._path}`);
    }

    if (this._secure !== null) {
      parts.push('Secure');
    }

    if (this._httpOnly === true) {
      parts.push('HttpOnly');
    }

    if (this._sameSite !== null) {
      parts.push(`SameSite=${this._sameSite.toString()}`);
    }

    return parts.join('; ');
  }

  private static bytes(str: string): Uint8Array {
    const bytes = Uint8Array.from(str.split('').map((x) => x.charCodeAt(0)));

    return bytes;
  }

  private static isAllowedNameByte(byte: number): boolean {
    return (
      0x20 <= byte &&
      byte < 0x7f &&
      byte != CHAR_CODES['"'] &&
      byte != CHAR_CODES[';'] &&
      byte != CHAR_CODES['\\'] &&
      byte != CHAR_CODES[' '] &&
      byte != CHAR_CODES['('] &&
      byte != CHAR_CODES[')'] &&
      byte != CHAR_CODES['<'] &&
      byte != CHAR_CODES['>'] &&
      byte != CHAR_CODES['@'] &&
      byte != CHAR_CODES[','] &&
      byte != CHAR_CODES[';'] &&
      byte != CHAR_CODES[':'] &&
      byte != CHAR_CODES['\\'] &&
      byte != CHAR_CODES['"'] &&
      byte != CHAR_CODES['/'] &&
      byte != CHAR_CODES['['] &&
      byte != CHAR_CODES[']'] &&
      byte != CHAR_CODES['?'] &&
      byte != CHAR_CODES['='] &&
      byte != CHAR_CODES['{'] &&
      byte != CHAR_CODES['}']
    );
  }

  private static isAllowedValueByte(byte: number): boolean {
    return (
      0x20 <= byte &&
      byte < 0x7f &&
      byte != CHAR_CODES['"'] &&
      byte != CHAR_CODES[';'] &&
      byte != CHAR_CODES['\\'] &&
      byte != CHAR_CODES[' ']
    );
  }
}
