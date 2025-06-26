FROM node

WORKDIR /home/user-service

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm 

COPY ./src/prisma ./src/prisma

RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

# docker build . -t user-service

# docker run -d --net nodeadv04-net --name user-service user-service
