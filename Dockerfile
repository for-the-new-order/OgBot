FROM node:13.8.0-alpine AS build
ENV NODE_ENV production
WORKDIR /app

RUN npm install -g typescript

COPY ["*.ts", "*.json", "./"]
RUN npm ci --quiet && npm run build

FROM node:13.8.0-alpine AS deploy
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./

RUN npm ci --quiet --only=production

EXPOSE 3000
CMD node bot.js