FROM node:21-alpine AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm ci --only=production
COPY . .

RUN npm run build

FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
