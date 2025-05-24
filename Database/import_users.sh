#!/bin/sh

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    \copy users(id, email, username, password_hash, avatar_url, created_at) FROM '/tmp/users.json' WITH (FORMAT json);
EOSQL