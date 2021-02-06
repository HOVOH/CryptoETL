FROM node:12

RUN npm install -g typescript ts-node
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENTRYPOINT ["npm","prod"]
