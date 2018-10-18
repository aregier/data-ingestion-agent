
docker build \
--build-arg ORACLE_ENDPOINT=$ORACLE_ENDPOINT \
--build-arg ORACLE_USER=$ORACLE_USER \
--build-arg ORACLE_PASSWORD=$ORACLE_PASSWORD \
--build-arg INTEGRATION_TESTS_ENABLED=true \
--build-arg COVERALLS_REPO_TOKEN=$COVERALLS_REPO_TOKEN
-t $IMAGE_NAME .
