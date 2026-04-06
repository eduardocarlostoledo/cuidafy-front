# Stage 1 — Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_APP_API_URL
ARG VITE_APP_BACK
ARG VITE_APP_GOOGLE_ID
ARG VITE_APP_MERCADOPAGO

ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV VITE_APP_BACK=$VITE_APP_BACK
ENV VITE_APP_GOOGLE_ID=$VITE_APP_GOOGLE_ID
ENV VITE_APP_MERCADOPAGO=$VITE_APP_MERCADOPAGO

RUN npm run build

# Stage 2 — Serve
FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
