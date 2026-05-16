# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time env var — replaced at runtime via nginx or injected here
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_RAZORPAY_KEY_ID=rzp_test_mock
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

ARG VITE_GOOGLE_CLIENT_ID=708795054898-isa0rm91ifpn8hr1ocq5e0s7fj76fjbi.apps.googleusercontent.com
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
