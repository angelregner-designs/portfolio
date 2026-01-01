FROM node:22-alpine

WORKDIR /app

# Change ownership of workdir to node user (UID 1000, already exists in node:alpine)
RUN chown -R node:node /app

# Copy package files
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

USER node

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source (will be overridden by volume mount in dev)
COPY --chown=node:node . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
