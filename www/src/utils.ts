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
 * Returns an HSL color generated deterministically from the input string.
 * Used as a background color for white text, it will meet the WCAG AA required contrast ratio of 4.5:1.
 */
export function stringToHslColor(str: string): string {
    const hash = murmurhash3_32_gc(str, 2);
    const hue = hash % 360;
    const saturation = 35;
    const requiredContrast = 4.5;
    const lightness = maxLightnessForWhiteText(hue, saturation, requiredContrast);

    return `hsl(${hue} ${saturation} ${lightness})`;
}

/**
 * @see https://github.com/garycourt/murmurhash-js
 */
function murmurhash3_32_gc(key: string, seed = 0): number {
    const remainder = key.length & 3;
    const bytes = key.length - remainder;
    let h1 = seed;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;
    let i = 0;

    while (i < bytes) {
        let k1 =
            (key.charCodeAt(i) & 0xff) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);

        ++i;

        k1 = Math.imul(k1, c1);
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = Math.imul(k1, c2);

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1 = Math.imul(h1, 5) + 0xe6546b64;
    }

    /* eslint-disable no-fallthrough */

    let k1 = 0;
    switch (remainder) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= key.charCodeAt(i) & 0xff;
            k1 = Math.imul(k1, c1);
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = Math.imul(k1, c2);
            h1 ^= k1;
    }

    /* eslint-enable no-fallthrough */

    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = Math.imul(h1, 0x85ebca6b);
    h1 ^= h1 >>> 13;
    h1 = Math.imul(h1, 0xc2b2ae35);
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
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
    // Our liminance should be <= to this. See https://www.w3.org/WAI/GL/wiki/Contrast_ratio
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
