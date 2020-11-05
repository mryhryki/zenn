#!/usr/bin/env bash
set -xe

readonly LHCI_SERVER_URL="https://lighthouse-hyiromori.herokuapp.com/app/projects/hyiromori.github.io/dashboard"

# Set "Slack Incoming Webhook URL" to env var.
readonly SLACK_INCOMING_WEBHOOK="${SLACK_INCOMING_WEBHOOK}"

# Execute Lighthouse CI
if [[ "$(type -t lhci)" == "" ]]; then
  npm i -g @lhci/cli
fi
lhci autorun

if [[ "${SLACK_INCOMING_WEBHOOK}" == "" ]]; then
  printf "Result: %s\n" "${LHCI_SERVER_URL}"
  exit 0
fi

# Generate notification text
SLACK_TEXT="$(cat <<EOS | sed -E "s/\n/\\\\\\\\n/g"
Update Lighthouse Score: ${LHCI_SERVER_URL}

\`\`\`
$(git log --max-count=1 --no-color)
\`\`\`
EOS
)"

# Post to Slack
curl -X POST \
    --data-urlencode "payload={\"text\": \"${SLACK_TEXT}\"}" \
    "${SLACK_INCOMING_WEBHOOK}"
