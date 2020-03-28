FROM node:13.8.0-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript
RUN npm install --quiet
RUN npm audit fix

COPY . .

RUN npm run build

FROM node:13.8.0-alpine AS deploy
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./

RUN npm ci --quiet --only=production

EXPOSE 3000
CMD node bot.js