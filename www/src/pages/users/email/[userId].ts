import assert from 'node:assert';
import fs from 'node:fs';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import { env } from 'src/utils';
import { User } from '@backend/user';

async function createImageResponse(path: string): Promise<Response> {
    const data = await fs.promises.readFile(path);
    return new Response(data as BodyInit, { headers: { 'Content-Type': 'image/png' } });
}

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

    const imagePath = join(env.EMAIL_IMG_DIR, `${user.id}.png`);

    try {
        return await createImageResponse(imagePath);
    } catch (error) {
        console.warn(`Cannot read email image for user ${user.name}, generating new one... error: `, error);
    }

    await user.createEmailImage();

    return await createImageResponse(imagePath);
};
