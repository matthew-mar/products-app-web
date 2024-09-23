FROM node:22

RUN npm install -g http-server

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD ["http-server", "-c-1", "-p", "8080"]
