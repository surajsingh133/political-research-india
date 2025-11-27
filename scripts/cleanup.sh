#!/usr/bin/env sh

# Safe cleanup helper (POSIX compatible)
# Usage:
#   ./cleanup.sh          -> lists candidate duplicate/backup files
#   ./cleanup.sh --delete -> prompts and deletes the listed items

ROOT="/Users/sooraj/Sites/political-research-india"
TMPFILE="/tmp/polit_research_cleanup.txt"

echo "Scanning for backup/duplicate files under: $ROOT"

# Find common backup patterns and folder names (depth limited)
find "$ROOT" -maxdepth 3 \
  \( -iname "*copy*" -o -iname "*.save" -o -iname "*.bak" -o -iname "*~" \) -print > "$TMPFILE" 2>/dev/null

if [ ! -s "$TMPFILE" ]; then
  echo "No candidate backup/duplicate files found."
  rm -f "$TMPFILE"
  exit 0
fi

echo "The following items were found:"
cat "$TMPFILE"

echo
if [ "$1" = "--delete" ]; then
  echo "Delete mode requested. Type EXACTLY 'YES' to confirm removal of the above items:"
  read CONFIRM
  if [ "$CONFIRM" != "YES" ]; then
    echo "Aborted — no files removed."
    rm -f "$TMPFILE"
    exit 0
  fi

  while IFS= read -r p; do
    if [ -e "$p" ]; then
      echo "Removing: $p"
      rm -rf -- "$p"
    else
      echo "Not found (skipping): $p"
    fi
  done < "$TMPFILE"

  echo "Cleanup complete."
  rm -f "$TMPFILE"
  exit 0
fi

echo "To remove these files run: $0 --delete (you will be prompted to confirm)."
rm -f "$TMPFILE"
