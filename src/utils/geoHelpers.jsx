// src/utils/geoHelpers.js

// Netherlands bounding box in WGS84 [minLon, minLat, maxLon, maxLat]
export const NL_BBOX = [3.35, 50.75, 7.23, 53.68];

/**
 * Check if a coordinate (lonLat = [lon, lat]) is inside the Netherlands bounding box
 * @param {number[]} lonLat - [longitude, latitude]
 * @returns {boolean}
 */
export function isInsideNL(lonLat) {
  const [lon, lat] = lonLat;
  return (
    lon >= NL_BBOX[0] &&
    lon <= NL_BBOX[2] &&
    lat >= NL_BBOX[1] &&
    lat <= NL_BBOX[3]
  );
}
