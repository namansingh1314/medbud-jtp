FROM postgres:15-alpine

# Copy initialization scripts
COPY schema.sql /docker-entrypoint-initdb.d/
COPY users.json /tmp/

# Install necessary tools
RUN apk add --no-cache jq python3

# Create a script to import users from JSON
COPY import_users.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/import_users.sh

EXPOSE 5432