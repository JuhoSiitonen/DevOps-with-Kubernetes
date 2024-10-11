FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ARG PORT

ENV PORT=${PORT}

RUN npm install

COPY . .

CMD ["node", "index.js"]