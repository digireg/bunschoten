// export function flattenDataLayers(dataLayers) {
//   const flatLayers = [];

//   dataLayers.forEach((group) => {
//     group.children?.forEach((child) => {
//       flatLayers.push({
//         groupId: group.id,
//         groupTitle: group.title || group.id,
//         id: child.id,
//         layerName: child.wmsLayerName || child.id, // use WMS layer
//         label: child.title || child.id || "Unnamed Layer",
//         key: child.key, // React key
//         active: child.active || false,
//         type: child.type?.toLowerCase() || "unknown",
//         legendUrl: child.legendUrl || null,
//         opacity: child.opacity ?? 100,
//       });
//     });
//   });

//   return flatLayers;
// }

export function flattenDataLayers(dataLayers) {
  const flatLayers = [];

  dataLayers.forEach((group) => {
    group.children?.forEach((child) => {
      let legendUrl = child.legendUrl || null;

      // If parent checkbox has style children, use the active style's legendUrl
      if (child.inputType === "checkbox" && Array.isArray(child.children)) {
        const activeStyleChild = child.children.find(
          (c) => c.inputType === "radio" && c.active
        );
        if (activeStyleChild?.legendUrl) {
          legendUrl = activeStyleChild.legendUrl;
        }
      }

      flatLayers.push({
        groupId: group.id,
        groupTitle: group.title || group.id,
        id: child.id,
        layerName: child.wmsLayerName || child.id,
        label: child.title || child.id || "Unnamed Layer",
        key: child.key,
        active: child.active || false,
        type: child.type?.toLowerCase() || "unknown",
        legendUrl, // updated to pick active style
        opacity: child.opacity ?? 100,
      });
    });
  });

  return flatLayers;
}
