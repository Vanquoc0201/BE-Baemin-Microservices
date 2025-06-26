FROM node

WORKDIR /home/notify-service

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm 

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

# docker build . -t notify-service

# docker run -d --net nodeadv04-net --name notify-service notify-service
