#!/usr/bin/env bash
REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"

SCRAP_DIR="$(date +"%Y-%m")"
SCRAP_ID="$(date +"%Y%m%d-%H%M%S")"
echo "SCRAP_ID: ${SCRAP_ID}"
BRANCH_NAME="scrap/${SCRAP_ID}"

TITLE="${SCRAP_TITLE:-"${SCRAP_ID}"}"
TEXT="$(printf '%s' "${SCRAP_TEXT:-"(No Body)"}")"
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

source "${REPOSITORY_ROOT}/.github/script/shell/common/setup_git.sh"
git add -A
git commit -m "${PR_TITLE}"
git push --set-upstream origin "${BRANCH_NAME}"

gh pr create \
  --title "${PR_TITLE}" \
  --body "${TEXT}" \
  --reviewer "mryhryki"
