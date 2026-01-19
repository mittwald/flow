FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm nx run-many --target=build --projects=components

RUN pnpm nx build:storybook components

FROM nginx:alpine AS runner

COPY --from=builder /app/packages/components/storybook-static /usr/share/nginx/html
COPY packages/components/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

