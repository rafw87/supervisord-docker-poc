# Debian Buster + Python 3.8 + NodeJS 14
FROM nikolaik/python-nodejs:python3.8-nodejs14

RUN pip install supervisor

WORKDIR /opt/supervisor

COPY . .

RUN find . -type f

RUN cd node_apps && yarn

VOLUME /var/log/supervisor
EXPOSE 8080
EXPOSE 8081
CMD [ "supervisord", "-c", "supervisord.conf" ]

