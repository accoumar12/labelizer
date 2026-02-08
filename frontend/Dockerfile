FROM node:lts as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
