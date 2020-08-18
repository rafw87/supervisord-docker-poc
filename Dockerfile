# Debian Buster + Python 3.8 + NodeJS 14
FROM nikolaik/python-nodejs:python3.8-nodejs14

RUN pip install supervisor

WORKDIR /opt/supervisor

COPY . .

RUN find . -type f

RUN cd node_apps && yarn

RUN groupadd -g 999 supervisor && \
    useradd -r -u 999 -g supervisor supervisor && \
    chown -R supervisor:supervisor .

RUN mkdir -p /var/log/supervisor && \
    chown -R supervisor:supervisor /var/log/supervisor

USER supervisor
VOLUME /var/log/supervisor
EXPOSE 8080
EXPOSE 8081
CMD [ "supervisord", "-c", "supervisord.conf" ]

