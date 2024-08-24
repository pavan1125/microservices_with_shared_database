FROM node:latest

WORKDIR /usr/src/inventory

# Copy order service dependencies
COPY order/package*.json ./
RUN npm install

# Copy shared package.json and install dependencies
COPY shared/package*.json /usr/src/shared/
RUN mkdir -p /usr/src/shared && cd /usr/src/shared && npm install

# Copy shared prisma and source files
COPY shared/prisma /usr/src/shared/prisma
COPY shared/src /usr/src/shared/src

# Copy order service source code
COPY inventory/src /usr/src/inventory/src

# Generate Prisma client
RUN npx prisma generate --schema=/usr/src/shared/prisma/schema.prisma

EXPOSE 3001

CMD ["node", "src/index.js"]
