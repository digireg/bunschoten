//v1

import { addMapLayer } from "./addMapLayer";
import { zoomToLayer } from "./zoomToLayer";

/**
 * Ensures stable key and title
 */
function ensureLayerProps(layer) {
  return {
    ...layer,
    key: layer.key || layer.id || `${layer.id}-${Math.random()}`,
    title: layer.title || layer.id || "Untitled layer",
    children: layer.children?.map(ensureLayerProps) || [],
  };
}

/**
 * Activates/deactivates a layer (checkbox or radio)
 */
export function handleLayerActive({
  parent,
  mapInstance,
  groupId,
  inputType = "checkbox",
  wmsWmtsLayersRef,
  projectionCode,
  highlightSource,
}) {
  parent = ensureLayerProps(parent);
  const isCheckbox = inputType === "checkbox";

  // Toggle state
  const newActive = isCheckbox ? !parent.active : parent.active;

  // Handle radios: deactivate siblings if necessary
  if (inputType === "radio" && parent.children?.length) {
    const updatedChildren = parent.children.map((c) => ({
      ...c,
      active: c.id === parent.id ? true : false,
    }));
    parent.children = updatedChildren;
  }

  // Add/remove OL layer
  addMapLayer({
    mapInstance,
    groupId,
    layerId: parent.id,
    isActive: newActive,
    type: parent.type,
    wmsWmtsLayersRef,
    projectionCode,
    highlightSource,
  });

  // Determine layerToZoom
  const layerToZoom = newActive
    ? parent.bbox || parent.children?.find((c) => c.bbox)?.bbox || null
    : null;

  if (layerToZoom && mapInstance) {
    requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
  }

  return { ...parent, active: newActive, layerToZoom };
}

//v2
