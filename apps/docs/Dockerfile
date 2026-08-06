FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

ARG NEXT_BASE_PATH=""
ENV NEXT_BASE_PATH=$NEXT_BASE_PATH

# Optional build-time data toggle for the Releases page. Defaults to empty, so
# production (deploy-main passes no such arg) renders the live/empty-state page.
# The PR preview build sets it to "1" to render the dummy dataset for review.
ARG RELEASES_USE_DUMMY=""
ENV RELEASES_USE_DUMMY=$RELEASES_USE_DUMMY

RUN pnpm nx build docs

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/docs/out /usr/share/nginx/html
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

