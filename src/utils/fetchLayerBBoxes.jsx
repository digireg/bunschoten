//V5
// export async function fetchLayerBBoxes(datasetConfig) {
//   // Ensure datasetConfig.url never ends with "?"
//   const baseUrl = datasetConfig.url.endsWith("?")
//     ? datasetConfig.url.slice(0, -1)
//     : datasetConfig.url;

//   const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

//   try {
//     const response = await fetch(
//       `${baseUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
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

//v6

// export async function fetchLayerBBoxes(datasetConfig) {
//   const baseUrl = datasetConfig.url.endsWith("?")
//     ? datasetConfig.url.slice(0, -1)
//     : datasetConfig.url;

//   const projectionPriority = datasetConfig.projectionPriority || [
//     "EPSG:3857",
//     "EPSG:4326",
//   ];

//   try {
//     const response = await fetch(
//       `${baseUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
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

//v7

export async function fetchLayerBBoxes(datasetConfig, options = {}) {
  if (datasetConfig.type === "wmts") {
    // Skip WMTS bbox fetch; return empty object
    return {};
  }
  const baseUrl = datasetConfig.url.endsWith("?")
    ? datasetConfig.url.slice(0, -1)
    : datasetConfig.url;

  const projectionPriority = datasetConfig.projectionPriority || [
    "EPSG:3857",
    "EPSG:4326",
  ];

  const useRecursive = options.recursiveParsing || false;

  try {
    const response = await fetch(
      `${baseUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
    );
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const bboxes = {};

    function parseLayerNode(layerNode) {
      const nameNode = layerNode.getElementsByTagName("Name")[0];
      if (nameNode) {
        const layerName = nameNode.textContent;
        let bboxNode = null;
        let crsUsed = null;

        for (const crs of projectionPriority) {
          const boxes = Array.from(
            layerNode.getElementsByTagName("BoundingBox")
          );
          bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
          if (bboxNode) {
            crsUsed = crs;
            break;
          }
        }

        if (bboxNode) {
          const minx = parseFloat(bboxNode.getAttribute("minx"));
          const miny = parseFloat(bboxNode.getAttribute("miny"));
          const maxx = parseFloat(bboxNode.getAttribute("maxx"));
          const maxy = parseFloat(bboxNode.getAttribute("maxy"));

          bboxes[layerName] = {
            extent: [minx, miny, maxx, maxy],
            crs: crsUsed,
          };
        }
      }

      // recurse if needed
      if (useRecursive) {
        Array.from(layerNode.children)
          .filter((c) => c.nodeName === "Layer")
          .forEach(parseLayerNode);
      }
    }

    const capabilityNode = xml.getElementsByTagName("Capability")[0];
    if (capabilityNode) {
      Array.from(capabilityNode.children)
        .filter((c) => c.nodeName === "Layer")
        .forEach(parseLayerNode);
    }

    return bboxes;
  } catch (err) {
    console.error(
      "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
      err
    );
    return {};
  }
}

//v8
// export async function fetchLayerBBoxes(datasetConfig, options = {}) {
//   const baseUrl = datasetConfig.url.endsWith("?")
//     ? datasetConfig.url.slice(0, -1)
//     : datasetConfig.url;

//   const projectionPriority = datasetConfig.projectionPriority || [
//     "EPSG:3857",
//     "EPSG:4326",
//   ];

//   const useRecursive = options.recursiveParsing || false;

//   // 🔹 Determine service type (default = WMS)
//   const serviceType =
//     datasetConfig.type?.toLowerCase() === "wmts" ? "WMTS" : "WMS";

//   try {
//     const response = await fetch(
//       `${baseUrl}?SERVICE=${serviceType}&REQUEST=GetCapabilities`
//     );
//     const text = await response.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     const bboxes = {};

//     // === WMS Capabilities ===
//     if (serviceType === "WMS") {
//       function parseLayerNode(layerNode) {
//         const nameNode = layerNode.getElementsByTagName("Name")[0];
//         if (nameNode) {
//           const layerName = nameNode.textContent;
//           let bboxNode = null;
//           let crsUsed = null;

//           for (const crs of projectionPriority) {
//             const boxes = Array.from(
//               layerNode.getElementsByTagName("BoundingBox")
//             );
//             bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
//             if (bboxNode) {
//               crsUsed = crs;
//               break;
//             }
//           }

//           if (bboxNode) {
//             const minx = parseFloat(bboxNode.getAttribute("minx"));
//             const miny = parseFloat(bboxNode.getAttribute("miny"));
//             const maxx = parseFloat(bboxNode.getAttribute("maxx"));
//             const maxy = parseFloat(bboxNode.getAttribute("maxy"));

//             bboxes[layerName] = {
//               extent: [minx, miny, maxx, maxy],
//               crs: crsUsed,
//             };
//           }
//         }

//         // recurse if needed
//         if (useRecursive) {
//           Array.from(layerNode.children)
//             .filter((c) => c.nodeName === "Layer")
//             .forEach(parseLayerNode);
//         }
//       }

//       const capabilityNode = xml.getElementsByTagName("Capability")[0];
//       if (capabilityNode) {
//         Array.from(capabilityNode.children)
//           .filter((c) => c.nodeName === "Layer")
//           .forEach(parseLayerNode);
//       }
//     }

//     // === WMTS Capabilities ===
//     else if (serviceType === "WMTS") {
//       const layerNodes = Array.from(xml.getElementsByTagName("Layer"));
//       for (const layerNode of layerNodes) {
//         const identifierNode =
//           layerNode.getElementsByTagName("ows:Identifier")[0];
//         if (!identifierNode) continue;

//         const layerName = identifierNode.textContent;

//         const bboxNode = layerNode.getElementsByTagName(
//           "ows:WGS84BoundingBox"
//         )[0];
//         if (bboxNode) {
//           const lowerCorner = bboxNode
//             .getElementsByTagName("ows:LowerCorner")[0]
//             ?.textContent.split(" ")
//             .map(Number);
//           const upperCorner = bboxNode
//             .getElementsByTagName("ows:UpperCorner")[0]
//             ?.textContent.split(" ")
//             .map(Number);

//           if (lowerCorner && upperCorner) {
//             bboxes[layerName] = {
//               extent: [
//                 lowerCorner[0],
//                 lowerCorner[1],
//                 upperCorner[0],
//                 upperCorner[1],
//               ],
//               crs: "EPSG:3857,EPSG:4326", // WMTS always defines WGS84BoundingBox in 4326
//             };
//           }
//         }
//       }
//     }

//     return bboxes;
//   } catch (err) {
//     console.error(
//       `[fetchLayerBBoxes] Error fetching/parsing ${
//         datasetConfig.type || "WMS"
//       } Capabilities:`,
//       err
//     );
//     return {};
//   }
// }
