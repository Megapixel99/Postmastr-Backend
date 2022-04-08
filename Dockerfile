FROM node:16.14.0

RUN apt-get update

WORKDIR /home/node/app

RUN mkdir ./uploads

RUN chmod 777 ./uploads

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
