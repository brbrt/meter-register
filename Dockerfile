FROM ubuntu:trusty

RUN apt-get update
RUN apt-get install -y git nodejs npm

RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD package.json /tmp/npm/package.json
RUN cd /tmp/npm && npm install
RUN mkdir -p /webapp && cp -a /tmp/npm/node_modules /webapp

ADD . /webapp
WORKDIR /webapp

EXPOSE 5080
CMD ["node", "index.js", "--debug"]