FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE ${PORT}

CMD ["node", "serverRunner.js"]
