FROM node:12

RUN npm install -g typescript ts-node
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
ENTRYPOINT ["npm","start"]
