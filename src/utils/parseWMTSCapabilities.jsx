import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";

/**
 * Parses WMTS GetCapabilities and returns layer objects.
 */
export async function parseWMTSCapabilities(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const text = await res.text();
    const parser = new WMTSCapabilities();
    const caps = parser.read(text);

    const layersArray = Array.isArray(caps.Contents?.Layer)
      ? caps.Contents.Layer
      : [];

    return layersArray.map((l) => {
      const wmtsOptions = optionsFromCapabilities(caps, {
        layer: l.Identifier,
      });

      return {
        id: l.Identifier,
        title: l.Title || l.Identifier,
        type: "wmts",
        bbox: l.WGS84BoundingBox?.length === 4 ? [...l.WGS84BoundingBox] : null,
        styles: Array.isArray(l.Style)
          ? l.Style.map((s) => ({ name: s.Identifier, title: s.Title }))
          : [],
        wmtsOptions, // pass directly to addMapLayer
      };
    });
  } catch (err) {
    console.error("[parseWMTSCapabilities]", err);
    return [];
  }
}
