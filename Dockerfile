FROM node:22-alpine AS builder

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY tsconfig.json tsconfig.json
COPY src/ src/
COPY www/astro.config.mjs www/astro.config.mjs
COPY www/tsconfig.json www/tsconfig.json
COPY www/src/ www/src/
COPY www/public/ www/public/

RUN npm run build

FROM node:22-alpine AS runner

COPY --from=builder package.json package.json
COPY --from=builder package-lock.json package-lock.json

RUN npm ci --omit=dev

COPY --from=builder build/ build/
COPY --from=builder www/dist/ www/dist/

EXPOSE 8080

CMD ["node", "."]
