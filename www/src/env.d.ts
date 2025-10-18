type LangId = 'en' | 'pl';
type Breadcrumb = { text: string; href: string };

declare namespace App {
    interface Locals {
        req?: import('express').Request;
        formData?: FormData;
        jsonData?: unknown;
        langId: LangId;
        user: import('@backend/user').User | null;
        redirectToLoginPage: () => Response;
    }

    interface SessionData {
        userId?: string | null;
    }
}

interface ImportMetaEnv {
    readonly POSTGRES_DB: string;
    readonly POSTGRES_USER: string;
    readonly POSTGRES_PASSWORD: string;
    readonly POSTGRES_HOST: string;
    readonly POSTGRES_PORT: string | undefined;
    readonly EMAIL_IMG_DIR: string;
    readonly MOODLE_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
