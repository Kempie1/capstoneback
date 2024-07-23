FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lock
RUN yarn clean
RUN yarn build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/orm.config.ts ./orm.config.ts
COPY --from=builder /app/migrations.config.ts ./migrations.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

CMD [ "sh", "-c", "node /app/dist/src/main.js"]