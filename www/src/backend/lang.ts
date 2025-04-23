export const langIds: LangId[] = ['pl', 'en'];

export function isLangId(lang: string): lang is LangId {
    return (langIds as string[]).includes(lang);
}
