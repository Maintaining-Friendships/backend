FROM node:14-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

RUN npm install typescript

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "dev"]
