type LangId = 'en' | 'pl';
type Breadcrumb = { text: string; href: string };

declare namespace App {
    interface Locals {
        req: import('express').Request;
        session: import('express-session').Session & Partial<import('express-session').SessionData>;
        formData?: FormData;
        jsonData?: unknown;
        langId: LangId;
        user: import('@backend/user').User | null;
    }
}
