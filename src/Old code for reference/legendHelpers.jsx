// export function getWmsLegendUrl(layer) {
//   if (!layer.url || !layer.id) return null;

//   // Strip query params if any
//   const baseUrl = layer.url.split("?")[0];

//   // Build query manually
//   const query = [
//     `SERVICE=WMS`,
//     `VERSION=1.3.0`,
//     `REQUEST=GetLegendGraphic`,
//     `LAYER=${layer.id}`,
//     `FORMAT=image/png`,
//     `STYLE=${layer.style || "default"}`,
//     `SLD_VERSION=1.1.0`,
//   ].join("&");

//   const url = `${baseUrl}?${query}`;
//   console.log("[getWmsLegendUrl] Layer:", layer.id, "→", url);
//   return url;
// }
