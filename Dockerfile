FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3456

CMD [ "node", "index.js" ]