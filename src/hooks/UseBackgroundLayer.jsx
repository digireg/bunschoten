//v4
import { useEffect } from "react";
import { toLonLat } from "ol/proj";
import proj4 from "proj4";
import { NL_BBOX } from "../utils/geoHelpers";
import { createBaseLayer } from "../utils/baseLayerFactory";
import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

/**
 * Hook for managing the map’s background layer and automatic EPSG switching
 *
 * Behavior:
 * - Updates background layer source whenever `activeBackgroundLayer` or `currentProjectionCode` changes
 * - Automatically switches EPSG when zooming/panning into NL or zooming out
 * - Debounces view changes to avoid excessive updates
 *
 * Caveats:
 * - When EPSG switches, the new background layer may briefly render over your data layers until tiles finish loading
 *   This is a normal OpenLayers behavior and safe, but the user may notice a brief overlay/blurry effect
 * - Avoids memory leaks by not recreating layers unnecessarily
 *
 * @param {Object} params
 * @param {Object} params.mapInstance - Ref to OL Map instance
 * @param {Object} params.backgroundLayerRef - Ref to current background layer
 * @param {string} params.currentProjectionCode - Current map EPSG
 * @param {Function} params.setCurrentProjectionCode - Setter for EPSG state
 * @param {string} params.activeBackgroundLayer - Currently selected background layer ID
 * @param {Function} params.setActiveBackgroundLayer - Setter for active background layer
 * @param {Function} params.createMap - Function to recreate map on EPSG switch
 * @param {number} params.zoomThreshold - Minimum zoom to auto-switch to NL EPSG (default 12)
 */
export default function useBackgroundLayer({
  mapInstance,
  backgroundLayerRef,
  currentProjectionCode,
  setCurrentProjectionCode,
  activeBackgroundLayer,
  setActiveBackgroundLayer,
  createMap,
  zoomThreshold = 12,
}) {
  // -----------------------------
  // Update base layer source & zIndex when active background changes
  // -----------------------------
  useEffect(() => {
    if (!backgroundLayerRef.current || !mapInstance.current) return;

    const baseLayer = createBaseLayer(
      currentProjectionCode,
      activeBackgroundLayer
    );

    // Replace only the source to avoid recreating the layer (prevents memory leaks)
    backgroundLayerRef.current.setSource(baseLayer.getSource());
    // Always ensure background stays at bottom
    backgroundLayerRef.current.setZIndex(0);

    // Note: Data layers are assumed to have higher zIndex (e.g., 10)
  }, [activeBackgroundLayer, currentProjectionCode]);

  // -----------------------------
  // Auto-switch EPSG when zooming/panning into NL or out
  // -----------------------------
  useEffect(() => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    if (!view) return;

    let initialLoad = true;

    const handleViewChange = () => {
      if (!mapInstance.current) return;

      const centerProj = view.getCenter();
      const zoom = view.getZoom();
      const centerLonLat =
        currentProjectionCode === "EPSG:28992"
          ? proj4("EPSG:28992", "EPSG:4326", centerProj)
          : toLonLat(centerProj);

      const insideNL =
        centerLonLat[0] >= NL_BBOX[0] &&
        centerLonLat[0] <= NL_BBOX[2] &&
        centerLonLat[1] >= NL_BBOX[1] &&
        centerLonLat[1] <= NL_BBOX[3];

      // -----------------------------
      // Switch to NL EPSG if zoomed in sufficiently inside NL
      // -----------------------------
      if (
        insideNL &&
        zoom >= zoomThreshold &&
        currentProjectionCode !== "EPSG:28992"
      ) {
        const defaultNLLayer = Object.keys(
          backgroundLayersConfig["EPSG:28992"]
        )[0];
        setActiveBackgroundLayer(defaultNLLayer);
        setCurrentProjectionCode("EPSG:28992");
        if (createMap)
          createMap("EPSG:28992", centerLonLat, zoom, defaultNLLayer);
        return;
      }

      // -----------------------------
      // Switch back to world EPSG if outside NL or zoomed out
      // -----------------------------
      if (
        (!insideNL || zoom < zoomThreshold) &&
        currentProjectionCode !== "EPSG:3857"
      ) {
        const defaultWorldLayer = Object.keys(
          backgroundLayersConfig["EPSG:3857"]
        )[0];
        setActiveBackgroundLayer(defaultWorldLayer);
        setCurrentProjectionCode("EPSG:3857");
        if (createMap)
          createMap("EPSG:3857", centerLonLat, zoom, defaultWorldLayer);
      }
    };

    // Debounce changes to avoid excessive updates
    let debounceTimer;
    const onChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleViewChange, 200);
    };

    view.on("change:center", onChange);
    view.on("change:resolution", onChange);

    return () => {
      view.un("change:center", onChange);
      view.un("change:resolution", onChange);
      clearTimeout(debounceTimer);
    };
  }, [
    currentProjectionCode,
    setActiveBackgroundLayer,
    createMap,
    zoomThreshold,
  ]);
}

// NOTE: When EPSG auto-switch occurs (zooming/panning into NL or out),
// the new background layer may briefly render above data layers.
// Users may need to re-activate data layers to restore correct z-order.
// Future enhancement: add a manual EPSG switch button if desired.
