FROM node:14-alpine3.11
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY transformers-import.js .
RUN npm run bundle-transformers
COPY . .
ENTRYPOINT ["node", "/app/src/app.js"]
