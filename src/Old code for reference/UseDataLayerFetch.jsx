// import { useState, useEffect } from "react";
// import { DataLayerCreate } from "../components/DataLayerCreate";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// /**
//  * Recursively add unique keys to each layer and its children
//  * Also passes down the parent URL so legend generation works
//  */
// function addKeysRecursively(layers, groupId, parentKey = "", parentUrl = "") {
//   return layers.filter(Boolean).map((layer, index) => {
//     const layerKey = parentKey
//       ? `${parentKey}-${layer.id || index}`
//       : `${groupId}:${layer.id || index}`;

//     const layerUrl = layer.url || parentUrl; // <-- inherit parent URL

//     return {
//       ...layer,
//       key: layerKey,
//       url: layerUrl,
//       children: layer.children
//         ? addKeysRecursively(layer.children, groupId, layerKey, layerUrl)
//         : [],
//     };
//   });
// }

// export default function useDataLayerFetch() {
//   const [dataLayers, setDataLayers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchAllLayers() {
//       try {
//         const datasets = await Promise.all(
//           Object.entries(DATASET_CONFIG).map(async ([groupId, config]) => {
//             const rawLayers = await DataLayerCreate(
//               `${config.url}SERVICE=WMS&REQUEST=GetCapabilities`,
//               groupId
//             );

//             const cleanLayers = Array.isArray(rawLayers)
//               ? addKeysRecursively(rawLayers, groupId, "", config.url)
//               : [];

//             return {
//               id: groupId,
//               title: config.title || groupId,
//               url: config.url, // keep the parent URL at group level too
//               children: cleanLayers,
//             };
//           })
//         );

//         if (isMounted) {
//           setDataLayers(datasets);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Error fetching layers:", err);
//         if (isMounted) {
//           setError(err);
//           setLoading(false);
//         }
//       }
//     }

//     fetchAllLayers();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return { dataLayers, loading, error };
// }

//V3
// import { useState, useEffect } from "react";
// import { DataLayerCreate } from "../components/DataLayerCreate";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// /**
//  * Recursively add unique keys to each layer and its children
//  * Also passes down the parent URL so legend generation works
//  */
// function addKeysRecursively(layers, groupId, parentKey = "", parentUrl = "") {
//   return layers.filter(Boolean).map((layer, index) => {
//     const layerKey = parentKey
//       ? `${parentKey}-${layer.id || index}`
//       : `${groupId}:${layer.id || index}`;

//     const layerUrl = layer.url || parentUrl; // <-- inherit parent URL

//     // Extract legends dynamically from Style array
//     const legends = (layer.Style || [])
//       .map((style) => style.LegendURL?.[0]?.OnlineResource?.["xlink:href"])
//       .filter(Boolean);

//     return {
//       ...layer,
//       key: layerKey,
//       url: layerUrl,
//       legends, // <-- attach extracted legends
//       children: layer.children
//         ? addKeysRecursively(layer.children, groupId, layerKey, layerUrl)
//         : [],
//     };
//   });
// }

// export default function useDataLayerFetch() {
//   const [dataLayers, setDataLayers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchAllLayers() {
//       try {
//         const datasets = await Promise.all(
//           Object.entries(DATASET_CONFIG).map(async ([groupId, config]) => {
//             const rawLayers = await DataLayerCreate(
//               `${config.url}SERVICE=WMS&REQUEST=GetCapabilities`,
//               groupId
//             );

//             const cleanLayers = Array.isArray(rawLayers)
//               ? addKeysRecursively(rawLayers, groupId, "", config.url)
//               : [];

//             return {
//               id: groupId,
//               title: config.title || groupId,
//               url: config.url, // keep the parent URL at group level too
//               children: cleanLayers,
//             };
//           })
//         );

//         if (isMounted) {
//           setDataLayers(datasets);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Error fetching layers:", err);
//         if (isMounted) {
//           setError(err);
//           setLoading(false);
//         }
//       }
//     }

//     fetchAllLayers();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return { dataLayers, loading, error };
// }

//v4

// function addKeysRecursively(layers, groupId, parentKey = "") {
//   return layers.filter(Boolean).map((layer, index) => {
//     const layerKey = parentKey
//       ? `${parentKey}-${layer.id || index}`
//       : `${groupId}:${layer.id || index}`;

//     return {
//       ...layer,
//       key: layerKey,
//       children: layer.children
//         ? addKeysRecursively(layer.children, groupId, layerKey)
//         : [],
//     };
//   });
// }
