FROM postgres:18.0

COPY 00-init.sql /docker-entrypoint-initdb.d/
COPY 05-install.sql /docker-entrypoint-initdb.d/
