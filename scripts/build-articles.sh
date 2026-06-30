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
  # Some articles keep served JSON outside public/ (gitignored) and need it staged.
  # Skip if public/data already exists (siblings symlink it to the source dir).
  if [ -d "$dir/app/src/content/assets/data" ] && [ ! -e "$dir/app/public/data" ]; then
    mkdir -p "$dir/app/public/data"
    cp -r "$dir/app/src/content/assets/data/." "$dir/app/public/data/"
  fi
  (cd "$dir/app" && npm install && npx astro build --config astro.config.build.mjs)
  rm -f "$dir/app/astro.config.build.mjs"

  # Verify build output
  if [ ! -f "$dir/app/dist/index.html" ]; then
    echo "ERROR: $dir/app/dist/index.html not found after build"
    exit 1
  fi

  # Inject <base> tag so relative fetch paths resolve correctly
  sed -i'' -e "s|<head>|<head><base href=\"$base/\">|" "$dir/app/dist/index.html"

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

# --- ASG dashboard (separate repo, Vite app) -> nested /article/asg/browser ---
# Lives in its own submodule so it deploys independently of the asg article and
# never appears in the article list. Its vite.config sets base=/article/asg/browser/
# on build; the sharded data (index.json + datasets/*.json) ships in its public/.
if [ -d "asg-browser" ]; then
  echo "=== Building asg browser dashboard ==="
  (cd asg-browser && git lfs install --skip-smudge && git lfs pull)
  (cd asg-browser && npm install && npm run build)
  if [ ! -f "asg-browser/dist/index.html" ]; then
    echo "ERROR: asg-browser/dist/index.html not found after build"
    exit 1
  fi
  rm -rf public/article/asg/browser
  mkdir -p public/article/asg/browser
  cp -r asg-browser/dist/. public/article/asg/browser/
  if [ ! -f "public/article/asg/browser/index.html" ]; then
    echo "ERROR: copy failed - public/article/asg/browser/index.html missing"
    exit 1
  fi
  echo "=== Done: asg browser ==="
fi
