export function getNextPage(url: URL): string {
    let nextPage = url.searchParams.get('next') ?? '/';

    if (new URL(nextPage, url).origin !== url.origin) {
        nextPage = '/';
    }

    return nextPage;
}
