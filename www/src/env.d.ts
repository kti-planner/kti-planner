type LangId = 'en' | 'pl';

declare namespace App {
    interface Locals {
        req: import('express').Request;
        session: import('express-session').Session & Partial<import('express-session').SessionData>;
        formData?: FormData;
        jsonData?: unknown;
        langId: LangId;
    }
}
