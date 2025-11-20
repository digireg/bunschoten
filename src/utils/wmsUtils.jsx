// // wmsUtils.jsx

// /**
//  * Resolves the proper WMS layer name based on bboxes and dataset info.
//  * @param {string} layerId - The requested layer ID
//  * @param {Object} bboxes - Object of { layerName: { extent, crs } }
//  * @param {Object} dataset - Dataset config, may include dataset.layers
//  * @param {Object} options
//  *   - verbose: boolean, enable console logs (default false)
//  *   - onFallback: function(layerId, bboxes, dataset) -> string, called if no match
//  * @returns {string} Resolved layer name
//  */
// export function resolveLayerName(
//   layerId,
//   bboxes,
//   dataset,
//   { verbose = false, onFallback } = {}
// ) {
//   const possibleNames = layerId.split(":");
//   const lastSegment = possibleNames[possibleNames.length - 1];

//   const normalize = (str) => str.toLowerCase().replace(/[\s_]/g, "");
//   const normalizedLast = normalize(lastSegment);

//   const bboxKeys = bboxes ? Object.keys(bboxes) : [];

//   // === 1. Try dynamic match from bboxes ===
//   let layerName = bboxKeys.find((name) => {
//     const n = normalize(name);
//     return (
//       possibleNames.some((pn) => n === normalize(pn)) ||
//       n.endsWith(normalizedLast)
//     );
//   });

//   if (layerName) {
//     if (verbose)
//       console.log(`[resolveLayerName] Matched via bboxes: ${layerName}`);
//     return layerName;
//   }

//   // === 2. Try match from dataset.layers ===
//   if (Array.isArray(dataset.layers)) {
//     layerName = dataset.layers.find((l) => {
//       const n = normalize(l);
//       return (
//         possibleNames.some((pn) => n.endsWith(normalize(pn))) ||
//         n.endsWith(normalizedLast)
//       );
//     });
//     if (layerName) {
//       if (verbose)
//         console.log(
//           `[resolveLayerName] Matched via dataset.layers: ${layerName}`
//         );
//       return layerName;
//     }
//   }

//   // === 3. Fallback callback ===
//   if (typeof onFallback === "function") {
//     const fallbackName = onFallback(layerId, bboxes, dataset);
//     if (fallbackName) {
//       if (verbose)
//         console.log(
//           `[resolveLayerName] Fallback callback returned: ${fallbackName}`
//         );
//       return fallbackName;
//     }
//   }

//   // === 4. Final fallback: original layerId ===
//   if (verbose)
//     console.warn(
//       `[resolveLayerName] Could not match WMS layer, using original layerId: ${layerId}`
//     );
//   return layerId;
// }

// wmsUtils.jsx
export function resolveLayerName(
  layerId,
  bboxes,
  dataset,
  { verbose = false, onFallback } = {}
) {
  // 🚫 Ignore style-only identifiers
  if (layerId.endsWith("_styles") || layerId.includes("style")) {
    if (verbose)
      console.warn(`[resolveLayerName] Ignoring style-like ID: ${layerId}`);
    return layerId;
  }

  const normalize = (str) =>
    str.toLowerCase().replace(/[\s_]/g, "").replace(/^.*:/, ""); // drop namespace prefixes
  const possibleNames = layerId.split(":");
  const normalizedLast = normalize(possibleNames.at(-1));

  const bboxKeys = Object.keys(bboxes || {});
  const datasetLayers = Array.isArray(dataset.layers) ? dataset.layers : [];

  // === 1. Try exact dataset.layer match (already qualified)
  let layerName = datasetLayers.find(
    (l) => normalize(l) === normalizedLast || l === layerId
  );
  if (layerName) {
    if (verbose)
      console.log(
        `[resolveLayerName] Matched via dataset.layers: ${layerName}`
      );
    return layerName;
  }

  // === 2. Try bboxes match (avoid double prefix)
  layerName = bboxKeys.find((name) => {
    const n = normalize(name);
    return (
      possibleNames.some((pn) => n === normalize(pn)) ||
      n.endsWith(normalizedLast)
    );
  });

  if (layerName) {
    if (verbose)
      console.log(`[resolveLayerName] Matched via bboxes: ${layerName}`);
    return layerName;
  }

  // === 3. Optional fallback callback
  if (typeof onFallback === "function") {
    const fb = onFallback(layerId, bboxes, dataset);
    if (fb) {
      if (verbose) console.log(`[resolveLayerName] Fallback callback: ${fb}`);
      return fb;
    }
  }

  // === 4. Final fallback
  if (verbose)
    console.warn(
      `[resolveLayerName] No match found, returning original ID: ${layerId}`
    );
  return layerId;
}
