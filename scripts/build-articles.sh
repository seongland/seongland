#!/bin/bash
set -e

# Build all article submodules
# Each submodule under articles/ gets built and copied to public/article/<name>/

git submodule update --init --recursive

for dir in *-article; do
  [ -d "$dir/app" ] || continue
  name="${dir%-article}"

  echo "Building article: $name"

  cd "$dir"
  git lfs install --skip-smudge
  git lfs pull
  cd app
  npm install
  npm run build
  cd ../..

  mkdir -p "public/article/$name"
  cp -r "$dir/app/dist/" "public/article/$name/"

  echo "Done: $name"
done
