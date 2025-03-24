
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm install

COPY . .

WORKDIR /app/client
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/client ./

EXPOSE 3000

CMD ["npm", "start"]