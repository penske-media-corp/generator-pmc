FROM node

ADD docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

WORKDIR /generator-pmc

VOLUME /generator-pmc
VOLUME /usr/local/lib/node_modules

ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "/bin/bash" ]
