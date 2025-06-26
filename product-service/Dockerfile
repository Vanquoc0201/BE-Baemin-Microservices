FROM node

WORKDIR /home/product-service

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm 

COPY ./src/prisma ./src/prisma

RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

# docker build . -t product-service

# docker run -d --net nodeadv04-net --name product-service product-service
