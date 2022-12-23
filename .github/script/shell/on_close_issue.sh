#!/usr/bin/env bash

export GITHUB_TOKEN="${GH_TOKEN}"
export ISSUE_URL="${ISSUE_URL}"

ISSUE_DATA_JSON="$(gh issue view "${ISSUE_URL}" --json 'body,labels,title,closedAt')"
TITLE="$(echo "${ISSUE_DATA_JSON}" | jq -r '.title')"
BODY="$(echo "${ISSUE_DATA_JSON}" | jq -r '.body')"
CLOSED_AT="$(echo "${ISSUE_DATA_JSON}" | jq -r '.closedAt')"
FIRST_PUBLISH_LABEL="$(echo "${ISSUE_DATA_JSON}" | jq -r '.labels[] | .name' | grep -Ei '^Publish:(Memo|Scrap)$' | head -n 1)"

cat << EOS
CLOSED_AT: ${CLOSED_AT}
LABEL:     ${FIRST_PUBLISH_LABEL}
TITLE:     ${TITLE}

[BODY]
${BODY}
EOS

if [[ "${CLOSED_AT}" == "" ]] || [[ "${FIRST_PUBLISH_LABEL}" == "" ]]; then
  exit 0;
fi

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null;)"

if [[ "${FIRST_PUBLISH_LABEL}" == "Publish:Scrap" ]]; then
  export SCRAP_TITLE="${TITLE}"
  export SCRAP_TEXT="${BODY}"
  bash "${REPOSITORY_ROOT}/.github/script/shell/add_scrap.sh"
elif [[ "${FIRST_PUBLISH_LABEL}" == "Publish:Memo" ]]; then
  export MEMO_TITLE="${TITLE}"
  export MEMO_TEXT="${BODY}"
  bash "${REPOSITORY_ROOT}/.github/script/shell/add_memo.sh"
else
  gh issue comment "${ISSUE_URL}" --body "No Publish:* label."
fi

