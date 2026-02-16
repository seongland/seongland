#!/bin/bash
set -euo pipefail

# Build all *-article submodules and copy output to public/article/<name>/

echo "=== Initializing submodules ==="
git submodule update --init --recursive

found=0
for dir in *-article; do
  [ -d "$dir" ] || continue
  found=1
  name="${dir%-article}"
  echo "=== Building article: $name ==="

  # LFS
  (cd "$dir" && git lfs install --skip-smudge && git lfs pull)

  # Build with base path so asset URLs resolve under /article/<name>/
  base="/article/$name"
  cat > "$dir/app/astro.config.build.mjs" <<BUILDCFG
import config from './astro.config.mjs';
config.base = '$base';
export default config;
BUILDCFG
  (cd "$dir/app" && npm install && npx astro build --config astro.config.build.mjs)
  rm -f "$dir/app/astro.config.build.mjs"

  # Verify build output
  if [ ! -f "$dir/app/dist/index.html" ]; then
    echo "ERROR: $dir/app/dist/index.html not found after build"
    exit 1
  fi

  # Copy
  rm -rf "public/article/$name"
  mkdir -p "public/article/$name"
  cp -r "$dir/app/dist/." "public/article/$name/"

  # Verify copy
  if [ ! -f "public/article/$name/index.html" ]; then
    echo "ERROR: copy failed - public/article/$name/index.html missing"
    exit 1
  fi

  echo "=== Done: $name ==="
done

if [ "$found" -eq 0 ]; then
  echo "WARNING: No *-article submodules found"
fi
