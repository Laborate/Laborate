#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../";

git add -i;
git commit -m "update";
$BASE/shell/git_pull.sh;
git push;