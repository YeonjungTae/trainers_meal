FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

RUN npm install @tosspayments/tosspayments-sdk --save

RUN npm install react-uuid

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "serve", "-s", "dist" ]