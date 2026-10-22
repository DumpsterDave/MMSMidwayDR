FROM node:22-alpine

ARG APP_VERSION=dev

ENV NODE_ENV=production \
    PORT=8080 \
    APP_VERSION=$APP_VERSION

WORKDIR /app
COPY app/package.json app/server.js ./

USER node
EXPOSE 8080

CMD ["node", "server.js"]
