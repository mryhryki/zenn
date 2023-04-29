#!/usr/bin/env bash
REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"

ARTICLE_ID="$(date +"%Y-%m-%d")-$(openssl rand -hex 2)"
echo "ARTICLE_ID: ${ARTICLE_ID}"
BRANCH_NAME="article/${ARTICLE_ID}"

TITLE="${ARTICLE_TITLE:-"${ARTICLE_ID}"}"
TEXT="${ARTICLE_TEXT:-" "}"
PR_TITLE="[ARTICLE] ${TITLE}"

git switch -c "${BRANCH_NAME}" "origin/main"

cat << EOS > "${REPOSITORY_ROOT}/article/${ARTICLE_ID}.md"
---
title: ${TITLE}
---

${TEXT}

EOS

source "${REPOSITORY_ROOT}/.github/script/shell/common/setup_git.sh"
git add -A
git commit -m "${PR_TITLE}"
git push origin "${BRANCH_NAME}"

gh pr create \
  --title "${PR_TITLE}" \
  --body "${TEXT}" \
  --assignee "mryhryki"
