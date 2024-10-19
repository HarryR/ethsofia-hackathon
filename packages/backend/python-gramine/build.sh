#!/bin/bash

cd "`dirname $0`"
. ../build-common.sh

VERSION=`basename $(pwd)`-0.1.0

docker build . -t $IMG_BASE:$VERSION
docker run --rm -e sps=unset $IMG_BASE:$VERSION
docker push $IMG_BASE:$VERSION
