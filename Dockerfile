# syntax=docker/dockerfile:1
FROM node:20-alpine

# Only non-sensitive build metadata here
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
