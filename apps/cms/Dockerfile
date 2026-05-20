FROM node:20-slim AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/cms/package.json apps/cms/
COPY packages/types/package.json packages/types/
RUN pnpm install --frozen-lockfile

FROM node:20-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @unm/cms build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3001
CMD ["pnpm", "--filter", "@unm/cms", "start"]
