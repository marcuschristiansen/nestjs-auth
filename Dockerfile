FROM node:12.13-alpine

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY package*.json ./

RUN npm install --only=production

COPY --chown=node:node . .

EXPOSE 8082

CMD ["npm", "run", "start:prod"]
