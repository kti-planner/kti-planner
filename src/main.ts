import express from 'express';
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

app.use((req, res, next) => {
    const locals = {};

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

const server = app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}.`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');

    server.close(() => {
        console.log('HTTP server closed.');
    });
});
