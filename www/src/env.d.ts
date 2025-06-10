type LangId = 'en' | 'pl';
type Breadcrumb = { text: string; href: string };

declare namespace App {
    interface Locals {
        req?: import('express').Request;
        formData?: FormData;
        jsonData?: unknown;
        langId: LangId;
        user: import('@backend/user').User | null;
    }

    interface SessionData {
        userId?: string | null;
    }
}
