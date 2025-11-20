import TileWMS from "ol/source/TileWMS";

function registerWMSSource(layerId, url, params = {}) {
  if (!wmsWmtsLayersRef.current[layerId]) {
    wmsWmtsLayersRef.current[layerId] = new TileWMS({
      url,
      params: {
        TILED: true,
        FORMAT: "image/png",
        ...params,
      },
      serverType: "mapserver",
      crossOrigin: "anonymous",
    });
    console.log(`[DEBUG] Registered WMS source for ${layerId}`);
  }
}
