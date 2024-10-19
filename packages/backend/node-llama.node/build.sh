#!/bin/sh

cd "`dirname $0`"
. ../build-common.sh

set -ex

VERSION=`basename $(pwd)`-0.5.2

docker build . -t $IMG_BASE:$VERSION
docker push $IMG_BASE:$VERSION
curl -X POST http://idapp-poc.westeurope.cloudapp.azure.com:3000/sconify --json '{"dockerhubImageToSconify": "'$IMG_BASE:$VERSION'", "yourWalletPublicAddress": "'$IEXEC_WALLET_ADDRESS'"}'

