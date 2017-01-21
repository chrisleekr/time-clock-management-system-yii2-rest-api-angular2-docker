FROM node:latest

RUN mkdir -p /frontend /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /frontend
COPY package.json /frontend/
RUN npm install --unsafe-perm=true &&\
        npm install -g angular-cli

COPY . /frontend
RUN chown -R nodejs:nodejs /frontend
USER nodejs

CMD ng serve --host 0.0.0.0