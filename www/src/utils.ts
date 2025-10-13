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
