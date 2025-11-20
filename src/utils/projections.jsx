import { fromLonLat } from "ol/proj";
import proj4 from "proj4";

export function toProjection(coords, targetProj) {
  if (targetProj === "EPSG:28992") {
    return proj4("EPSG:4326", "EPSG:28992", coords);
  }
  return fromLonLat(coords);
}

// Converts coordinates to the specified EPSG projection.
// Centralizes reprojection logic so map components can switch between
// EPSG:3857 (Web Mercator) and EPSG:28992 (RD New / Amersfoort) consistently.
