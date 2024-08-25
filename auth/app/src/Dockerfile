FROM node:19.5.0-alpine

ENV WORKINGDIR=/root/app

WORKDIR ${WORKINGDIR}

COPY . ${WORKINGDIR}/

RUN npm install

EXPOSE 4000

RUN npm run swagger-autogen

CMD npm start
