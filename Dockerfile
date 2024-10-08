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
COPY --from=builder /app/sourceData/csv/*.csv /app/sourceData/csv/
COPY --from=builder /app/config/orm.config.ts ./config/orm.config.ts
COPY --from=builder /app/config/email.config.ts ./config/email.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 3000

CMD [ "sh", "-c", "node /app/dist/src/main.js"]