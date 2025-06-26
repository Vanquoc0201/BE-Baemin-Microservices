FROM node

WORKDIR /home/api-gateway

COPY package*.json .

RUN npm config set network-timeout 3000000

RUN npm 

COPY . .

RUN npm run build

EXPOSE 8081

CMD ["npm", "start:dev"]

# docker build . -t api-gateway

# docker run -d -p 8081:8081 --name api-gateway api-gateway