#!/bin/bash
set -e

for i in $(find "extensions" -type d -name '.git' -prune)
do
    repo=$(echo ${i%.git*})
    echo "updating $repo"
    pushd $repo
        branch=$(git rev-parse --abbrev-ref HEAD)
        git checkout -f --
        git pull origin ${branch}
    popd
done