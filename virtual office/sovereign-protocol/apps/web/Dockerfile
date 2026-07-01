# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json turbo.json ./
COPY packages/ packages/
COPY apps/web/ apps/web/

# Install dependencies and build
RUN npm install
RUN npm run build --filter=web...

# Production Stage
FROM nginx:alpine

# Copy built static assets to Nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
