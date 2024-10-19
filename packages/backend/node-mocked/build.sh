#!/bin/sh

cd "`dirname $0`"
. ../build-common.sh

set -ex

# idapp app deploy - too slow, rebuilds without cache, etc; simple to reimplement:

VERSION=`basename $(pwd)`-0.1.0

docker build . -t $IMG_BASE:$VERSION
docker push $IMG_BASE:$VERSION
curl -X POST http://idapp-poc.westeurope.cloudapp.azure.com:3000/sconify --json '{"dockerhubImageToSconify": "'$IMG_BASE:$VERSION'", "yourWalletPublicAddress": "'$IEXEC_WALLET_ADDRESS'"}' | tee sconify-result.json

