#!/usr/bin/env bash
function create_pull_request() {
  local BRANCH="$1"
  local TITLE="$2"
  local TEXT="$3"

  git checkout -b "${BRANCH}"
  git add -A
  git commit -m "${TITLE}"
  git push --set-upstream origin "${BRANCH}"
  git push

  gh pr create \
    --title "${TITLE}" \
    --body "${TEXT}" \
    --reviewer "mryhryki"
}
