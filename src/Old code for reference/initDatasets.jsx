// initDatasets.js
import { DATASET_CONFIG } from "../config/datasetConfig";
import { loadWMSLayers } from "../utils/wmsLoader";
// import { loadWMTSLayers } from "./wmtsLoader"; // if you add WMTS loader later

export async function initDatasets() {
  const datasetEntries = Object.entries(DATASET_CONFIG);

  for (const [id, dataset] of datasetEntries) {
    switch (dataset.type) {
      case "WMS":
        await loadWMSLayers(id);
        break;

      case "WMTS":
        // await loadWMTSLayers(id); // implement WMTS loader later
        console.log(`[initDatasets] WMTS dataset detected: ${id}`);
        break;

      default:
        console.warn(`[initDatasets] Unknown dataset type: ${dataset.type}`);
    }
  }

  console.log(
    "[initDatasets] All datasets processed:",
    Object.keys(DATASET_CONFIG)
  );
}
