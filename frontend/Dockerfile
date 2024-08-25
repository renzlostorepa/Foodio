FROM node:19.5.0-alpine

ENV WORKINGDIR=/root/app

WORKDIR ${WORKINGDIR}

COPY . ${WORKINGDIR}/

RUN npm install -g @angular/cli@16.1.1

RUN npm install --force

EXPOSE 4200

CMD npm run run-angular
