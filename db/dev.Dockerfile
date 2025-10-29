FROM postgres:17.4

COPY 00-init.sql /docker-entrypoint-initdb.d/
COPY 10-mock.sql /docker-entrypoint-initdb.d/
COPY 20-dump.sh /docker-entrypoint-initdb.d/
