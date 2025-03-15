// @ts-expect-error: import js file
import { handler } from '../www/dist/server/entry.mjs';

export const ssrHandler = handler as (...args: any) => void;
