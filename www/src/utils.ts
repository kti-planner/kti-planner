import { murmurhash3_32_gc } from 'src/murmurhash3_32_gc';

export function getNextPage(url: URL): string {
    let nextPage = url.searchParams.get('next') ?? '/';

    if (new URL(nextPage, url).origin !== url.origin) {
        nextPage = '/';
    }

    return nextPage;
}

export function makeLoginNextParam(url: URL): string {
    return `?${new URLSearchParams({ next: url.pathname + url.search })}`;
}

export const env = import.meta.env.PROD ? process.env : import.meta.env;

/**
 * Returns an HEX color generated deterministically from the input string.
 * Used as a background color for white text, it will meet the WCAG AA required contrast ratio of 4.5:1.
 */
export function stringToHexColor(str: string): string {
    const hash = murmurhash3_32_gc(str, 2);
    const hue = hash % 360;
    const saturation = 35;
    const requiredContrast = 4.5;
    const lightness = maxLightnessForWhiteText(hue, saturation, requiredContrast);

    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);

    const f = (n: number) => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/**
 * Returned rgb values are in [0..1] range.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
        return [l, l, l];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) {
            t += 1;
        }

        if (t > 1) {
            t -= 1;
        }

        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }

        if (t < 1 / 2) {
            return q;
        }

        if (t < 2 / 3) {
            return p + (q - p) * 6 * (2 / 3 - t);
        }

        return p;
    };

    const hk = h / 360;
    const r = hueToRgb(p, q, hk + 1 / 3);
    const g = hueToRgb(p, q, hk);
    const b = hueToRgb(p, q, hk - 1 / 3);
    return [r, g, b];
}

/**
 * Needed to calculate relative luminance.
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function srgbToLinear(c: number): number {
    // c in 0..1
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function relativeLuminanceFromHsl(h: number, s: number, l: number): number {
    const [r, g, b] = hslToRgb(h, s, l);
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function relativeLuminanceFromHex(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(hex1: string, hex2: string): number {
    const L1 = relativeLuminanceFromHex(hex1);
    const L2 = relativeLuminanceFromHex(hex2);

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns the maximum lightness (0..100) for the given hue and saturation
 * such that white text on that background meets the given contrast.
 * Uses binary search.
 */
function maxLightnessForWhiteText(
    hue: number,
    saturation = 35,
    requiredContrast = 4.5,
    precision = 1e-3, // stop when L changes by < precision (%)
): number {
    // Our luminance should be <= to this. See https://www.w3.org/WAI/GL/wiki/Contrast_ratio
    const luminanceThreshold = 1.05 / requiredContrast - 0.05;

    let low = 0;
    let high = 100;
    // ~40 iterations gives ample precision
    const iterations = 40;

    for (let i = 0; i < iterations; i++) {
        const mid = (low + high) / 2;
        const lum = relativeLuminanceFromHsl(hue, saturation, mid);
        if (lum <= luminanceThreshold) {
            low = mid;
        } else {
            high = mid;
        }

        if (high - low < precision) {
            break;
        }
    }

    return Math.round(low * 1000) / 1000; // return with milli-percent precision
}
