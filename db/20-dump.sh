#!/usr/bin/env bash

mkdir -p /var/lib/postgresql/data/dumps
pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" --clean -f /var/lib/postgresql/data/dumps/mock.sql
