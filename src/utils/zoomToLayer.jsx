//v6
// import { transformExtent } from "ol/proj";

// /**
//  * zoomToLayer
//  * ---------------------------
//  * Zooms the map view to a given bounding box.
//  *
//  * @param {ol/Map} mapInstance - The OpenLayers map instance
//  * @param {Object|Array} bboxObj - Either [minX, minY, maxX, maxY] array or {extent, crs}
//  * @param {string} defaultCrs - default CRS if bboxObj is array
//  */
// export function zoomToLayer(mapInstance, bboxObj, defaultCrs = "EPSG:4326") {
//   if (!mapInstance || !bboxObj) {
//     console.warn("[zoomToLayer] invalid input", mapInstance, bboxObj);
//     return;
//   }

//   // Support both array or {extent, crs} object
//   const extent =
//     Array.isArray(bboxObj) && bboxObj.length === 4 ? bboxObj : bboxObj.extent;
//   const sourceCrs = bboxObj.crs || defaultCrs;

//   if (!extent || extent.length !== 4) {
//     console.warn("[zoomToLayer] invalid extent", extent);
//     return;
//   }

//   try {
//     let transformedExtent = extent.slice();

//     // WMS 1.3.0 EPSG:4326 uses [lat, lon] axis order -> swap to [lon, lat]
//     if (sourceCrs === "EPSG:4326") {
//       transformedExtent = [
//         extent[1], // minY → minX
//         extent[0], // minX → minY
//         extent[3], // maxY → maxX
//         extent[2], // maxX → maxY
//       ];
//       console.log(
//         "[zoomToLayer] swapped axis order for EPSG:4326",
//         transformedExtent
//       );
//     }

//     const viewProjection = mapInstance.getView().getProjection().getCode();
//     const finalExtent = transformExtent(
//       transformedExtent,
//       sourceCrs,
//       viewProjection
//     );

//     console.log(
//       "[zoomToLayer] transforming from",
//       sourceCrs,
//       "to",
//       viewProjection,
//       "→",
//       finalExtent
//     );

//     // Check if current view already inside bbox to prevent zooming out unnecessarily
//     const viewExtent = mapInstance.getView().calculateExtent();
//     const inside =
//       viewExtent[0] >= finalExtent[0] &&
//       viewExtent[1] >= finalExtent[1] &&
//       viewExtent[2] <= finalExtent[2] &&
//       viewExtent[3] <= finalExtent[3];

//     if (inside) {
//       console.log("[zoomToLayer] map already inside bbox, skipping zoom");
//       return;
//     }

//     mapInstance.getView().fit(finalExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19,
//     });

//     console.log("[zoomToLayer] zoom applied");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err);
//   }
// }

//v7
import { transformExtent } from "ol/proj";

/**
 * zoomToLayer
 * ---------------------------
 * Zooms the map view to a given bounding box.
 *
 * @param {ol/Map} mapInstance - The OpenLayers map instance
 * @param {Object|Array} bboxObj - Either [minX, minY, maxX, maxY] array or {extent, crs}
 * @param {string} defaultCrs - default CRS if bboxObj is array
 */
export function zoomToLayer(mapInstance, bboxObj, defaultCrs = "EPSG:4326") {
  if (!mapInstance || !bboxObj) {
    console.warn("[zoomToLayer] invalid input", mapInstance, bboxObj);
    return;
  }

  // Support both array or {extent, crs} object
  const extent =
    Array.isArray(bboxObj) && bboxObj.length === 4 ? bboxObj : bboxObj.extent;
  const sourceCrs = bboxObj.crs || defaultCrs;

  if (!extent || extent.length !== 4) {
    console.warn("[zoomToLayer] invalid extent", extent);
    return;
  }

  try {
    let transformedExtent = extent.slice();

    // WMS 1.3.0 EPSG:4326 uses [lat, lon] axis order -> swap to [lon, lat]
    if (sourceCrs === "EPSG:4326") {
      transformedExtent = [
        extent[1], // minY → minX
        extent[0], // minX → minY
        extent[3], // maxY → maxX
        extent[2], // maxX → maxY
      ];
      console.log(
        "[zoomToLayer] swapped axis order for EPSG:4326",
        transformedExtent
      );
    }

    const viewProjection = mapInstance.getView().getProjection().getCode();
    const finalExtent = transformExtent(
      transformedExtent,
      sourceCrs,
      viewProjection
    );

    console.log(
      "[zoomToLayer] transforming from",
      sourceCrs,
      "to",
      viewProjection,
      "→",
      finalExtent
    );

    // Check if current view already inside bbox to prevent zooming out unnecessarily
    const viewExtent = mapInstance.getView().calculateExtent();
    const inside =
      viewExtent[0] >= finalExtent[0] &&
      viewExtent[1] >= finalExtent[1] &&
      viewExtent[2] <= finalExtent[2] &&
      viewExtent[3] <= finalExtent[3];

    if (inside) {
      console.log("[zoomToLayer] map already inside bbox, skipping zoom");
      return;
    }

    mapInstance.getView().fit(finalExtent, {
      padding: [50, 50, 50, 50],
      duration: 500,
      maxZoom: 19,
    });

    console.log("[zoomToLayer] zoom applied");
  } catch (err) {
    console.error("[zoomToLayer] error transforming/fitting extent:", err);
  }
}
