import express from 'express';
import onHeaders from 'on-headers';

let nextRequestId = 0;

export function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const requestId = nextRequestId;
    nextRequestId++;

    const requestDate = new Date();
    const requestName = `Request ${requestId} ${req.protocol} ${req.method} ${req.hostname}${req.originalUrl} from ${req.ip ?? 'undefined'}`;
    console.log(`${requestDate.toISOString().replace('T', ' ')}: ${requestName}`);

    onHeaders(res, () => {
        const responseDate = new Date();
        const time = responseDate.getTime() - requestDate.getTime();

        const color =
            res.statusCode >= 500
                ? 31 // red
                : res.statusCode >= 400
                  ? 33 // yellow
                  : res.statusCode >= 300
                    ? 36 // cyan
                    : res.statusCode >= 200
                      ? 32 // green
                      : 0; // no color

        const line = `${responseDate.toISOString().replace('T', ' ')}: ${requestName} - status ${res.statusCode} +${time}ms`;
        console.log(`\x1b[${color}m${line}\x1b[0m`);
    });

    next();
}
