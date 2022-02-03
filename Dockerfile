FROM node:16-buster

# Set working dir
WORKDIR /usr/src/app

# Install deps
COPY ./package.json ./package.json
RUN npm install

# Copy code
COPY ./ ./

COPY ./.env.docker ./.env
