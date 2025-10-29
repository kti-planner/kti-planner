FROM postgres:18.0

COPY 00-init.sql /docker-entrypoint-initdb.d/
