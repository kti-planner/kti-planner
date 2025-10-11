import assert from 'node:assert';
import fs from 'node:fs';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import { User } from '@backend/user';

const env = import.meta.env.PROD ? process.env : import.meta.env;

export const GET: APIRoute = async ({ params }) => {
    assert(env.EMAIL_IMG_DIR !== undefined);

    const { userId } = params;

    if (userId === undefined) {
        return new Response(null, { status: 404 });
    }

    const user = await User.fetch(userId);
    if (!user) {
        return new Response(null, { status: 404 });
    }

    const imgPath = join(env.EMAIL_IMG_DIR, `${user.id}.png`);
    try {
        const data = await fs.promises.readFile(imgPath);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return new Response(data, { headers: { 'Content-Type': 'image/png' } });
    } catch (error) {
        console.warn(`Cannot read email image for user ${user.name}, generating new one... (error: ${String(error)})`);
    }

    await user.createEmailImg();

    const data = await fs.promises.readFile(imgPath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Response(data, { headers: { 'Content-Type': 'image/png' } });
};
