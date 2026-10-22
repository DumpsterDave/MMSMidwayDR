FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app
COPY app/package.json app/server.js ./

USER node
EXPOSE 8080

CMD ["node", "server.js"]
