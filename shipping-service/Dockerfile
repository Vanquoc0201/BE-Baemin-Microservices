FROM node

WORKDIR /home/shipping-service

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm 

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

# docker build . -t shipping-service 

# docker run -d --net nodeadv04-net --name shipping-service shipping-service
