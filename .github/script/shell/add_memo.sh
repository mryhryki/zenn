#!/usr/bin/env bash
set -xe

MEMO_ID="$(date +"%Y-%m-%d-")$(openssl rand -hex 8)"
echo "MEMO_ID: ${SCRAP_ID}"

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
BRANCH_NAME="memo/${MEMO_ID}"

TITLE="${MEMO_TITLE:-"${BRANCH_NAME}"}"
#TEXT="$(printf '%s' "${MEMO_TEXT:-"(TODO)"}")"
TEXT=""
PR_TITLE="[MEMO] ${TITLE}"

git checkout -b "${BRANCH_NAME}"

cat << EOS > "${REPOSITORY_ROOT}/memo/${MEMO_ID}.md"
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
