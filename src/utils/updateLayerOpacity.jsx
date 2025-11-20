/**
 * Recursively updates the opacity of a layer and its children in OL map reference
 */
// export function updateLayerOpacity({
//   layers,
//   groupId,
//   layerId,
//   opacity,
//   wmsWmtsLayersRef,
// }) {
//   const getKey = (layerId, styleId) =>
//     `${groupId}:${layerId}${styleId ? `-${styleId}` : ""}`;

//   return layers.map((layer) => {
//     // Update this layer if id matches
//     if (layer.id === layerId) {
//       // Try all possible styleIds (for radio children)
//       const keys = layer.children?.map((c) => getKey(layer.id, c.id)) || [];
//       keys.push(getKey(layer.id)); // also include parent key

//       keys.forEach((key) => {
//         const olLayer = wmsWmtsLayersRef.current[key];
//         if (olLayer) olLayer.setOpacity(opacity / 100);
//       });

//       return { ...layer, opacity };
//     }

//     // Recursively update children
//     return {
//       ...layer,
//       children: layer.children
//         ? updateLayerOpacity({
//             layers: layer.children,
//             groupId,
//             layerId,
//             opacity,
//             wmsWmtsLayersRef,
//           })
//         : [],
//     };
//   });
// }

// export function updateLayerOpacity({
//   layers,
//   groupId,
//   layerId,
//   opacity, // always 0–100
//   wmsWmtsLayersRef,
// }) {
//   const getKey = (layerId, styleId) =>
//     `${groupId}:${layerId}${styleId ? `-${styleId}` : ""}`;

//   return layers.map((layer) => {
//     if (layer.id === layerId) {
//       const keys = layer.children?.map((c) => getKey(layer.id, c.id)) || [];
//       keys.push(getKey(layer.id));

//       keys.forEach((key) => {
//         const olLayer = wmsWmtsLayersRef.current[key];
//         if (olLayer) {
//           olLayer.setOpacity(opacity / 100); // convert to fraction
//         }
//       });

//       return { ...layer, opacity }; // store % in state
//     }

//     return {
//       ...layer,
//       children: layer.children
//         ? updateLayerOpacity({
//             layers: layer.children,
//             groupId,
//             layerId,
//             opacity,
//             wmsWmtsLayersRef,
//           })
//         : [],
//     };
//   });
// }

export function updateLayerOpacity({
  layers,
  groupId,
  layerId,
  opacity,
  wmsWmtsLayersRef,
}) {
  const getKey = (layerId, styleId) =>
    `${groupId}:${layerId}${styleId ? `-${styleId}` : ""}`;

  // 🔒 clamp to 0–100
  const safeOpacity = Math.max(0, Math.min(100, opacity));

  return layers.map((layer) => {
    if (layer.id === layerId) {
      const keys = layer.children?.map((c) => getKey(layer.id, c.id)) || [];
      keys.push(getKey(layer.id));

      keys.forEach((key) => {
        const olLayer = wmsWmtsLayersRef.current[key];
        if (olLayer) {
          olLayer.setOpacity(safeOpacity / 100);
        }
      });

      return { ...layer, opacity: safeOpacity };
    }

    return {
      ...layer,
      children: layer.children
        ? updateLayerOpacity({
            layers: layer.children,
            groupId,
            layerId,
            opacity: safeOpacity,
            wmsWmtsLayersRef,
          })
        : [],
    };
  });
}
