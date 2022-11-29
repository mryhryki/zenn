#!/usr/bin/env bash
set -xe

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
SCRAP_ID="$(date +"%Y%m%d-%H%M%S")"
BRANCH_NAME="scrap/${SCRAP_ID}"

TITLE="${LOG_TITLE:-"${SCRAP_ID}"}"
TEXT="$(printf '%s' "${LOG_TEXT:-"(TODO: TEXT)"}")"
PR_TITLE="[SCRAP] ${TITLE}"

echo "LOG_ID: ${SCRAP_ID}"
git checkout -b "${BRANCH_NAME}"

cat << EOS > "${REPOSITORY_ROOT}/scrap/${SCRAP_ID}.md"
---
title: ${TITLE}
---

${TEXT}

EOS

# for GitHub Actions
if [[ "$(git config --global user.email)" == "" ]]; then
  git config --global user.email "mryhryki@gmail.com"
fi
if [[ "$(git config --global user.name)" == "" ]]; then
  git config --global user.name "Moriya Hiroyuki"
fi

git add -A
git commit -m "${PR_TITLE}"
git push --set-upstream origin "${BRANCH_NAME}"

gh pr create \
  --title "${PR_TITLE}" \
  --body "${TEXT}" \
  --reviewer "mryhryki"
