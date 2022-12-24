#!/usr/bin/env bash
set -e
REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"

source "${REPOSITORY_ROOT}/.github/script/shell/common/setup_git.sh"
source "${REPOSITORY_ROOT}/.github/script/shell/common/create_pull_request.sh"

GITHUB_TOKEN="${GH_TOKEN}"
ISSUE_URL="${ISSUE_URL}"

ISSUE_DATA_JSON="$(gh issue view "${ISSUE_URL}" --json 'body,labels,title,closedAt')"
TITLE="$(echo "${ISSUE_DATA_JSON}" | jq -r '.title')"
BODY="$(echo "${ISSUE_DATA_JSON}" | jq -r '.body')"
CLOSED_AT="$(echo "${ISSUE_DATA_JSON}" | jq -r '.closedAt')"
FIRST_PUBLISH_LABEL="$(echo "${ISSUE_DATA_JSON}" | jq -r '.labels[] | .name' | grep -Ei '^(Memo|Scrap)$' | head -n 1)"

cat << EOS
CLOSED_AT: ${CLOSED_AT}
LABEL    : ${FIRST_PUBLISH_LABEL}
TITLE    : ${TITLE}

[BODY]
${BODY}
EOS

if [[ "${CLOSED_AT}" == "null" ]] || [[ "${FIRST_PUBLISH_LABEL}" == "" ]]; then
  exit 0;
fi

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"

if [[ "${FIRST_PUBLISH_LABEL}" == "Scrap" ]]; then
  SCRAP_DIR="$(date +"%Y-%m")"
  SCRAP_ID="$(date +"%Y%m%d-%H%M%S")"
  echo "SCRAP_ID: ${SCRAP_ID}"
  mkdir -p "${REPOSITORY_ROOT}/scrap/${SCRAP_DIR}"
  cat << EOS > "${REPOSITORY_ROOT}/scrap/${SCRAP_DIR}/${SCRAP_ID}.md"
---
title: ${TITLE}
---

${BODY}

EOS
  create_pull_request "scrap/${SCRAP_ID}" "[SCRAP] ${TITLE}" "${ISSUE_URL}"

elif [[ "${FIRST_PUBLISH_LABEL}" == "Memo" ]]; then
  MEMO_ID="$(date +"%Y-%m-%d-")$(openssl rand -hex 8)"
cat << EOS > "${REPOSITORY_ROOT}/memo/${MEMO_ID}.md"
---
title: ${TITLE}
---

${BODY}

EOS
  create_pull_request "memo/${SCRAP_ID}" "[MEMO] ${TITLE}" "${ISSUE_URL}"

fi

