# syntax=docker/dockerfile:1

FROM node:lts

COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
