FROM node:12.13.0-slim AS builder

# Set locale
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY jest.config.js ./
COPY ./src ./src

RUN npm run test:coverage
