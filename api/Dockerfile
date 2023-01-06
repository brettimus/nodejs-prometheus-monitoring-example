# NOTE - This file is for demonstration purposes only
#        Do not use this in a production env

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "node", "app.js" ]