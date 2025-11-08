import { expect, test } from 'vitest';
import { isLangId, langIds } from '@backend/lang';

test('lang', () => {
    expect(langIds).toStrictEqual(['pl', 'en']);
    expect(isLangId('foo')).toBe(false);
    expect(isLangId('pl')).toBe(true);
    expect(isLangId('en')).toBe(true);
});
