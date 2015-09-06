FROM node:latest
RUN npm install -g phantomjs

ADD . /opt/preview-server
WORKDIR /opt/preview-server
RUN npm install

CMD ["npm", "run-script", "start"]