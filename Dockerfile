FROM node:18.15

WORKDIR /booking

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]