#!/usr/bin/env bash
set -xe

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
SCRAP_DIR="$(date +"%Y-%m")"
SCRAP_ID="$(date +"%Y%m%d-%H%M%S")"
BRANCH_NAME="scrap/${SCRAP_ID}"

TITLE="${SCRAP_TITLE:-"${SCRAP_ID}"}"
TEXT="$(printf '%s' "${SCRAP_TEXT:-"(TODO: TEXT)"}")"
PR_TITLE="[SCRAP] ${TITLE}"

echo "SCRAP_ID: ${SCRAP_ID}"
git checkout -b "${BRANCH_NAME}"

mkdir -p "${REPOSITORY_ROOT}/scrap/${SCRAP_DIR}"
cat << EOS > "${REPOSITORY_ROOT}/scrap/${SCRAP_DIR}/${SCRAP_ID}.md"
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
