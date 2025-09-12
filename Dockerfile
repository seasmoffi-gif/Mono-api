# Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

# 1️⃣ package.json ve package-lock.json kopyala (bu adım cache için önemli)
COPY package*.json ./

# 2️⃣ bağımlılıkları yükle
RUN npm install

# 3️⃣ uygulama kodlarını kopyala
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
