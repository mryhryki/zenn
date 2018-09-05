#!/bin/bash

THIS_DIR="$(cd $(dirname $BASH_SOURCE); pwd)"

cd "${THIS_DIR}/src"
npm run build

