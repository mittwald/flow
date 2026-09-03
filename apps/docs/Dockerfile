# The docs are built in CI and this image only serves them. A builder stage here
# installed the toolchain a second time and rebuilt the workspace with a cold nx
# cache — 80 of the 449 seconds a preview took, on top of a pnpm install CI had
# already done. The build moved to the workflow; see build-previews.yml.
#
# The context is this directory, so the paths below are relative to it and only
# the built output is sent to the daemon (see .dockerignore).
FROM nginx:alpine

COPY out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
