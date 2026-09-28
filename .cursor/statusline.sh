#!/usr/bin/env bash
# Build 4 Atelier — show project folder name on the far right of the agent status line.
payload=$(cat)

model=$(echo "$payload" | jq -r '.model.display_name // "Agent"')
pct=$(echo "$payload" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
width=$(echo "$payload" | jq -r '.render_width_chars // 100')
dir=$(echo "$payload" | jq -r '.cwd // .workspace.current_dir // ""')
folder="${dir##*/}"

left="${model} · ctx ${pct}%"
right="${folder}"

left_len=${#left}
right_len=${#right}
pad=$((width - left_len - right_len))
if [ "$pad" -lt 1 ]; then
  pad=1
fi

printf '\033[90m%s\033[0m%*s\033[90m%s\033[0m' "$left" "$pad" "" "$right"
