FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production


FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

COPY --from=builder --chown=node:node /home/node/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
