# Étape de build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape de production
FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]