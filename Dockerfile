FROM node:20

RUN mkdir erp-support-api
RUN cd erp-support-api

WORKDIR /erp-support-api

COPY . .

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

RUN npm run build

CMD npm run start:prod