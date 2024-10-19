#!/bin/bash

cd "`dirname $0`"
. ../build-common.sh

VERSION=`basename $(pwd)`-0.1.0

# Declare the app entrypoint
ENTRYPOINT="python3 /app/app.py"

# Declare image related variables
IMG_NAME=iexec-example-thing
IMG_FROM=$IMG_BASE:$VERSION-no-tee
IMG_TO=$IMG_BASE:$VERSION

docker build . -t "$IMG_FROM"

# Run the sconifier to build the TEE image based on the non-TEE image
docker run --rm -it \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com/scone-production/iexec-sconify-image:5.7.6-v15 \
            bash -c 'sleep 0.2; sconify_iexec "$1" "$@"' \
            --name=${IMG_NAME} \
            --from=${IMG_FROM} \
            --to=${IMG_TO} \
            --binary-fs \
            --fs-dir=/app \
            --host-path=/etc/hosts \
            --host-path=/etc/resolv.conf \
            --binary=/usr/local/bin/python3.7 \
            --heap=1G \
            --dlopen=1 \
            --no-color \
            --verbose \
            --command=${ENTRYPOINT} \
            && echo -e "\n------------------\n" \
            && echo "successfully built TEE docker image => ${IMG_TO}" \
            && echo "application mrenclave.fingerprint is $(sleep 0.1; docker run --rm -e SCONE_HASH=1 ${IMG_TO})"

# Re: sleep 0.2; sconify_iexec - docker starts the container so fast, it fails to update ps output by the time sconify_iexec tries to figure it's own image, around /sconify_iexec:117 (THIS_SCONIFY_IMAGE=..)
# Possibly need --allow-debug-mode, but it doesn't work in that case either

docker push "$IMG_TO"
