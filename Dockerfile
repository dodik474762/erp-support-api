FROM node:20

RUN mkdir hris-api
RUN cd hris-api

WORKDIR /hris-api

COPY . .

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

RUN npm run build

CMD npm run start:prod