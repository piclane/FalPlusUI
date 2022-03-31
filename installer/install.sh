#!/bin/bash -ex

curl -Ss http://localhost:8080/actuator/info | sed -E -e 's/^.*"version":"([^"]+)".*$/\1/'
