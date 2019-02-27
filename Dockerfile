FROM node:8-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install -g typescript \
    && npm install \
    && tsc \
    && apk del build-dependencies

COPY . . 

EXPOSE 3000
CMD node bot.js