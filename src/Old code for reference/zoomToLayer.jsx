// // v1
// import { fromLonLat, transformExtent } from "ol/proj";

// /**
//  * zoomToLayer
//  * ---------------------------
//  * Zooms the map view to a given bounding box.
//  *
//  * @param {ol/Map} mapInstance - The OpenLayers map instance
//  * @param {Array<number>} bbox - Bounding box [minX, minY, maxX, maxY] in lon/lat
//  */
// export function zoomToLayer(mapInstance, bbox) {
//   if (!mapInstance || !bbox || bbox.length !== 4) {
//     console.warn(
//       "[zoomToLayer] mapInstance or bbox invalid",
//       mapInstance,
//       bbox
//     );
//     return;
//   }

//   console.log("[zoomToLayer] raw bbox:", bbox);

//   try {
//     // Transform from EPSG:4326 (lon/lat) to current map view projection
//     const viewProjection = mapInstance.getView().getProjection().getCode();

//     const transformedExtent = transformExtent(
//       bbox,
//       "EPSG:4326",
//       viewProjection
//     );
//     console.log("[zoomToLayer] transformed extent:", transformedExtent);

//     // Fit the map view to the transformed extent
//     mapInstance.getView().fit(transformedExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19, // optional: prevent zooming in too far
//     });

//     console.log("[zoomToLayer] zoom applied");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err);
//   }
// }

// v2
// import { transformExtent } from "ol/proj";

// export function zoomToLayer(mapInstance, bbox, sourceCrs = "EPSG:4326") {
//   if (!mapInstance || !bbox || bbox.length !== 4) {
//     console.warn("[zoomToLayer] invalid input", mapInstance, bbox);
//     return;
//   }

//   try {
//     const viewProjection = mapInstance.getView().getProjection().getCode();

//     const transformedExtent = transformExtent(bbox, sourceCrs, viewProjection);
//     console.log(
//       "[zoomToLayer] transforming from",
//       sourceCrs,
//       "to",
//       viewProjection,
//       "→",
//       transformedExtent
//     );

//     mapInstance.getView().fit(transformedExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19,
//     });

//     console.log("[zoomToLayer] zoom applied");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err);
//   }
// }

//v3
// import { transformExtent } from "ol/proj";

// /**
//  * Zooms the map view to a given bounding box.
//  *
//  * @param {ol/Map} mapInstance - The OpenLayers map instance
//  * @param {Array<number>} bbox - Bounding box [minX, minY, maxX, maxY]
//  * @param {string} sourceCrs - CRS of the bbox (default: EPSG:4326)
//  */
// export function zoomToLayer(mapInstance, bbox, sourceCrs = "EPSG:4326") {
//   if (!mapInstance || !bbox || bbox.length !== 4) {
//     console.warn("[zoomToLayer] invalid input", { mapInstance, bbox });
//     return;
//   }

//   try {
//     const viewProjection = mapInstance.getView().getProjection().getCode();

//     console.log("[zoomToLayer] incoming bbox:", bbox, "CRS:", sourceCrs);

//     const transformedExtent = transformExtent(bbox, sourceCrs, viewProjection);

//     console.log(
//       "[zoomToLayer] transforming from",
//       sourceCrs,
//       "to",
//       viewProjection,
//       "→",
//       transformedExtent
//     );

//     mapInstance.getView().fit(transformedExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19,
//     });

//     console.log("[zoomToLayer] zoom applied (extent fit)");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err, {
//       bbox,
//       sourceCrs,
//     });
//   }
// }

//v4
// import { transformExtent } from "ol/proj";
// import { containsExtent } from "ol/extent";

// export function zoomToLayer(mapInstance, bbox, sourceCrs = "EPSG:4326") {
//   if (!mapInstance || !bbox || bbox.length !== 4) {
//     console.warn("[zoomToLayer] invalid input", mapInstance, bbox);
//     return;
//   }

//   try {
//     const viewProjection = mapInstance.getView().getProjection().getCode();

//     const transformedExtent = transformExtent(bbox, sourceCrs, viewProjection);
//     const currentExtent = mapInstance.getView().calculateExtent();

//     // Prevent zooming out if the current view already contains the bbox
//     if (containsExtent(currentExtent, transformedExtent)) {
//       console.log("[zoomToLayer] already inside bbox, skipping zoom");
//       return;
//     }

//     console.log(
//       "[zoomToLayer] transforming from",
//       sourceCrs,
//       "to",
//       viewProjection,
//       "→",
//       transformedExtent
//     );

//     mapInstance.getView().fit(transformedExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19,
//     });

//     console.log("[zoomToLayer] zoom applied");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err);
//   }
// }

//v5
// import { transformExtent } from "ol/proj";

// export function zoomToLayer(mapInstance, bbox, sourceCrs = "EPSG:4326") {
//   if (!mapInstance || !bbox || bbox.length !== 4) {
//     console.warn("[zoomToLayer] invalid input", mapInstance, bbox);
//     return;
//   }

//   try {
//     const view = mapInstance.getView();
//     const viewProjection = view.getProjection().getCode();

//     // Transform bbox into the view’s projection
//     const transformedExtent = transformExtent(bbox, sourceCrs, viewProjection);
//     console.log(
//       "[zoomToLayer] transforming from",
//       sourceCrs,
//       "to",
//       viewProjection,
//       "→",
//       transformedExtent
//     );

//     // Get current extent
//     const currentExtent = view.calculateExtent(mapInstance.getSize());

//     // Check intersection
//     const intersects =
//       transformedExtent[0] < currentExtent[2] &&
//       transformedExtent[2] > currentExtent[0] &&
//       transformedExtent[1] < currentExtent[3] &&
//       transformedExtent[3] > currentExtent[1];

//     if (intersects) {
//       console.log("[zoomToLayer] already inside bbox → skip zoom");
//       return;
//     }

//     // Fit to extent only if not already inside
//     view.fit(transformedExtent, {
//       padding: [50, 50, 50, 50],
//       duration: 500,
//       maxZoom: 19,
//     });

//     console.log("[zoomToLayer] zoom applied");
//   } catch (err) {
//     console.error("[zoomToLayer] error transforming/fitting extent:", err);
//   }
// }
