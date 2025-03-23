FROM node:18-alpine

WORKDIR /app/core

COPY ./core .

RUN npm install
RUN npx prisma generate
RUN npx prisma migrate dev
RUN npm install typescript
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]