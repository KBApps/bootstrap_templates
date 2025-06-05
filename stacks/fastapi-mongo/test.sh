#!/bin/bash
docker compose up -d --build
sleep 5
curl --fail http://localhost:8000 || exit 1
curl --fail http://localhost:8000/check-db || exit 1
docker compose down
