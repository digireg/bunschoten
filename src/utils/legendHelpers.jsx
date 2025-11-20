import { useEffect, useState } from "react";
import axios from "axios";

// ----------------------------
// WMS Legend URL
// ----------------------------

export const useWMSLegends = (wmsLayers) => {
  const [legendUrls, setLegendUrls] = useState({});

  useEffect(() => {
    if (!wmsLayers || wmsLayers.length === 0) {
      console.log("[useWMSLegends] No WMS layers provided");
      setLegendUrls({});
      return;
    }

    let cancelled = false; // prevent updating state after unmount
    const fetchLegends = async () => {
      const urls = {};
      console.log(
        "[useWMSLegends] Fetching legends for layers:",
        wmsLayers.map((l) => l.layerName)
      );

      await Promise.all(
        wmsLayers.map(async (layer) => {
          try {
            const capUrl = `${layer.url}?service=WMS&request=GetCapabilities`;
            console.log(`[useWMSLegends] Fetching GetCapabilities: ${capUrl}`);
            const res = await axios.get(capUrl);
            const parser = new DOMParser();
            const xml = parser.parseFromString(res.data, "text/xml");

            const layerEl = [...xml.querySelectorAll("Layer > Name")].find(
              (el) => el.textContent === layer.layerName
            );

            if (layerEl) {
              const legendEl = layerEl.parentElement.querySelector(
                "Style > LegendURL > OnlineResource"
              );
              urls[layer.layerName] =
                legendEl?.getAttribute("xlink:href") || null;
              console.log(
                `[useWMSLegends] Found legend URL for ${layer.layerName}:`,
                urls[layer.layerName]
              );
            } else {
              urls[layer.layerName] = null;
              console.warn(
                `[useWMSLegends] Layer not found in capabilities: ${layer.layerName}`
              );
            }
          } catch (err) {
            urls[layer.layerName] = null;
            console.error(
              `[useWMSLegends] Failed to fetch capabilities for ${layer.layerName}:`,
              err
            );
          }
        })
      );

      if (!cancelled) {
        console.log("[useWMSLegends] Setting legend URLs:", urls);
        setLegendUrls(urls);
      }
    };

    fetchLegends();

    return () => {
      cancelled = true;
    };
  }, [wmsLayers.map((l) => l.layerName).join(",")]); // <-- only re-run if layer names change

  return legendUrls;
};

// ----------------------------
// WMTS Legend URL (async)
// ----------------------------
export async function getWmtsLegendUrl(layer) {
  if (!layer.url || !layer.layerName) return null;

  const getCapabilitiesUrl =
    layer.url.replace(/\?.*$/, "") + "?SERVICE=WMTS&REQUEST=GetCapabilities";

  try {
    const res = await fetch(getCapabilitiesUrl);
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const layerElements = xml.querySelectorAll(
      "Layer[ows\\:Identifier], Layer Identifier"
    );
    for (let l of layerElements) {
      const identifier = l.querySelector(
        "ows\\:Identifier, Identifier"
      )?.textContent;
      if (identifier === layer.layerName) {
        const legendUrl =
          l
            .querySelector("LegendURL OnlineResource")
            ?.getAttribute("xlink:href") ||
          l.querySelector("LegendURL OnlineResource")?.getAttribute("href");
        return legendUrl || null;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch WMTS legend URL:", err);
    return null;
  }

  return null;
}

export function getLegendUrlsForLayer(layer) {
  return layer.legendUrls || [];
}
