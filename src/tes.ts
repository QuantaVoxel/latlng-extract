import { extract } from "./index.js";
import type { ExtractError } from "./type.ts";

async function run() {
  const urls = [
    "https://maps.app.goo.gl/ETAXbutPiLGMj2bA9", // valid
    "https://maps.app.goo.gl/123456", // invalid
    "https://invalid-url.com", // not google maps
  ];

  for (const url of urls) {
    console.log(`\nTesting: ${url}`);

    try {
      const result = await extract(url);
      console.log("✅ Success:", result);
    } catch (err) {
      const e = err as ExtractError;

      switch (e.code) {
        case "INVALID_URL":
          console.error("❌ Invalid URL:", e.message);
          break;
        case "RESOLVE_FAILED":
          console.error("❌ URL not found or expired:", e.message);
          break;
        case "COORDS_NOT_FOUND":
          console.error("❌ No coordinates found in:", e.url);
          break;
        case "TIMEOUT":
          console.error("❌ Request timed out:", e.url);
          break;
        default:
          console.error("❌ Unknown error:", e.message);
      }
    }
  }
}

run();
