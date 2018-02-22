#!/usr/bin/env bash

yarn pro

cd ./public/

git add .
git commit -m 'v2.0-beta18'
git push
