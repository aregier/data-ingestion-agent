# compile image intended for building and testing
FROM node:8-slim AS build-env
ENV LD_LIBRARY_PATH /usr/lib/oracle/18.3/client64/lib
ARG INTEGRATION_TESTS_ENABLED=false
ARG ORACLE_ENDPOINT
ARG ORACLE_USER
ARG ORACLE_PASSWORD
ARG COVERALLS_REPO_TOKEN=false
ARG COVERALLS_GIT_COMMIT
ARG COVERALLS_GIT_BRANCH

RUN apt-get update && apt-get -y install git-core

WORKDIR /app
COPY --from=adastradev/oracle-instantclient:18.3-lite /usr/lib/oracle /usr/lib/oracle
COPY --from=adastradev/oracle-instantclient:18.3-lite /usr/lib64/libaio* /lib/
COPY package.json package-lock.json *.ts *config* ./
COPY source ./source
COPY test ./test
COPY docs ./docs

RUN npm ci &&\
    npm run build &&\
    npm run test:clean &&\
    npm run unit-test &&\
    if [ "$INTEGRATION_TESTS_ENABLED" = "true" ] ; then npm run integration-test ; else echo Integration tests disabled ; fi &&\
    if [ "$COVERALLS_REPO_TOKEN" = "false" ] ; then echo "Coveralls reporting disabled" ; else npm run test:coveralls ; fi
RUN rm -rf node_modules dist/test &&\
    npm ci --production &&\
    apt-get -y remove git-core && apt-get clean

# compile image intended for production use
FROM node:8-slim AS prod-env
ENV LD_LIBRARY_PATH /usr/lib/oracle/18.3/client64/lib
ENV LOG_PATH /var/log/dia
RUN mkdir /var/log/dia
WORKDIR /app
COPY --from=adastradev/oracle-instantclient:18.3-lite /usr/lib/oracle /usr/lib/oracle
COPY --from=adastradev/oracle-instantclient:18.3-lite /usr/lib64/libaio* /lib/
COPY --from=build-env /app/package.json .
COPY --from=build-env /app/dist dist
COPY --from=build-env /app/docs docs
COPY --from=build-env /app/node_modules node_modules

# Report to docker the health status so we can possibly use that information
# For now mark unhealthy after 25 sec (interval*retries)
# We could use this information in a watchtower kind of way to restart in addition to upgrade
HEALTHCHECK --interval=5s --timeout=10s --start-period=10s --retries=5 CMD node dist/healthcheck.js || exit 1

# Run the startup script which spawns the agent and acts as a intermediary between it
# and docker to signal the containers health
ENTRYPOINT ["npm", "start"]
