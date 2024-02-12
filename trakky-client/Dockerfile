FROM node:21-alpine AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

ARG OPENID_AUTH_CLIENT_ID

COPY . .

RUN sed -i 's/"CLIENT_ID";/"'${OPENID_AUTH_CLIENT_ID}'"/g' /app/src/constants.ts
RUN cat ./src/constants.ts

RUN npm run build

FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=builder /app/dist .

ENV NODE_ENV=production

ENTRYPOINT ["nginx", "-g", "daemon off;"]
