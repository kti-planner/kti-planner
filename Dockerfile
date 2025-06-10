FROM node:22-alpine AS builder

ARG REDIS_URL

RUN mkdir -p /home/node/build && chown -R node:node /home/node/build
WORKDIR /home/node/build
USER node

COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json

RUN npm ci

COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node src/ src/
COPY --chown=node:node www/astro.config.mjs www/astro.config.mjs
COPY --chown=node:node www/tsconfig.json www/tsconfig.json
COPY --chown=node:node www/src/ www/src/
COPY --chown=node:node www/public/ www/public/

RUN npm run build

FROM node:22-alpine AS runner

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

COPY --chown=node:node --from=builder /home/node/build/package.json package.json
COPY --chown=node:node --from=builder /home/node/build/package-lock.json package-lock.json

RUN npm ci --omit=dev

COPY --chown=node:node --from=builder /home/node/build/build/ build/
COPY --chown=node:node --from=builder /home/node/build/www/dist/ www/dist/

EXPOSE 8080

CMD ["node", "."]
