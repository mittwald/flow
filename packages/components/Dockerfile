# Storybook is built in CI and this image only serves it — same reasoning as
# apps/docs/Dockerfile. The context is this directory.
FROM nginx:alpine

COPY storybook-static /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
