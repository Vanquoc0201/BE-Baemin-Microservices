FROM node

WORKDIR /home/payment-service

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

# docker build . -t payment-service

# docker run -d --net nodeadv04-net --name payment-service payment-service
