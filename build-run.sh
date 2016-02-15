#!/bin/bash

docker build -t meter-register .
docker run -v /tmp/meterdata/:/meterdata -p 5080:5080 meter-register
