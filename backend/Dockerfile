FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Default command to start the server
CMD ["node", "server.js"]