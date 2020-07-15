FROM node:10.19.0-jessie AS builder

# Set locale
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./json ./json
COPY ./src ./src
RUN npm install
RUN npm run test:coverage

# RUN npm run start -- report ./json

# docker run --rm -ti typescript-node-json-files_nodecli /bin/sh
