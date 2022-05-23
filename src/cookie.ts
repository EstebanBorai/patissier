export class Cookie {
  private _name: string;
  private _value: string;
  private _expires: Date;
  private _maxAge: number;
  private _domain: string;
  private _path: string;
  private _secure: boolean;
  private _httpOnly: boolean;
  private _sameSite: boolean;

  constructor(name: string, value: string) {
    this._name = name;
    this._value = value;
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

  get sameSite(): boolean {
    return this._sameSite;
  }

  toString(): string {
    const parts = [`${this._name}=${this._value}`];

    if (this._expires !== null) {
      parts.push(`expires=${this._expires.toUTCString()}`);
    }

    if (this._maxAge !== null) {
      parts.push(`max-age=${this._maxAge}`)
    }

    if (this._domain !== null) {
      parts.push(`domain=${this._domain}`);
    }

    if (this._path !== null) {
      parts.push(`path=${this._path}`)
    }

    return parts.join(';');
  }
}
