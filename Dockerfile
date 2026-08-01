FROM node:22-alpine

WORKDIR /app

# Build the React client
COPY client/ ./client/
RUN cd client && npm ci && npm run build

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
