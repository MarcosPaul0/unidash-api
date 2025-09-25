FROM node:20 as builder

ENV NODE_ENV build

USER node
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate \
    && npm run build \
    && npm prune --omit=dev

# ---

FROM node:20.17.0

ENV NODE_ENV production

USER node
WORKDIR /usr/app

COPY --from=builder --chown=node:node /usr/app/.env ./
COPY --from=builder --chown=node:node /usr/app/package*.json ./
COPY --from=builder --chown=node:node /usr/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/app/dist/ ./dist/
COPY --from=builder --chown=node:node /usr/app/common/ ./common/
COPY --from=builder --chown=node:node /usr/app/prisma/ ./prisma/
COPY --from=builder --chown=node:node /usr/app/nginx.conf ./

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/infra/main.js"]