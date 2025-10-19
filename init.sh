#!/usr/bin/env bash
set -euo pipefail

# init.sh
# Populates GeoServer with datasets from ./data and styles from ./styles via REST API.
# Requirements:
# - GeoServer accessible at http://localhost:8080/geoserver
# - Default credentials admin/geoserver (override with GEOSERVER_USER/GEOSERVER_PASS)
# - docker-compose mounts ./data and ./styles into GeoServer (already configured in docker-compose.yml)
#
# Usage:
#   bash init.sh
#
# Notes:
# - Script is idempotent: it will create or update resources where applicable.
# - After uploading, it prints the list of data filenames (without path) that were processed from ./data.

GEOSERVER_URL=${GEOSERVER_URL:-"http://localhost:8080/geoserver"}
REST="$GEOSERVER_URL/rest"
GEOSERVER_USER=${GEOSERVER_USER:-"admin"}
GEOSERVER_PASS=${GEOSERVER_PASS:-"geoserver"}
AUTH="${GEOSERVER_USER}:${GEOSERVER_PASS}"

# Workspace to use/create
WORKSPACE=${WORKSPACE:-"urban"}

DATA_DIR=${DATA_DIR:-"./data"}
STYLES_DIR=${STYLES_DIR:-"./styles"}

curl_req() {
  # Wrapper for curl with common flags
  curl -sS -f -u "$AUTH" -H "Accept: application/json" "$@"
}

wait_for_geoserver() {
  echo "Waiting for GeoServer at $GEOSERVER_URL ..."
  local retries=60
  local delay=2
  until curl -sSf -u "$AUTH" -H "Accept: application/json" "$REST/about/version" >/dev/null 2>&1; do
    retries=$((retries - 1)) || true
    if [ "$retries" -le 0 ]; then
      echo "GeoServer did not become ready in time." >&2
      exit 1
    fi
    sleep "$delay"
  done
  echo "GeoServer is up."
}

ensure_workspace() {
  echo "Ensuring workspace '$WORKSPACE' exists ..."
  if curl -sSf -u "$AUTH" "$REST/workspaces/$WORKSPACE.json" >/dev/null 2>&1; then
    echo "Workspace '$WORKSPACE' already exists."
  else
    echo "Creating workspace '$WORKSPACE' ..."
    curl -sS -f -u "$AUTH" -H "Content-Type: application/json" -d "{\"workspace\":{\"name\":\"$WORKSPACE\"}}" "$REST/workspaces" >/dev/null
    echo "Workspace '$WORKSPACE' created."
  fi
}

upload_geotiff() {
  local file_path="$1"
  local base
  base=$(basename "$file_path")
  local name="${base%.*}"

  # Log to stderr so command substitution in caller doesn't capture it
  echo "Uploading GeoTIFF '$base' as coverage store '$name' ..." >&2

  # First, try creating an external coverage store pointing at the mounted file path inside the container.
  # This avoids potential 500 errors from streaming uploads and leverages the docker volume at /opt/geoserver/data_dir/data.
  local container_path="file:///opt/geoserver/data_dir/data/$base"
  local external_url="$REST/workspaces/$WORKSPACE/coveragestores/$name/external.geotiff?configure=all&coverageName=$name"
  if ! curl -sS -f -u "$AUTH" -H "Content-Type: text/plain" -d "$container_path" "$external_url" >/dev/null 2>&1; then
    # Fallback to streaming upload of the file content
    local file_url="$REST/workspaces/$WORKSPACE/coveragestores/$name/file.geotiff?configure=all&coverageName=$name"
    if ! curl -sS -f -u "$AUTH" -H "Content-type: image/tiff" -T "$file_path" "$file_url" >/dev/null; then
      echo "Failed to upload '$base' to GeoServer." >&2
      return 1
    fi
  fi

  # Ensure a published layer exists (create coverage if missing)
  if ! curl -sSf -u "$AUTH" "$REST/layers/$WORKSPACE:$name.json" >/dev/null 2>&1; then
    # Try to create a coverage under the existing store to publish the layer
    curl -sS -f -u "$AUTH" -H "Content-Type: application/json" \
      -d "{\"coverage\":{\"name\":\"$name\",\"title\":\"$name\"}}" \
      "$REST/workspaces/$WORKSPACE/coveragestores/$name/coverages" >/dev/null || true
  fi

  # Enable layer and set default style if applicable
  if curl -sSf -u "$AUTH" "$REST/layers/$WORKSPACE:$name.json" >/dev/null 2>&1; then
    curl -sS -f -u "$AUTH" -H "Content-Type: application/json" -d '{"layer":{"enabled":true}}' -X PUT "$REST/layers/$WORKSPACE:$name" >/dev/null || true

    if [[ "$name" == "strassenlaerm_tag" ]]; then
      # Prefer the style alias 'strassenlaerm_tag_colormap', otherwise fall back to 'NoisePollution'
      local style_to_set="strassenlaerm_tag_colormap"
      if ! curl -sSf -u "$AUTH" "$REST/workspaces/$WORKSPACE/styles/$style_to_set.json" >/dev/null 2>&1; then
        style_to_set="NoisePollution"
      fi
      curl -sS -f -u "$AUTH" -H "Content-Type: application/json" \
        -d "{\"layer\":{\"defaultStyle\":{\"name\":\"$style_to_set\"},\"enabled\":true}}" \
        -X PUT "$REST/layers/$WORKSPACE:$name" >/dev/null || true
    fi

    echo "$base"
  else
    echo "Failed to publish layer for '$base' (store created but no coverage/layer)." >&2
    return 1
  fi
}

upload_style() {
  local sld_path="$1"
  local base
  base=$(basename "$sld_path")
  local style_name="${base%.*}"
  echo "Uploading style '$base' as '$style_name' ..."

  # Create or update style using raw SLD upload
  # PUT /workspaces/{ws}/styles/{style}?raw=true
  local url="$REST/workspaces/$WORKSPACE/styles/$style_name?raw=true"
  if curl -sSf -u "$AUTH" -H "Content-Type: application/vnd.ogc.sld+xml" --data-binary "@$sld_path" -X PUT "$url" >/dev/null 2>&1; then
    echo "Style '$style_name' uploaded/updated."
  else
    # If PUT failed due to non-existing style path, try POST create then PUT
    curl -sS -f -u "$AUTH" -H "Content-Type: application/json" -d "{\"style\":{\"name\":\"$style_name\",\"filename\":\"$base\"}}" "$REST/workspaces/$WORKSPACE/styles" >/dev/null || true
    curl -sS -f -u "$AUTH" -H "Content-Type: application/vnd.ogc.sld+xml" --data-binary "@$sld_path" -X PUT "$url" >/dev/null
    echo "Style '$style_name' uploaded/updated."
  fi

  # Also publish an alias style name expected by docs/UI if applicable
  if [[ "$style_name" == "NoisePollution" ]]; then
    local alias_name="strassenlaerm_tag_colormap"
    local alias_url="$REST/workspaces/$WORKSPACE/styles/$alias_name?raw=true"
    if curl -sSf -u "$AUTH" -H "Content-Type: application/vnd.ogc.sld+xml" --data-binary "@$sld_path" -X PUT "$alias_url" >/dev/null 2>&1; then
      echo "Alias style '$alias_name' uploaded/updated."
    else
      curl -sS -f -u "$AUTH" -H "Content-Type: application/json" -d "{\"style\":{\"name\":\"$alias_name\",\"filename\":\"$base\"}}" "$REST/workspaces/$WORKSPACE/styles" >/dev/null || true
      curl -sS -f -u "$AUTH" -H "Content-Type: application/vnd.ogc.sld+xml" --data-binary "@$sld_path" -X PUT "$alias_url" >/dev/null
      echo "Alias style '$alias_name' uploaded/updated."
    fi
  fi
}

main() {
  wait_for_geoserver
  ensure_workspace

  # Collect uploaded data filenames for final log
  declare -a uploaded

  echo "Processing data files in '$DATA_DIR' ..."
  shopt -s nullglob
  local had_data=false
  for tif in "$DATA_DIR"/*.tif "$DATA_DIR"/*.tiff; do
    [ -e "$tif" ] || continue
    had_data=true
    if out=$(upload_geotiff "$tif"); then
      uploaded+=("$out")
    fi
  done
  if [ "$had_data" = false ]; then
    echo "No GeoTIFF files found in $DATA_DIR."
  fi

  echo "Processing styles in '$STYLES_DIR' ..."
  local had_styles=false
  for sld in "$STYLES_DIR"/*.sld; do
    [ -e "$sld" ] || continue
    had_styles=true
    upload_style "$sld"
  done
  if [ "$had_styles" = false ]; then
    echo "No SLD style files found in $STYLES_DIR."
  fi

  # Final console log: filenames uploaded (only those from the data folder)
  if [ ${#uploaded[@]} -gt 0 ]; then
    echo "Uploaded data files:"
    for f in "${uploaded[@]}"; do
      echo "- $f"
    done
  else
    echo "No data files were uploaded."
  fi
}

main "$@"
