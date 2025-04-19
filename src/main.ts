import express from 'express';
import session from 'express-session';
import { ssrHandler } from './ssr-handler.js';
import { requestLogger } from './request-logger.js';

const config = {
    port: 8080,
};

const app = express();

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.use(requestLogger);

app.use('/', express.static('www/dist/client/'));

app.use(
    session({
        store: undefined,
        secret: crypto.getRandomValues(new Int8Array(32)),
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
    });
});
