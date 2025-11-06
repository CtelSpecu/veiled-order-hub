FROM node:18-alpine as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm -w build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY frontend/package.json ./frontend/package.json
EXPOSE 3000
CMD ["node","frontend/.next/standalone/server.js"]
