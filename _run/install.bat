#!/bin/bash
set -e  
pushd ..
git fetch origin master
git stash || true
git rebase origin/master
git stash pop || true

popd

.\run.bat
