# Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

# dependencies
RUN npm init -y
RUN npm install express @supabase/supabase-js body-parser dotenv

# source
COPY . .

# env dosyasını container içinde otomatik al
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "index.js"]
