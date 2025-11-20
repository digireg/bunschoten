// V1
// import { useState, useRef, useEffect } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   useEffect(() => {
//     if (!loading && fetchedDataLayers.length > 0) {
//       setDataLayers(normalizedLayers);
//     }
//   }, [loading, normalizedLayers, fetchedDataLayers]);

//   /**
//    * Toggle layer active
//    */
//   const setLayerActive = (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId) return child;

//           return handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });
//         });

//         return { ...group, children: updatedChildren };
//       })
//     );
//   };

//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   return {
//     dataLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   };
// }

//V2
// import { useState, useEffect, useRef } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import { loadWMSLayers } from "../utils/wmsLoader";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   // ----------------------------
//   // Initialize layers once fetch completes
//   // ----------------------------
//   useEffect(() => {
//     if (!loading && fetchedDataLayers.length > 0) {
//       setDataLayers(normalizedLayers);
//     }
//   }, [loading, normalizedLayers, fetchedDataLayers]);

//   // ----------------------------
//   // Toggle layer active
//   // ----------------------------
//   const setLayerActive = async (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     if (!mapInstance) return;

//     let layerToZoom = null;

//     // Update state synchronously
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId && inputType === "checkbox") return child;

//           const updatedChild = handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });

//           if (!layerToZoom && updatedChild.layerToZoom) {
//             layerToZoom = updatedChild.layerToZoom;
//           }

//           // Load WMS children asynchronously
//           if (
//             child.type === "WMS" &&
//             (!child.children || child.children.length === 0)
//           ) {
//             loadWMSLayers(child.id).then((loadedChildren) => {
//               // Merge loaded children into state
//               setDataLayers((prev) =>
//                 prev.map((g) =>
//                   g.id === groupId
//                     ? {
//                         ...g,
//                         children: g.children.map((c) =>
//                           c.id === child.id
//                             ? { ...c, children: loadedChildren }
//                             : c
//                         ),
//                       }
//                     : g
//                 )
//               );
//             });
//           }

//           return updatedChild;
//         });

//         return { ...group, children: updatedChildren };
//       })
//     );

//     if (layerToZoom) {
//       requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
//     }
//   };

//   // ----------------------------
//   // Set layer opacity
//   // ----------------------------
//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   return {
//     dataLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   };
// }

//V3
// import { useState, useEffect, useRef } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import { loadWMSLayers } from "../utils/wmsLoader";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   // Initialize layers once fetch completes
//   useEffect(() => {
//     if (!loading && fetchedDataLayers?.length > 0) {
//       setDataLayers(normalizedLayers);
//     }
//   }, [loading, normalizedLayers, fetchedDataLayers]);

//   // Toggle layer active
//   const setLayerActive = async (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     if (!mapInstance) return;
//     let layerToZoom = null;

//     setDataLayers((prevGroups) => {
//       return prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId && inputType === "checkbox") return child;

//           // If this is a WMS layer and children are not loaded, fetch them
//           if (
//             child.type === "WMS" &&
//             (!child.children || child.children.length === 0)
//           ) {
//             loadWMSLayers(child.id);
//           }

//           const updatedChild = handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });

//           if (!layerToZoom && updatedChild.layerToZoom) {
//             layerToZoom = updatedChild.layerToZoom;
//           }

//           return updatedChild;
//         });

//         return { ...group, children: updatedChildren };
//       });
//     });

//     if (layerToZoom) {
//       requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
//     }
//   };

//   // Set layer opacity
//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   // Flattened layers helper for TransparantieLaagSelect
//   const flattenedLayers = dataLayers
//     ? dataLayers.flatMap((group) => group.children ?? [])
//     : [];

//   return {
//     dataLayers,
//     flattenedLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   };
// }

//V4
// import { useState, useEffect, useRef } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import { loadWMSLayers } from "../utils/wmsLoader";
// import TileWMS from "ol/source/TileWMS";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   // ----------------------------
//   // Initialize layers once fetch completes
//   // ----------------------------
//   useEffect(() => {
//     if (!loading && normalizedLayers?.length > 0) {
//       // 1️⃣ Set normalized layers in state
//       setDataLayers(normalizedLayers);

//       // 2️⃣ Pre-register WMS sources for all WMS layers
//       normalizedLayers.forEach((group) => {
//         group.children.forEach((child) => {
//           if (
//             child.type?.toLowerCase() === "wms" &&
//             !wmsWmtsLayersRef.current[child.id]
//           ) {
//             const source = new TileWMS({
//               url: child.url,
//               params: { LAYERS: child.wmsLayerName || child.id, TILED: true },
//               serverType: "mapserver",
//               crossOrigin: "anonymous",
//             });
//             wmsWmtsLayersRef.current[child.id] = source;
//             child.sourceRef = source;
//             console.log("[DEBUG] Pre-registered WMS source for:", child.id);
//           }
//         });
//       });
//     }
//   }, [loading, normalizedLayers]);

//   // ----------------------------
//   // Toggle layer active (generic WMS / other types)
//   // ----------------------------
//   const setLayerActive = async (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     if (!mapInstance) return;

//     let layerToZoom = null;

//     setDataLayers((prevGroups) => {
//       return prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId && inputType === "checkbox") return child;

//           // If this is a WMS layer and source not yet created, create TileWMS dynamically
//           if (child.type === "WMS" && !wmsWmtsLayersRef.current[child.id]) {
//             const source = new TileWMS({
//               url: child.url,
//               params: { LAYERS: child.wmsLayerName || child.id, TILED: true },
//               serverType: "mapserver",
//               crossOrigin: "anonymous",
//             });
//             wmsWmtsLayersRef.current[child.id] = source; // store source, not layer
//             console.log("[DEBUG] Pre-registered WMS source for:", child.id);
//           }

//           // Load WMS children if not loaded
//           if (
//             child.type === "WMS" &&
//             (!child.children || child.children.length === 0)
//           ) {
//             loadWMSLayers(child.id).then((loadedChildren) => {
//               setDataLayers((prev) =>
//                 prev.map((g) =>
//                   g.id === groupId
//                     ? {
//                         ...g,
//                         children: g.children.map((c) =>
//                           c.id === child.id
//                             ? { ...c, children: loadedChildren }
//                             : c
//                         ),
//                       }
//                     : g
//                 )
//               );
//             });
//           }

//           const updatedChild = handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });

//           if (!layerToZoom && updatedChild.layerToZoom) {
//             layerToZoom = updatedChild.layerToZoom;
//           }

//           return updatedChild;
//         });

//         return { ...group, children: updatedChildren };
//       });
//     });

//     if (layerToZoom) {
//       requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
//     }
//   };

//   // ----------------------------
//   // Set layer opacity
//   // ----------------------------
//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   // ----------------------------
//   // Flattened layers helper for UI panels
//   // ----------------------------
//   const flattenedLayers = dataLayers.flatMap((group) => group.children ?? []);

//   return {
//     dataLayers,
//     flattenedLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef, // contains TileWMS references for GetFeatureInfo
//   };
// }

// V4 Fixed
// import { useState, useEffect, useRef } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import TileWMS from "ol/source/TileWMS";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   // ----------------------------
//   // Initialize layers once fetch completes
//   // ----------------------------
//   useEffect(() => {
//     if (!loading && normalizedLayers?.length > 0) {
//       setDataLayers(normalizedLayers);

//       normalizedLayers.forEach((group) => {
//         group.children.forEach((child) => {
//           if (
//             child.type?.toLowerCase() === "wms" &&
//             !wmsWmtsLayersRef.current[child.id]
//           ) {
//             // Ensure wmsLayerName exists, fallback to id
//             const wmsLayerName = child.wmsLayerName || child.id;
//             if (!child.wmsLayerName) {
//               console.warn(
//                 `[WMS] Missing wmsLayerName for ${child.id}, using id as fallback`
//               );
//             }

//             const source = new TileWMS({
//               url: child.url,
//               params: { LAYERS: wmsLayerName, TILED: true },
//               serverType: "mapserver",
//               crossOrigin: "anonymous",
//             });

//             wmsWmtsLayersRef.current[child.id] = source;
//             child.sourceRef = source;
//             console.log(
//               "[DEBUG] Registered WMS source for:",
//               child.id,
//               "using layer:",
//               wmsLayerName
//             );
//           }
//         });
//       });
//     }
//   }, [loading, normalizedLayers]);

//   // ----------------------------
//   // Toggle layer active (generic WMS / other types)
//   // ----------------------------
//   const setLayerActive = async (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     if (!mapInstance) return;

//     let layerToZoom = null;

//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId && inputType === "checkbox") return child;

//           // Create WMS source if missing
//           if (
//             child.type?.toLowerCase() === "wms" &&
//             !wmsWmtsLayersRef.current[child.id]
//           ) {
//             const wmsLayerName = child.wmsLayerName || child.id;
//             const source = new TileWMS({
//               url: child.url,
//               params: { LAYERS: wmsLayerName, TILED: true },
//               serverType: "mapserver",
//               crossOrigin: "anonymous",
//             });
//             wmsWmtsLayersRef.current[child.id] = source;
//             child.sourceRef = source;
//             console.log(
//               "[DEBUG] Dynamically created WMS source for:",
//               child.id
//             );
//           }

//           const updatedChild = handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });

//           if (!layerToZoom && updatedChild.layerToZoom) {
//             layerToZoom = updatedChild.layerToZoom;
//           }

//           return updatedChild;
//         });

//         return { ...group, children: updatedChildren };
//       })
//     );

//     if (layerToZoom) {
//       requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
//     }
//   };

//   // ----------------------------
//   // Set layer opacity
//   // ----------------------------
//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   // ----------------------------
//   // Flattened layers helper for UI panels
//   // ----------------------------
//   const flattenedLayers = dataLayers.flatMap((group) => group.children ?? []);

//   return {
//     dataLayers,
//     flattenedLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef, // contains TileWMS sources for getFeatureInfo
//   };
// }

//V5
// import { useState, useEffect, useRef } from "react";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import useNormalizeLayers from "../hooks/useNormalizeLayers";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { addMapLayer } from "../utils/addMapLayer";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import TileWMS from "ol/source/TileWMS";

// export default function useMapLayers({ projectionCode, highlightSource }) {
//   const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
//   const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);

//   // ----------------------------
//   // Initialize layers once fetch completes
//   // ----------------------------
//   useEffect(() => {
//     if (!loading && normalizedLayers?.length > 0) {
//       setDataLayers(normalizedLayers);

//       // Pre-register WMS sources for all layers recursively
//       const registerLayer = (layer) => {
//         if (
//           layer.type?.toLowerCase() === "wms" &&
//           !wmsWmtsLayersRef.current[layer.id]
//         ) {
//           const source = new TileWMS({
//             url: layer.url,
//             params: { LAYERS: layer.wmsLayerName || layer.id, TILED: true },
//             serverType: "mapserver",
//             crossOrigin: "anonymous",
//           });
//           wmsWmtsLayersRef.current[layer.id] = source;
//           layer.sourceRef = source;
//         }

//         if (layer.children?.length > 0) {
//           layer.children.forEach(registerLayer);
//         }
//       };

//       normalizedLayers.forEach((group) =>
//         group.children.forEach(registerLayer)
//       );
//     }
//   }, [loading, normalizedLayers]);

//   // ----------------------------
//   // Toggle layer active (generic WMS / other types)
//   // ----------------------------
//   const setLayerActive = async (
//     mapInstance,
//     groupId,
//     layerId,
//     inputType = "checkbox"
//   ) => {
//     if (!mapInstance) return;

//     let layerToZoom = null;

//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id !== groupId) return group;

//         const updatedChildren = group.children.map((child) => {
//           if (child.id !== layerId && inputType === "checkbox") return child;

//           // If WMS source not created yet
//           if (
//             child.type?.toLowerCase() === "wms" &&
//             !wmsWmtsLayersRef.current[child.id]
//           ) {
//             const source = new TileWMS({
//               url: child.url,
//               params: { LAYERS: child.wmsLayerName || child.id, TILED: true },
//               serverType: "mapserver",
//               crossOrigin: "anonymous",
//             });
//             wmsWmtsLayersRef.current[child.id] = source;
//             child.sourceRef = source;
//           }

//           const updatedChild = handleLayerActive({
//             parent: child,
//             mapInstance,
//             groupId,
//             inputType,
//             wmsWmtsLayersRef,
//             projectionCode,
//             highlightSource,
//           });

//           if (!layerToZoom && updatedChild.layerToZoom) {
//             layerToZoom = updatedChild.layerToZoom;
//           }

//           return updatedChild;
//         });

//         return { ...group, children: updatedChildren };
//       })
//     );

//     if (layerToZoom) {
//       requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
//     }
//   };

//   // ----------------------------
//   // Set layer opacity
//   // ----------------------------
//   const setLayerOpacity = (groupId, layerId, opacity) => {
//     setDataLayers((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: updateLayerOpacity({
//                 layers: group.children,
//                 groupId,
//                 layerId,
//                 opacity,
//                 wmsWmtsLayersRef,
//               }),
//             }
//           : group
//       )
//     );
//   };

//   // ----------------------------
//   // Flattened layers helper for UI panels
//   // ----------------------------
//   const flattenedLayers = dataLayers.flatMap((group) => group.children ?? []);

//   return {
//     dataLayers,
//     flattenedLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   };
// }

// 9-10-2025
// const setLayerActive = async (
//   mapInstance,
//   groupId,
//   layerId,
//   inputType = "checkbox"
// ) => {
//   if (!mapInstance) return;
//   let layerToZoom = null;

//   setDataLayers((prevGroups) =>
//     prevGroups.map((group) => {
//       if (group.id !== groupId) return group;

//       const updatedChildren = group.children.map((child) => {
//         if (child.id !== layerId && inputType === "checkbox") return child;

//         // Ensure WMS source exists
//         if (
//           child.type?.toLowerCase() === "wms" &&
//           !wmsWmtsLayersRef.current[child.id]
//         ) {
//           registerLayerRecursive(child, group.url);
//         }

//         const updatedChild = handleLayerActive({
//           parent: child,
//           mapInstance,
//           groupId,
//           inputType,
//           wmsWmtsLayersRef,
//           projectionCode,
//           highlightSource,
//         });

//         if (!layerToZoom && updatedChild.layerToZoom) {
//           layerToZoom = updatedChild.layerToZoom;
//         }

//         return updatedChild;
//       });

//       return { ...group, children: updatedChildren };
//     })
//   );

//   if (layerToZoom)
//     requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
// };

//working checkboxes
// const setLayerActive = async (
//   mapInstance,
//   groupId,
//   layerId,
//   inputType = "checkbox"
// ) => {
//   if (!mapInstance) return;
//   let layerToZoom = null;

//   // Recursive search for the specific layer
//   const toggleLayerById = (layers) => {
//     return layers.map((layer) => {
//       // If this is the target layer, toggle it
//       if (layer.id === layerId) {
//         if (
//           layer.type?.toLowerCase() === "wms" &&
//           !wmsWmtsLayersRef.current[layer.id]
//         ) {
//           const source = new TileWMS({
//             url: layer.url,
//             params: { LAYERS: layer.wmsLayerName || layer.id, TILED: true },
//             serverType: "mapserver",
//             crossOrigin: "anonymous",
//           });
//           wmsWmtsLayersRef.current[layer.id] = source;
//           layer.sourceRef = source;
//         }

//         const updatedLayer = handleLayerActive({
//           parent: layer,
//           mapInstance,
//           groupId,
//           inputType,
//           wmsWmtsLayersRef,
//           projectionCode,
//           highlightSource,
//         });

//         if (!layerToZoom && updatedLayer.layerToZoom) {
//           layerToZoom = updatedLayer.layerToZoom;
//         }

//         // If it has children, leave them as-is (don't activate automatically)
//         return { ...updatedLayer, children: layer.children };
//       }

//       // If not the target, but has children, recurse
//       if (layer.children?.length) {
//         return { ...layer, children: toggleLayerById(layer.children) };
//       }

//       return layer; // no match, no children
//     });
//   };

//   setDataLayers((prevGroups) =>
//     prevGroups.map((group) =>
//       group.id === groupId
//         ? { ...group, children: toggleLayerById(group.children) }
//         : group
//     )
//   );

//   if (layerToZoom)
//     requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
// };
