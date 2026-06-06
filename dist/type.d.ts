export interface ExtractResult {
    lat: number;
    lng: number;
    resolvedUrl: string;
}
export interface ExtractOptions {
    /** Custom User-Agent header. Default: Mozilla/5.0 */
    userAgent?: string;
    /** Request timeout in milliseconds. Default: 10000 */
    timeout?: number;
    /** Max redirects to follow. Default: 10 */
    maxRedirects?: number;
}
export type SupportedUrl = "maps.app.goo.gl" | "goo.gl/maps" | "maps.google.com" | "www.google.com/maps";
export interface ExtractError extends Error {
    code: "INVALID_URL" | "RESOLVE_FAILED" | "COORDS_NOT_FOUND" | "TIMEOUT";
    url: string;
}
//# sourceMappingURL=type.d.ts.map