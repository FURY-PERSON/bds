FROM node:18-alpine as builder

WORKDIR /app

COPY . ./

RUN npm ci \
    && npm run build

FROM node:18-alpine

ENV PORT=80

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD [ "npm", "run", "start:prod" ]
