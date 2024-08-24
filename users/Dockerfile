FROM node:latest

WORKDIR /usr/src/users

COPY users/package*.json ./

RUN npm install

COPY ../shared/package*.json /usr/src/shared/

RUN cd /usr/src/shared && npm install

COPY ../shared/prisma ./shared/prisma

COPY ../shared/src  /usr/src/shared/src

COPY users/src ./src

RUN npx prisma generate --schema=./shared/prisma/schema.prisma

EXPOSE 3003


CMD ["node", "src/index.js"]
