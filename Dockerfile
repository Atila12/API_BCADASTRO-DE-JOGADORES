FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]