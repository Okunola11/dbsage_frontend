### DOCKER CLI COMMANDS

ENV_PATH=./.env

.PHONY: docker-run-all
docker-run-all:
	# stop and remove all running containers to avoid name conflicts

	# docker network create sage-network

	docker run -d \
		--name sage-dev \
		--network sage-network \
		--env-file=${ENV_PATH} \
		--mount type=bind,src=./,dst=/app/ \
		-p 3000:3000 \
		--restart unless-stopped \
		sage-dev:0

	# -v venv:/usr/src/.venv:delegated


.PHONY: docker-start
docker-start:
	-docker start sage-dev
	-docker start test-db

.PHONY: docker-stop
docker-stop:
	-docker stop sage-dev

.PHONY: docker-rm
docker-rm:
	-docker container rm sage-dev
	# -docker network rm sage-network
	