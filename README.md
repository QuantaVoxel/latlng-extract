# @quantavoxel/latlng-extract

Extract latitude and longitude coordinates from Google Maps short links and full URLs.

[![npm version](https://img.shields.io/npm/v/@quantavoxel/latlng-extract)](https://www.npmjs.com/package/@quantavoxel/latlng-extract)

```ts
import { extract } from "@quantavoxel/latlng-extract";

const result = await extract("https://maps.app.goo.gl/ETAXbutPiLGMj2bA9");
// { lat: -5.1477, lng: 119.4327, resolvedUrl: "https://www.google.com/maps/..." }
```

---

## Features

- Resolves Google Maps short links (`maps.app.goo.gl`, `goo.gl/maps`)
- Supports full Google Maps URLs (`maps.google.com`, `www.google.com/maps`)
- Typed error codes for clean error handling
- Configurable timeout, User-Agent, and max redirects
- Zero config — works out of the box

## Installation

```bash
npm install @quantavoxel/latlng-extract
```

## Usage

### Basic

```ts
import { extract } from "@quantavoxel/latlng-extract";

const result = await extract("https://maps.app.goo.gl/ETAXbutPiLGMj2bA9");

console.log(result.lat);         // -5.1477
console.log(result.lng);         // 119.4327
console.log(result.resolvedUrl); // https://www.google.com/maps/...
```

### With options

```ts
import { extract } from "@quantavoxel/latlng-extract";

const result = await extract("https://maps.app.goo.gl/ETAXbutPiLGMj2bA9", {
  timeout: 5000,
  userAgent: "MyApp/1.0",
  maxRedirects: 5,
});
```

### Error handling

```ts
import { extract } from "@quantavoxel/latlng-extract";
import type { ExtractError } from "@quantavoxel/latlng-extract";

try {
  const result = await extract("https://maps.app.goo.gl/ETAXbutPiLGMj2bA9");
  console.log(result);
} catch (err) {
  const e = err as ExtractError;

  switch (e.code) {
    case "INVALID_URL":
      console.error("URL is not a valid Google Maps link");
      break;
    case "RESOLVE_FAILED":
      console.error("Link is broken or expired");
      break;
    case "COORDS_NOT_FOUND":
      console.error("Could not find coordinates in the resolved URL");
      break;
    case "TIMEOUT":
      console.error("Request timed out");
      break;
  }
}
```

## API

### `extract(url, options?)`

Resolves a Google Maps URL and extracts its coordinates.

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | Google Maps URL (short or full) |
| `options` | `ExtractOptions` | ❌ | Optional configuration |

**Returns** `Promise<ExtractResult>`

---

### `ExtractResult`

```ts
interface ExtractResult {
  lat: number;         // Latitude
  lng: number;         // Longitude
  resolvedUrl: string; // Final URL after redirect
}
```

### `ExtractOptions`

```ts
interface ExtractOptions {
  userAgent?: string;    // Default: "Mozilla/5.0 (compatible; latlng-extract/1.0)"
  timeout?: number;      // In milliseconds. Default: 10000
  maxRedirects?: number; // Default: 10
}
```

### `ExtractError`

```ts
interface ExtractError extends Error {
  code: "INVALID_URL" | "RESOLVE_FAILED" | "COORDS_NOT_FOUND" | "TIMEOUT";
  url: string; // The original URL passed to extract()
}
```

## Supported URL formats

| Format | Example |
|---|---|
| Short link | `https://maps.app.goo.gl/ETAXbutPiLGMj2bA9` |
| Legacy short link | `https://goo.gl/maps/abc123` |
| Full URL | `https://maps.google.com/maps?q=-5.1477,119.4327` |
| Full URL (www) | `https://www.google.com/maps/place/...@-5.1477,119.4327` |

## Requirements

- Node.js >= 18.0.0

## License

MIT