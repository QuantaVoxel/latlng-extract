import axios from "axios";
import type { ExtractResult, ExtractOptions, ExtractError } from "./type.d.ts";

const COORD_PATTERNS: RegExp[] = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // @lat,lng
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // !3dLAT!4dLNG
  /ll=(-?\d+\.\d+),(-?\d+\.\d+)/, // ll=lat,lng
  /q=(-?\d+\.\d+),(-?\d+\.\d+)/, // q=lat,lng
  /center=(-?\d+\.\d+),(-?\d+\.\d+)/, // center=lat,lng
];

const SUPPORTED_HOSTS = [
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "www.google.com",
];

function createError(
  message: string,
  code: ExtractError["code"],
  url: string,
): ExtractError {
  const err = new Error(message) as ExtractError;
  err.code = code;
  err.url = url;
  return err;
}

function isValidGoogleMapsUrl(url: string): boolean {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname === "goo.gl" && !pathname.startsWith("/maps")) return false;
    return SUPPORTED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

function parseCoords(text: string): Pick<ExtractResult, "lat" | "lng"> | null {
  for (const pattern of COORD_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    }
  }
  return null;
}

export async function extract(
  url: string,
  options: ExtractOptions = {},
): Promise<ExtractResult> {
  const {
    userAgent = "Mozilla/5.0 (compatible; latlng-extract/1.0)",
    timeout = 10_000,
    maxRedirects = 10,
  } = options;

  if (!isValidGoogleMapsUrl(url)) {
    throw createError(
      `Invalid or unsupported URL: "${url}"`,
      "INVALID_URL",
      url,
    );
  }

  let resolvedUrl: string;
  let responseText: string;

  try {
    const response = await axios.get<string>(url, {
      headers: { "User-Agent": userAgent },
      timeout,
      maxRedirects,
    });

    resolvedUrl = response.request?.res?.responseUrl ?? url;
    responseText = typeof response.data === "string" ? response.data : "";
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
      throw createError(`Request timed out for "${url}"`, "TIMEOUT", url);
    }
    throw createError(
      `Failed to resolve URL: ${(err as Error).message}`,
      "RESOLVE_FAILED",
      url,
    );
  }

  // Try resolved URL first (most reliable), then fallback to HTML body
  const coords = parseCoords(resolvedUrl) ?? parseCoords(responseText);

  if (!coords) {
    throw createError(
      `Could not extract coordinates from "${resolvedUrl}"`,
      "COORDS_NOT_FOUND",
      url,
    );
  }

  return { ...coords, resolvedUrl };
}

export type { ExtractResult, ExtractOptions, ExtractError };
