<div>
  <div align="center" style="display: block; text-align: center;">
    <img src="./docs/cookie.png" height="120" width="120" />
  </div>
  <h1 align="center">cookie-builder</h1>
  <h4 align="center">
    HTTP Cookie builder library following the RFC6265
  </h4>
</div>

<div align="center">

![Build](https://github.com/EstebanBorai/cookie-builder/workflows/build/badge.svg)
![Lint](https://github.com/EstebanBorai/cookie-builder/workflows/lint/badge.svg)
![Tests](https://github.com/EstebanBorai/cookie-builder/workflows/test/badge.svg)

</div>

## Usage

The following snippet makes use of the `CookieBuilder` class which implements
the [builder pattern][1] on the `Cookie` class exported by this library, to
create a HTTP cookie.

```ts
import { CookieBuilder } from 'cookie-builder';

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

assert(
  cookie.toString() ===
    'pepperoni=pizza_is_so_good; Max-Age=1036800; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Lax',
);
```

## Installation

```bash
npm install cookie-builder
```

## Documentation

### `Cookie`

The `Cookie` class is responsible of validating and creating HTTP cookies.
Whenever a new `Cookie` instance is created, all of the attributes will be set
to `null`.

`Cookie` `class` design is thought with the encapsulation principle in mind.

This means that you must use the `class` instance _getters_ in order to
retrieve the current value of one of the `Cookie` attributes values.

Same goes for updating, whenever you want to update one of the instance
attributes, you must use any of the `set*` like methods exposed by `Cookie`.

This is intended to protect values set to the `Cookie` instance to warranty
that the cookie cant be built with invalid attribute values.

#### `Cookie.setName(name: string): void`

Sets the cookie name.

#### `Cookie.setValue(value: string): void`

Sets the cookie value.

#### `Cookie.setSameSite(value: SameSite): void`

Sets the cookie `SameSite` attribute.

Declare wether the cookie should be restricted to a first-party or
same-site context.

- If Same-Site is not specified, then it defaults to `Lax`.

- If the cookie's `SameSite` attribute's value is `None`, then the `Secure`
  attribute must be specified.

- If the cookie is sent to the same domain but with a different scheme, then
  it wont be sent.

> **Warning**: You must provide a variant from the `SameSite` `enum` exported by this library.

[Read more on MDN][2]

#### `Cookie.setExpires(date: Date): void`

    Sets the `Expires` attribute for the cookie.

    The `Expires` attribute specifies the deadline of the cookie. This date
    instance is relative to the client's system clock and not the server's.

    If this value is not specified, the cookie becomes a session cookie, which
    means that the cookie wont persist when the client shut down.

#### `Cookie.setMaxAge(seconds: number): void`

Sets the `Max-Age` attribute for the cookie.

The `Max-Age` attribute accepts a number representing the TTL in seconds
for the cookie. Whenever a 0 or negative value is provided, the cookie
will be considered as expired.

Is important to note, that `Max-Age` has precedence over `Expires`, this
means, that if both attibutes are present, `Max-Age` will defne the final
behavior.

#### `Cookie.setDomain(domain: string): void`

    Defines the host to which the cookie will be sent.

> **Warning**: Leading dots in domain names (`.example.com`) are ignored. This is specified in most recent spects. This library WILL NOT remove any leading dots from the input.

#### `Cookie.setPath(path: string): void`

Indicates a URL path that must exist in the requested URL in order to send
the Cookie header.
The `/` (`%x2F`) character is considered a directory separator,
and subdirectories match as well.

[Read more on MDN][3]

#### `Cookie.setSecure(isSecure: boolean): void`

Sets the `Secure` attribute for the Cookie.

A cookie with the `Secure` attribute is only sent to the server with an
encrypted request over the HTTPS protocol. It's never sent with unsecured
HTTP (except on localhost), which means man-in-the-middle attackers can't
access it easily.

#### `Cookie.setHttpOnly(isHttpOnly: boolean): void`

A cookie with the `HttpOnly` attribute is inaccessible to the JavaScript
`Document.cookie` API; it's only sent to the server.

[Read more on MDN][3]

#### `Cookie.toString(): string`

Builds a HTTP Cookie with the current attributes.

### `CookieBuilder`

The `CookieBuilder` `class` is built around the `Cookie`
API. Most of the methods exposed by the `CookieBuilder` have the same input
types as those from the `Cookie` `class`.

But different to `Cookie`, the `CookieBuilder` will return
it's instance in order to allow access to other methods and
build a `Cookie` instance on a single line.

Similar to `Cookie`, all attributes remain `null` by default.

#### `CookieBuilder.secure(): CookieBuilder`

Sets the `Secure` attribute for the underlying `Cookie`.

#### `CookieBuilder.httpOnly(): CookieBuilder`

Sets the `HttpOnly` attribute for the underlying `Cookie`.

## Releasing

Whenever a tag is pushed a new release is created an the package is
published to the NPM registry using GitHub Actions.

Bump the current version using `npm` as follows:

```sh
# for versions with breaking changes use `major`
npm version major

# for versions with non-breaking changes use `minor`
npm version minor

# for patch versions use `patch`
npm version patch
```

Then push the repository including tag metadata as follows

```sh
git push origin main --follow-tags
```

## License

This project is licensed under the MIT License.

## Contributing

Any contribution to this package is welcome! Don't hesitate on opening a PR or creating an issue!

[1]: https://en.wikipedia.org/wiki/Builder_pattern
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
[3]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
[4]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
