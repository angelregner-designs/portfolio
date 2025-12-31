FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source (will be overridden by volume mount in dev)
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
