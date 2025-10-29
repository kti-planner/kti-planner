FROM postgres:17.4

COPY 00-init.sql /docker-entrypoint-initdb.d/
