FROM node:22-alpine

WORKDIR /app

# Change ownership of workdir to node user (UID 1000, already exists in node:alpine)
RUN chown -R node:node /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3002

CMD ["npm", "run", "dev"]
