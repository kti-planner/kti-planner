FROM node:22-alpine AS builder

COPY . .

RUN npm ci

RUN npm run build

FROM node:22-alpine AS runner

COPY --from=builder package.json package.json
COPY --from=builder package-lock.json package-lock.json
COPY --from=builder build build
COPY --from=builder www/dist www/dist

ENV NODE_ENV=production

RUN npm ci

EXPOSE 8080

CMD ["node", "build/main.js"]
