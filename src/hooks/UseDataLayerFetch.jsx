//v4
// import { useState, useEffect } from "react";
// import { DataLayerCreate } from "../components/DataLayerCreate";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// function addKeysRecursively(layers, groupId, parentKey = "") {
//   return layers.filter(Boolean).map((layer, index) => {
//     const uniqueKey = parentKey
//       ? `${parentKey}-${layer.id || index}` // React key
//       : `${groupId}:${layer.id || index}`;

//     return {
//       ...layer,
//       id: layer.id, // keep OL layer id untouched
//       key: uniqueKey, // React uniqueness
//       children: layer.children
//         ? addKeysRecursively(layer.children, groupId, uniqueKey)
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
//             let children = [];

//             // ✅ Use hardcoded children if they exist
//             if (Array.isArray(config.children) && config.children.length > 0) {
//               children = addKeysRecursively(
//                 config.children.map((child) => ({
//                   ...child,
//                   opacity: child.opacity ?? 100,
//                   active: child.active ?? false,
//                   type: child.type ?? config.type,
//                 })),
//                 groupId
//               );
//             } else {
//               // Otherwise fetch from WMS
//               const rawLayers = await DataLayerCreate(
//                 `${config.url}SERVICE=WMS&REQUEST=GetCapabilities`,
//                 groupId
//               );
//               children = Array.isArray(rawLayers)
//                 ? addKeysRecursively(rawLayers, groupId)
//                 : [];
//             }

//             return {
//               id: groupId,
//               title: config.title || groupId,
//               url: config.url,
//               children,
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

// useDataLayerFetch.jsx
import { useState, useEffect } from "react";
import { DataLayerCreate } from "../components/DataLayerCreate";
import { DATASET_CONFIG } from "../config/datasetConfig";
import { parseWMTSCapabilities } from "../utils/parseWMTSCapabilities";

function addKeysRecursively(layers, groupId, parentKey = "") {
  return layers.filter(Boolean).map((layer, index) => {
    const uniqueKey = parentKey
      ? `${parentKey}-${layer.id || index}`
      : `${groupId}:${layer.id || index}`;

    return {
      ...layer,
      id: layer.id,
      key: uniqueKey,
      children: layer.children
        ? addKeysRecursively(layer.children, groupId, uniqueKey)
        : [],
    };
  });
}

export default function useDataLayerFetch() {
  const [dataLayers, setDataLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllLayers() {
      try {
        const datasets = await Promise.all(
          Object.entries(DATASET_CONFIG).map(async ([groupId, config]) => {
            let children = [];

            // ✅ Use hardcoded children if defined
            if (Array.isArray(config.children) && config.children.length > 0) {
              children = addKeysRecursively(
                config.children.map((child) => ({
                  ...child,
                  opacity: child.opacity ?? 100,
                  active: child.active ?? false,
                  type: child.type ?? config.type,
                  parsedLayer: child.parsedLayer || null,
                })),
                groupId
              );
            }

            // ✅ Handle WMTS datasets
            // ✅ Handle WMS datasets
            else if (config.type === "wms" || !config.type) {
              const capabilitiesUrl = config.url.includes("GetCapabilities")
                ? config.url
                : `${config.url}${
                    config.url.includes("?") ? "" : "?"
                  }SERVICE=WMS&REQUEST=GetCapabilities`;

              const rawLayers = await DataLayerCreate(
                capabilitiesUrl,
                groupId,
                "wms"
              );

              children = Array.isArray(rawLayers)
                ? addKeysRecursively(
                    rawLayers.map((l) => ({
                      ...l,
                      opacity: l.opacity ?? 100,
                      active: l.active ?? false,
                      parsedLayer: l,
                    })),
                    groupId
                  )
                : [];
            }

            // ✅ Handle WMS datasets
            else {
              const rawLayers = await DataLayerCreate(
                config.url,
                groupId,
                config.type || "wms"
              );
              children = Array.isArray(rawLayers)
                ? addKeysRecursively(
                    rawLayers.map((l) => ({
                      ...l,
                      opacity: l.opacity ?? 100,
                      active: l.active ?? false,
                      parsedLayer: l,
                    })),
                    groupId
                  )
                : [];
            }

            return {
              id: groupId,
              title: config.title || groupId,
              url: config.url,
              type: config.type || "wms",
              children,
            };
          })
        );

        if (isMounted) {
          setDataLayers(datasets);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching layers:", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchAllLayers();
    return () => {
      isMounted = false;
    };
  }, []);

  return { dataLayers, loading, error };
}
