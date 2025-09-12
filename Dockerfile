# Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package*.json ./
RUN npm install

# source
COPY . .

# env dosyasını container içinde otomatik al
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "index.js"]
