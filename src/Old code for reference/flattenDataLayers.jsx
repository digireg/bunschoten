// Flatten dataset children for UI consumption
// export function flattenDataLayers(dataLayers) {
//   return dataLayers.flatMap((group) =>
//     (group.children || []).map((child) => ({
//       groupId: group.id,
//       layerId: child.layer || child.id, // fallback if layer missing
//       key: child.id || `${group.id}_${child.layer}`, // must exist
//       label: child.title || child.id || "Unnamed Layer",
//       active: child.active || false,
//     }))
//   );
// }

// import { getWmsLegendUrl } from "../utils/legendHelpers"; // keep it in utils

// export function flattenDataLayers(dataLayers) {
//   console.log("[flattenDataLayers] input:", dataLayers);

//   const flattened = dataLayers.flatMap((group) =>
//     (group.children || []).map((child) => {
//       const url = child.url || group.url;

//       const layerObj = {
//         groupId: group.id,
//         groupTitle: group.title || group.id,
//         id: child.layer || child.id,
//         layerId: child.id,
//         key: child.id || `${group.id}_${child.layer}`,
//         label: child.title || child.id || "Unnamed Layer",
//         active: child.active || false,
//         type: child.type?.toLowerCase() || "unknown",
//         url,
//         legendUrl:
//           child.type?.toLowerCase() === "wms"
//             ? getWmsLegendUrl({ ...child, url })
//             : null,
//       };

//       console.log("[flattenDataLayers] flattened layer:", layerObj);
//       return layerObj;
//     })
//   );

//   console.log("[flattenDataLayers] flattened result:", flattened);
//   return flattened;
// }

// export function flattenDataLayers(dataLayers) {
//   const flatLayers = [];

//   dataLayers.forEach((group) => {
//     const url = group.type?.toLowerCase() === "wms" ? group.url : null;

//     group.children?.forEach((child) => {
//       flatLayers.push({
//         groupId: group.id,
//         groupTitle: group.title || group.id,

//         // 🔑 canonical internal id (matches useMapLayers ref key)
//         id: child.id,

//         // 🗂️ actual WMS/WMTS layer param
//         layerName: child.layer || child.id,

//         // 🔤 UI stuff
//         label: child.title || child.id || "Unnamed Layer",
//         key: child.id || `${group.id}_${child.layer}`,

//         active: child.active || false,
//         type: child.type?.toLowerCase() || "unknown",
//         url,

//         // 🖼️ legend url built with WMS layerName
//         legendUrl:
//           child.type?.toLowerCase() === "wms"
//             ? getWmsLegendUrl({ ...child, url, layer: child.layer || child.id })
//             : null,
//       });
//     });
//   });

//   return flatLayers;
// }

// export function flattenDataLayers(dataLayers) {
//   const flatLayers = [];

//   dataLayers.forEach((group) => {
//     const url = group.type?.toLowerCase() === "wms" ? group.url : null;

//     group.children?.forEach((child) => {
//       flatLayers.push({
//         groupId: group.id,
//         groupTitle: group.title || group.id,
//         id: child.id,
//         layerName: child.layer || child.id,
//         label: child.title || child.id || "Unnamed Layer",
//         key: child.id || `${group.id}_${child.layer}`,
//         active: child.active || false,
//         type: child.type?.toLowerCase() || "unknown",
//         url,
//         legendUrl: child.legendUrl || null, // ✅ now comes from WMS
//         opacity: child.opacity ?? 100,
//       });
//     });
//   });

//   return flatLayers;
// }
