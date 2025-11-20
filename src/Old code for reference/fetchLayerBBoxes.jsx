//V1
// export async function fetchLayerBBoxes(datasetConfig) {
//   const datasetUrl = datasetConfig.url;
//   const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

//   try {
//     const response = await fetch(
//       `${datasetUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
//     );
//     const text = await response.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     const layerNodes = Array.from(xml.getElementsByTagName("Layer"));

//     const bboxes = {};

//     layerNodes.forEach((layerNode) => {
//       const nameNode = layerNode.getElementsByTagName("Name")[0];
//       if (!nameNode) return;

//       const layerName = nameNode.textContent;

//       // find BoundingBox node matching preferred CRS
//       let bboxNode = null;
//       for (const crs of projectionPriority) {
//         const boxes = Array.from(layerNode.getElementsByTagName("BoundingBox"));
//         bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
//         if (bboxNode) break;
//       }

//       if (bboxNode) {
//         const minx = parseFloat(bboxNode.getAttribute("minx"));
//         const miny = parseFloat(bboxNode.getAttribute("miny"));
//         const maxx = parseFloat(bboxNode.getAttribute("maxx"));
//         const maxy = parseFloat(bboxNode.getAttribute("maxy"));

//         bboxes[layerName] = [minx, miny, maxx, maxy];
//       }
//     });

//     return bboxes;
//   } catch (err) {
//     console.error(
//       "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
//       err
//     );
//     return {};
//   }
// }

// v2
// export async function fetchLayerBBoxes(datasetConfig) {
//   const datasetUrl = datasetConfig.url;
//   const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

//   try {
//     const response = await fetch(
//       `${datasetUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
//     );
//     const text = await response.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     const layerNodes = Array.from(xml.getElementsByTagName("Layer"));
//     const bboxes = {};

//     layerNodes.forEach((layerNode) => {
//       const nameNode = layerNode.getElementsByTagName("Name")[0];
//       if (!nameNode) return;

//       const layerName = nameNode.textContent;

//       let bboxNode = null;
//       let crsUsed = null;

//       for (const crs of projectionPriority) {
//         const boxes = Array.from(layerNode.getElementsByTagName("BoundingBox"));
//         bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
//         if (bboxNode) {
//           crsUsed = crs;
//           break;
//         }
//       }

//       if (bboxNode) {
//         const minx = parseFloat(bboxNode.getAttribute("minx"));
//         const miny = parseFloat(bboxNode.getAttribute("miny"));
//         const maxx = parseFloat(bboxNode.getAttribute("maxx"));
//         const maxy = parseFloat(bboxNode.getAttribute("maxy"));

//         bboxes[layerName] = {
//           extent: [minx, miny, maxx, maxy],
//           crs: crsUsed,
//         };
//       }
//     });

//     return bboxes;
//   } catch (err) {
//     console.error(
//       "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
//       err
//     );
//     return {};
//   }
// }

//V3
// export async function fetchLayerBBoxes(datasetConfig) {
//   // strip trailing "?" or "??" so we don’t break Mbale WMS
//   const cleanUrl = datasetConfig.url.replace(/\?+$/, "");
//   const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

//   try {
//     const response = await fetch(
//       `${cleanUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
//     );
//     const text = await response.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     const layerNodes = Array.from(xml.getElementsByTagName("Layer"));
//     const bboxes = {};

//     layerNodes.forEach((layerNode) => {
//       const nameNode = layerNode.getElementsByTagName("Name")[0];
//       if (!nameNode) return;

//       const layerName = nameNode.textContent;

//       let bboxNode = null;
//       let crsUsed = null;

//       // 1. Try BoundingBox nodes with preferred CRS
//       for (const crs of projectionPriority) {
//         const boxes = Array.from(layerNode.getElementsByTagName("BoundingBox"));
//         bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
//         if (bboxNode) {
//           crsUsed = crs;
//           break;
//         }
//       }

//       if (bboxNode) {
//         const minx = parseFloat(bboxNode.getAttribute("minx"));
//         const miny = parseFloat(bboxNode.getAttribute("miny"));
//         const maxx = parseFloat(bboxNode.getAttribute("maxx"));
//         const maxy = parseFloat(bboxNode.getAttribute("maxy"));

//         bboxes[layerName] = {
//           extent: [minx, miny, maxx, maxy],
//           crs: crsUsed,
//         };
//       } else {
//         // 2. Fallback: EX_GeographicBoundingBox (always EPSG:4326)
//         const geoBox = layerNode.getElementsByTagName(
//           "EX_GeographicBoundingBox"
//         )[0];
//         if (geoBox) {
//           const west = parseFloat(
//             geoBox.getElementsByTagName("westBoundLongitude")[0]?.textContent
//           );
//           const east = parseFloat(
//             geoBox.getElementsByTagName("eastBoundLongitude")[0]?.textContent
//           );
//           const south = parseFloat(
//             geoBox.getElementsByTagName("southBoundLatitude")[0]?.textContent
//           );
//           const north = parseFloat(
//             geoBox.getElementsByTagName("northBoundLatitude")[0]?.textContent
//           );

//           if ([west, south, east, north].every((v) => !isNaN(v))) {
//             bboxes[layerName] = {
//               extent: [west, south, east, north],
//               crs: "EPSG:4326",
//             };
//           }
//         }
//       }
//     });

//     return bboxes;
//   } catch (err) {
//     console.error(
//       "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
//       err
//     );
//     return {};
//   }
// }

//V4
// export async function fetchLayerBBoxes(datasetConfig) {
//   const datasetUrl = datasetConfig.url;
//   const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

//   try {
//     const response = await fetch(
//       `${datasetUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
//     );
//     const text = await response.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     const layerNodes = Array.from(xml.getElementsByTagName("Layer"));
//     const bboxes = {};

//     layerNodes.forEach((layerNode) => {
//       const nameNode = layerNode.getElementsByTagName("Name")[0];
//       if (!nameNode) return;

//       const layerName = nameNode.textContent;

//       let bboxNode = null;
//       let crsUsed = null;

//       for (const crs of projectionPriority) {
//         const boxes = Array.from(layerNode.getElementsByTagName("BoundingBox"));
//         bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
//         if (bboxNode) {
//           crsUsed = crs;
//           break;
//         }
//       }

//       if (bboxNode) {
//         let minx = parseFloat(bboxNode.getAttribute("minx"));
//         let miny = parseFloat(bboxNode.getAttribute("miny"));
//         let maxx = parseFloat(bboxNode.getAttribute("maxx"));
//         let maxy = parseFloat(bboxNode.getAttribute("maxy"));

//         // Fix for WMS 1.3.0 axis order in EPSG:4326 (lat/long instead of lon/lat)
//         if (crsUsed === "EPSG:4326") {
//           [minx, miny, maxx, maxy] = [miny, minx, maxy, maxx];
//           console.log("[fetchLayerBBoxes] swapped axis for EPSG:4326 bbox");
//         }

//         bboxes[layerName] = {
//           extent: [minx, miny, maxx, maxy],
//           crs: crsUsed,
//         };
//       }
//     });

//     return bboxes;
//   } catch (err) {
//     console.error(
//       "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
//       err
//     );
//     return {};
//   }
// }
