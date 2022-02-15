#!/usr/bin/env bash

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
READING_LOG_ID="$(date +"%Y%m%d-%H%M%S")"

echo "LOG_ID: ${READING_LOG_ID}"
git checkout -b "reading_log/${READING_LOG_ID}"

cat << EOS > "${REPOSITORY_ROOT}/posts/reading_log/${LOG_ID}.md"
---
title: {{TITLE}}
---


EOS

git commit -a -m "Add reading log: ${READING_LOG_ID}"
git push
