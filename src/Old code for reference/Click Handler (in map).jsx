// Add click handler for feature info
//v1 everything broken
// map.on("singleclick", async (evt) => {
//   console.log("click");
//   if (!mapInstance.current) return;

//   const view = mapInstance.current.getView();
//   const resolution = view.getResolution();
//   const coordinate = evt.coordinate;
//   let clickedFeature = null;
//   let clickedLayerId = null;

//   async function checkLayer(layer) {
//     console.log(
//       "[checkLayer start]",
//       "id:",
//       layer.id,
//       "active:",
//       layer.active,
//       "source exists:",
//       !!wmsWmtsLayersRef.current[layer.id]
//     );

//     if (!layer.active) return null;
//     let features = null;

//     // 🔹 WMS layers
//     if (
//       layer.type.toLowerCase() === "wms" &&
//       wmsWmtsLayersRef.current[layer.id]
//     ) {
//       const source = wmsWmtsLayersRef.current[layer.id];

//       const url = source.getFeatureInfoUrl(
//         coordinate,
//         resolution,
//         view.getProjection().getCode(),
//         {
//           INFO_FORMAT: "application/json", // always JSON
//           QUERY_LAYERS: layer.id,
//           FEATURE_COUNT: 10,
//         }
//       );

//       console.log("[GetFeatureInfo URL]", url);
//       if (!url) return null;

//       try {
//         const res = await fetch(url);
//         const text = await res.text();
//         console.log("[Raw GetFeatureInfo response]", text.slice(0, 200));

//         // ✅ Parse JSON only
//         if (text.trim().startsWith("{")) {
//           const json = JSON.parse(text);
//           if (json?.features?.length > 0) {
//             const format = new GeoJSON();
//             features = format.readFeatures(json, {
//               featureProjection: view.getProjection(),
//             });
//             console.log(
//               `[Parsed Features] ${layer.id}:`,
//               features.length,
//               features.map((f) => f.getId() || f.get("id"))
//             );
//           } else {
//             console.log(`[No features parsed] ${layer.id}`);
//           }
//         } else {
//           console.warn(
//             `[GetFeatureInfo] Non-JSON response for layer ${layer.id}`
//           );
//         }
//       } catch (err) {
//         console.warn(`${layer.id} GetFeatureInfo failed`, err);
//       }
//     }

//     // 🔹 Recurse into children if grouped
//     if (layer.children?.length) {
//       for (const child of layer.children) {
//         const childFeatures = await checkLayer(child);
//         if (childFeatures) return childFeatures;
//       }
//     }

//     if (features && features.length > 0) clickedLayerId = layer.id;
//     return features;
//   }

//   // Loop through all dataLayers
//   for (const group of dataLayersRef.current) {
//     for (const layer of group.children) {
//       const features = await checkLayer(layer);
//       if (features) {
//         clickedFeature = features[0];
//         clearFeatures();
//         addFeatures(features);
//         setSelectedFeature(clickedFeature.getProperties());
//         setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//         setActivePanel("laagdata");
//         break;
//       }
//     }
//     if (clickedFeature) break;
//   }

//   if (!clickedFeature) {
//     console.log("[No feature found on click]");
//     clearFeatures();
//     setSelectedFeature(null);
//     setSelectedFeatureId(null);
//   }
// });

//v2
// map.on("singleclick", async (evt) => {
//   console.log("click");
//   if (!mapInstance.current) return;

//   const view = mapInstance.current.getView();
//   const resolution = view.getResolution();
//   const coordinate = evt.coordinate;

//   let clickedFeature = null;
//   let clickedLayerId = null;

//   async function checkLayer(layer) {
//     console.log(
//       "[checkLayer start]",
//       "id:",
//       layer.id,
//       "active:",
//       layer.active,
//       "source exists:",
//       !!wmsWmtsLayersRef.current[layer.id]
//     );

//     if (!layer.active) return null;

//     let features = null;

//     // WMS layers
//     if (
//       layer.type.toLowerCase() === "wms" &&
//       wmsWmtsLayersRef.current[layer.id]
//     ) {
//       const source = wmsWmtsLayersRef.current[layer.id];

//       // Use the actual WMS layer name if defined, otherwise fallback to id
//       const queryLayerName = layer.wmsLayerName || layer.id;

//       const url = source.getFeatureInfoUrl(
//         coordinate,
//         resolution,
//         view.getProjection().getCode(),
//         {
//           INFO_FORMAT: "application/json; subtype=geojson", // preferred JSON subtype
//           QUERY_LAYERS: queryLayerName,
//           FEATURE_COUNT: 10,
//         }
//       );

//       console.log("[GetFeatureInfo URL]", url);

//       if (!url) return null;

//       try {
//         const res = await fetch(url);
//         console.log("[GetFeatureInfo status]", res.status, res.statusText);

//         const text = await res.text();
//         console.log("[Raw GetFeatureInfo response]", text.slice(0, 300));

//         if (text.trim().startsWith("{")) {
//           // JSON/GeoJSON branch
//           const json = JSON.parse(text);
//           if (json?.features?.length > 0) {
//             const format = new GeoJSON();
//             features = format.readFeatures(json, {
//               featureProjection: view.getProjection(),
//             });
//           }
//         } else {
//           // XML/GML fallback
//           try {
//             const format = new WMSGetFeatureInfo();
//             features = format.readFeatures(text, {
//               featureProjection: view.getProjection(),
//             });
//           } catch (err) {
//             console.warn(`${layer.id} WMSGetFeatureInfo parse failed`, err);
//           }
//         }

//         if (features && features.length > 0) {
//           console.log(
//             `[Parsed Features] ${layer.id}:`,
//             features.length,
//             features.map((f) => f.getId() || f.get("id"))
//           );
//         } else {
//           console.log(`[No features parsed] ${layer.id}`);
//         }
//       } catch (err) {
//         console.warn(`${layer.id} GetFeatureInfo failed`, err);
//       }
//     }

//     if (features && features.length > 0) {
//       clickedLayerId = layer.id;
//       return features;
//     }

//     // Recurse into children if grouped
//     if (layer.children?.length) {
//       for (const child of layer.children) {
//         const childFeatures = await checkLayer(child);
//         if (childFeatures) return childFeatures;
//       }
//     }

//     return null;
//   }

//   // Loop through all data layers
//   for (const group of dataLayersRef.current) {
//     for (const layer of group.children) {
//       const features = await checkLayer(layer);
//       if (features) {
//         clickedFeature = features[0];
//         clearFeatures();
//         addFeatures(features);
//         setSelectedFeature(clickedFeature.getProperties());
//         setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//         setActivePanel("laagdata");
//         break;
//       }
//     }
//     if (clickedFeature) break;
//   }

//   if (!clickedFeature) {
//     console.log("[No feature found on click]");
//     clearFeatures();
//     setSelectedFeature(null);
//     setSelectedFeatureId(null);
//   }
// });

//v3 Mbale broken
// map.on("singleclick", async (evt) => {
//   if (!mapInstance.current) return;

//   const view = mapInstance.current.getView();
//   const resolution = view.getResolution();
//   const coordinate = evt.coordinate;

//   let clickedFeature = null;
//   let clickedLayerId = null;

//   // 🔹 Recursive feature check
//   async function checkLayer(layer) {
//     if (!layer.active) return null;

//     let features = null;

//     // WMS Layer
//     if (layer.type === "wms" && wmsWmtsLayersRef.current[layer.id]) {
//       const source = wmsWmtsLayersRef.current[layer.id];

//       const url = source.getFeatureInfoUrl(
//         coordinate,
//         resolution,
//         view.getProjection().getCode(),
//         {
//           INFO_FORMAT: "application/json", // request JSON first
//           QUERY_LAYERS: layer.id,
//           FEATURE_COUNT: 10,
//         }
//       );

//       if (!url) return null;

//       try {
//         const res = await fetch(url);
//         const text = await res.text();
//         const trimmed = text.trim();

//         if (!trimmed) return null;

//         // ✅ Decide parser dynamically
//         if (trimmed.startsWith("{")) {
//           // JSON branch
//           try {
//             const json = JSON.parse(trimmed);
//             if (json?.features?.length > 0) {
//               features = new GeoJSON().readFeatures(json, {
//                 featureProjection: view.getProjection(),
//               });
//             }
//           } catch (e) {
//             console.warn(`${layer.id} JSON parsing failed`, e);
//           }
//         } else if (trimmed.startsWith("<")) {
//           // XML / GML branch
//           try {
//             features = new WMSGetFeatureInfo().readFeatures(trimmed, {
//               featureProjection: view.getProjection(),
//             });
//           } catch (e) {
//             console.warn(`${layer.id} GML/XML parsing failed`, e);
//           }
//         } else {
//           // Fallback for plain text
//           console.warn(
//             `[GetFeatureInfo] Non-JSON/XML response for layer ${layer.id}`
//           );
//         }

//         if (features?.length > 0) {
//           clickedLayerId = layer.id;
//           return features;
//         }
//       } catch (err) {
//         console.warn(`${layer.id} GetFeatureInfo request failed`, err);
//       }
//     }

//     // Vector Layer fallback
//     if (layer.type === "vector" && layer.source) {
//       const pixel = mapInstance.current.getPixelFromCoordinate(coordinate);
//       mapInstance.current.forEachFeatureAtPixel(pixel, (feat, lyr) => {
//         if (lyr === layer.source) {
//           features = [feat];
//         }
//       });
//       if (features?.length > 0) {
//         clickedLayerId = layer.id;
//         return features;
//       }
//     }

//     // 🔹 Recurse into children if grouped
//     if (layer.children?.length) {
//       for (const child of layer.children) {
//         const childFeatures = await checkLayer(child);
//         if (childFeatures) return childFeatures;
//       }
//     }

//     return null;
//   }

//   // 🔹 Iterate over all top-level layers
//   for (const group of dataLayersRef.current) {
//     for (const layer of group.children) {
//       const features = await checkLayer(layer);
//       if (features) {
//         clickedFeature = features[0];
//         clearFeatures();
//         addFeatures(features);
//         setSelectedFeature(clickedFeature.getProperties());
//         setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//         setActivePanel("laagdata");
//         break;
//       }
//     }
//     if (clickedFeature) break;
//   }

//   if (!clickedFeature) {
//     clearFeatures();
//     setSelectedFeature(null);
//     setSelectedFeatureId(null);
//     console.log("[No feature found on click]");
//   }
// });
