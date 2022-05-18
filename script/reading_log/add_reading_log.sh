#!/usr/bin/env bash
set -xe

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
READING_LOG_ID="$(date +"%Y%m%d-%H%M%S")"
BRANCH_NAME="reading_log/${READING_LOG_ID}"

TITLE="${LOG_TITLE:-"${READING_LOG_ID}"}"
TEXT="$(printf '%s' "${LOG_TEXT:-"(TODO: TEXT)"}")"
PR_TITLE="[Reading Log] ${TITLE}"

echo "LOG_ID: ${READING_LOG_ID}"
git checkout -b "${BRANCH_NAME}"

cat << EOS > "${REPOSITORY_ROOT}/posts/reading_log/${READING_LOG_ID}.md"
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
  --body " " \
  --reviewer "mryhryki"
