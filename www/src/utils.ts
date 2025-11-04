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

export function stringToHslColor(str: string): string {
    const hash = murmurhash3_32_gc(str, 2);
    const h = hash % 360;
    const s = 30;
    const l = 40;

    return `hsl(${h} ${s} ${l})`;
}
