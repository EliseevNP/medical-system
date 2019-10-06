FROM node:10-alpine
WORKDIR /usr/medical-system-frontend
COPY ./ ./
RUN npm install --only=production
CMD npm run start