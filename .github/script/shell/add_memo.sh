#!/usr/bin/env bash
set -e
REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"
source "${REPOSITORY_ROOT}/.github/script/shell/common/setup_git.sh"

MEMO_DIR="$(date +"%Y-%m")"
MEMO_ID="$(date +"%Y%m%d-%H%M%S")"
echo "MEMO_ID: ${SCRAP_ID}"
BRANCH_NAME="memo/${MEMO_ID}"

TITLE="${MEMO_TITLE:-"${MEMO_ID}"}"
TEXT="$(printf '%s' "${MEMO_TEXT:-"(No Text)"}")"
PR_TITLE="[MEMO] ${TITLE}"

setup_git
git switch -c "${BRANCH_NAME}" "origin/main"

mkdir -p "${REPOSITORY_ROOT}/memo/${MEMO_DIR}"
cat << EOS > "${REPOSITORY_ROOT}/memo/${MEMO_DIR}/${MEMO_ID}.md"
---
title: ${TITLE}
---

${TEXT}

EOS

git add -A
git commit -m "${PR_TITLE}"
git push --set-upstream origin "${BRANCH_NAME}"

gh pr create \
  --title "${PR_TITLE}" \
  --body "${TEXT}" \
  --assignee "mryhryki"
