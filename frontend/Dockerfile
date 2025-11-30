# --- Builder stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Production build (SSR)
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Only prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built app + public assets + config
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "run", "start"]
