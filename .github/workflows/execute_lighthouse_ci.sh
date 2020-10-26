#!/usr/bin/env bash
set -xe

# Set "Slack Incoming Webhook URL" to env var.
readonly SLACK_INCOMING_WEBHOOK="${SLACK_INCOMING_WEBHOOK}"
readonly MESSAGE_TITLE="*[Lighthouse CI Result: hyiromori/hyiromori.github.io]*"

# Execute Lighthouse CI
npm i -g @lhci/cli
lhci autorun
readonly LIGHTHOUSE_RESULT_URL="$(node -e 'links=require("./.lighthouseci/links.json");console.log(links[Object.keys(links)[0]]);')"

# Generate notification text
SLACK_TEXT="$(cat <<EOS | sed -E "s/\n/\\\\\\\\n/g"
${MESSAGE_TITLE}
${LIGHTHOUSE_RESULT_URL}

\`\`\`
$(git log --max-count=1 --no-color)
\`\`\`
EOS
)"

# Post to Slack
curl -X POST \
    --data-urlencode "payload={\"text\": \"${SLACK_TEXT}\"}" \
    "${SLACK_INCOMING_WEBHOOK}"
