#!/bin/bash

cd "$(dirname $BASH_SOURCE)"

cat <<EOS > "./service_worker.js"
const CacheVersion = '$(uuidgen)';
$(tail -n +2 "./service_worker.js")
EOS

npm run build
