import { computed, isRef, type Ref, toValue } from 'vue';
import { type MaybeRefOrGetter, useCloned, useFetch, type UseFetchOptions, type UseFetchReturn } from '@vueuse/core';

type NonUndefined = NonNullable<unknown> | null;

async function apiFetch<T extends NonUndefined = NonUndefined>(
    input: string | URL | Request,
    init?: RequestInit,
): Promise<NoInfer<T> | undefined> {
    const response = await fetch(input, init).catch((error: unknown) => {
        console.error(`API: fetch failed with error:\n`, error);
        return undefined;
    });

    if (!response) {
        return undefined;
    }

    if (!response.ok) {
        console.error(`API: request failed with status ${response.status} ${response.statusText}\n`, response);
        return undefined;
    }

    return (await response.json().catch((error: unknown) => {
        console.error(`API: failed to parse response body\n`, error);
        return undefined;
    })) as T | undefined;
}

function prepareUrl(resource: string | URL, params?: URLSearchParams): URL {
    const url = new URL(resource, document.baseURI);

    if (params !== undefined) {
        for (const [paramName, paramValue] of params.entries()) {
            url.searchParams.append(paramName, paramValue);
        }
    }

    return url;
}

/** Makes a GET requrest to the API and returns `undefined` if there was en error. */
export async function apiGet<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    params?: URLSearchParams,
): Promise<NoInfer<T> | undefined> {
    const url = prepareUrl(resource, params);

    return await apiFetch<T>(url);
}

function parseApiArgs(resource: string | URL, arg1: NonUndefined, arg2: unknown) {
    // Determine arguments based on their count and types for different signatures
    let params: URLSearchParams | undefined;
    if (arg2 !== undefined) {
        if (!(arg1 instanceof URLSearchParams)) {
            throw new Error('Invalid params argument');
        }

        params = arg1;
    }

    const body = arg2 !== undefined ? arg2 : arg1;

    const url = prepareUrl(resource, params);

    if (body instanceof FormData) {
        return {
            url,
            body,
            headers: {
                // The Content-Type header will be set by the browser with the correct boundary value
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects#sending_files_using_a_formdata_object
            },
        };
    } else if (body instanceof URLSearchParams) {
        return {
            url,
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
    } else {
        return {
            url,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
}

/** Makes a POST requrest to the API and returns `undefined` if there was en error. */
export async function apiPost<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    body: NonUndefined,
): Promise<NoInfer<T> | undefined>;

/** Makes a POST requrest to the API and returns `undefined` if there was en error. */
export async function apiPost<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    params: URLSearchParams,
    body: NonUndefined,
): Promise<NoInfer<T> | undefined>;

/** Makes a POST requrest to the API and returns `undefined` if there was en error. */
export async function apiPost<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    arg1: NonUndefined,
    arg2?: unknown,
): Promise<NoInfer<T> | undefined> {
    const { url, body, headers } = parseApiArgs(resource, arg1, arg2);

    return await apiFetch<T>(url, {
        method: 'POST',
        headers,
        body,
    });
}

/** Makes a PATCH requrest to the API and returns `undefined` if there was en error. */
export async function apiPatch<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    body: NonUndefined,
): Promise<NoInfer<T> | undefined>;

/** Makes a PATCH requrest to the API and returns `undefined` if there was en error. */
export async function apiPatch<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    params: URLSearchParams,
    body: NonUndefined,
): Promise<NoInfer<T> | undefined>;

/** Makes a PATCH requrest to the API and returns `undefined` if there was en error. */
export async function apiPatch<T extends NonUndefined = NonUndefined>(
    resource: string | URL,
    arg1: NonUndefined,
    arg2?: unknown,
): Promise<NoInfer<T> | undefined> {
    const { url, body, headers } = parseApiArgs(resource, arg1, arg2);

    return await apiFetch<T>(url, {
        method: 'PATCH',
        headers,
        body,
    });
}

interface UseApiFetchCommonOptions extends UseFetchOptions {
    resetDataOnError?: boolean;
}

export interface UseApiFetchNotClonedOptions extends UseApiFetchCommonOptions {
    /** Returns the data as a cloned `Ref` instead of a `ShallowRef`. Useful for optimistic updates. */
    clone?: false;
}

export interface UseApiFetchClonedOptions extends UseApiFetchCommonOptions {
    /** Returns the data as a cloned `Ref` instead of a `ShallowRef`. Useful for optimistic updates. */
    clone: true;
}

export type UseApiFetchOptions = UseApiFetchNotClonedOptions | UseApiFetchClonedOptions;

export interface UseFetchReturnCloned<T> extends UseFetchReturn<T> {
    data: Ref<T | null, T | null>;
}

export type UseApiFetchReturnNonCloned<T> = UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;

export type UseApiFetchReturnCloned<T> = UseFetchReturnCloned<T> & PromiseLike<UseFetchReturnCloned<T>>;

export type UseApiFetchReturn<T> = UseApiFetchReturnNonCloned<T> | UseApiFetchReturnCloned<T>;

export function useApiFetch<T>(
    url: MaybeRefOrGetter<string | URL>,
    params: MaybeRefOrGetter<URLSearchParams>,
    useFetchOptions?: UseApiFetchNotClonedOptions,
): UseApiFetchReturnNonCloned<T>;

export function useApiFetch<T>(
    url: MaybeRefOrGetter<string | URL>,
    params: MaybeRefOrGetter<URLSearchParams>,
    useFetchOptions?: UseApiFetchClonedOptions,
): UseApiFetchReturnCloned<T>;

export function useApiFetch<T>(
    url: MaybeRefOrGetter<string | URL>,
    useFetchOptions?: UseApiFetchNotClonedOptions,
): UseApiFetchReturnNonCloned<T>;

export function useApiFetch<T>(
    url: MaybeRefOrGetter<string | URL>,
    useFetchOptions?: UseApiFetchClonedOptions,
): UseApiFetchReturnCloned<T>;

export function useApiFetch<T>(
    url: MaybeRefOrGetter<string | URL>,
    arg1?: MaybeRefOrGetter<URLSearchParams> | UseApiFetchOptions,
    arg2?: UseApiFetchOptions,
): UseApiFetchReturn<T> {
    const { params, options } =
        isRef(arg1) || typeof arg1 === 'function' || arg1 instanceof URLSearchParams
            ? { params: arg1, options: arg2 }
            : { options: arg1 };

    const result: UseApiFetchReturn<T> = useFetch(
        computed(() => prepareUrl(toValue(url), toValue(params)).toString()),
        {
            refetch: true,
            updateDataOnError: options?.resetDataOnError === true,
            onFetchError(ctx) {
                const isAbortError = ctx.error instanceof DOMException && ctx.error.name === 'AbortError';

                if (!isAbortError) {
                    console.error(`API: fetch failed with error:\n`, ctx.error);
                }

                if (options?.resetDataOnError === true) {
                    ctx.data = null;
                }

                return ctx;
            },
            ...options,
        },
    ).json<T>();

    if (options?.clone === true) {
        const { cloned } = useCloned(result.data);

        result.data = cloned;
    }

    return result;
}
