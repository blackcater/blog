#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd public

git init

git add -A

time=$(date "+%Y/%m/%d-%H:%M:%S")

git commit -m "deploy on ${time}"

git push -f https://github.com/blackcater/blackcater.github.io.git master:master

cd -
