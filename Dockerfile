FROM node:latest
ADD . /opt/preview-server
WORKDIR /opt/preview-server
RUN npm install
RUN npm install -g phantomjs

CMD ["npm", "run-script", "start"]