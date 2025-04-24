import { RedisStore } from 'connect-redis';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import { requestLogger } from './request-logger.js';
import { ssrHandler } from './ssr-handler.js';

const config = {
    port: 8080,
};

const app = express();

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.use(requestLogger);

app.use('/', express.static('www/dist/client/'));

const redisClient = redis.createClient({
    url: process.env.REDIS_URL!,
});
await redisClient.connect();

const redisStore = new RedisStore({
    client: redisClient,
});

app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET ?? crypto.getRandomValues(new Int8Array(32)),
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : undefined,
            maxAge: 1000 * 60 * 60 * 3, // 3 hours
        },
    }),
);

app.use((req, res, next) => {
    const locals = {
        req: req,
        session: req.session,
    };

    ssrHandler(req, res, next, locals);
});

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`${new Date().toISOString().replace('T', ' ')}:`, err);

    if (res.headersSent) {
        next(err);
        return;
    }

    res.status(500).end();
});

const server = app.listen(config.port, error => {
    if (error) {
        console.error(`Failed to start listening on port ${config.port}.`);
        throw error;
    }

    console.log(`Listening on port ${config.port}.`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');

    server.close(() => {
        console.log('HTTP server closed.');

        redisClient
            .quit()
            .then(() => {
                console.log('Redis client closed.');
            })
            .catch(error => {
                console.error('Closing redis client failed.');
                console.error(error);
            });
    });
});
