FROM node:10-alpine
WORKDIR /usr/medical-system-backend
COPY package*.json ./
RUN npm ci
COPY ./ ./
CMD ["sh", "-c", "./node_modules/.bin/sequelize db:create; ./node_modules/.bin/sequelize db:migrate; npm run reinit-db; npm run start"]
