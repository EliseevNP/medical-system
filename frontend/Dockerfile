FROM node:10-alpine
WORKDIR /usr/medical-system-frontend
COPY package*.json ./
RUN npm ci
COPY ./ ./
CMD npm run start
