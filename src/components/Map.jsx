//v2 map.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import { get as getProjection } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS";
import { ScaleLine, Attribution } from "ol/control";
import GeoJSON from "ol/format/GeoJSON";
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";
import { toast } from "react-toastify";

import { DATASET_CONFIG } from "../config/datasetConfig";

import {
  MapContainer,
  FloatingSearch,
  MapStyleContainer,
  GlobalStyle,
} from "../style_components";

import AchtergrondLaag from "./AchtergrondLaagContainer";
import TransparantieLaagSelect from "./TransparantieLaagContainer";
import DataLaagSelect from "./DataLaagSelectContainer";
import LaagData from "./LaagData";
import Measurement from "./MeasurementContainer";
// import DataLabel from "./DataLabelContainer (not in use)";
import ZoomControl from "./ZoomControl";
import SearchBar from "./Searchbar";
import Legend from "./Legend";

import useBackgroundLayer from "../hooks/UseBackgroundLayer";
import useMapLayers from "../hooks/UseMapLayers";
import useHighlightLayer from "../hooks/useHighlightLayer";
import useMeasurementLayer from "../hooks/useMeasurementLayer";
import useMeasurementTool from "../hooks/UseMeasurementTools";

import { createBaseLayer } from "../utils/baseLayerFactory";
import {
  registerEPSG28992,
  createPdokTileGrid28992,
  createEsriTileGrid3857,
} from "../utils/projectionsAndTileGrids";
import { toProjection } from "../utils/projections";
import { flattenDataLayers } from "./flattenDataLayers";
import { GiHamburgerMenu } from "react-icons/gi";

// ----------------------------
// Register projections
// ----------------------------
registerEPSG28992();
createPdokTileGrid28992();
createEsriTileGrid3857();
register(proj4);

// ----------------------------
// OLMap Component
// ----------------------------
export default function OLMap({
  activePanel,
  setActivePanel,
  activeBackgroundLayer,
  setActiveBackgroundLayer,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const backgroundLayerRef = useRef(null);
  const [currentProjectionCode, setCurrentProjectionCode] =
    useState("EPSG:3857");

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeLegendLayers, setActiveLegendLayers] = useState([]);

  // Highlight Layer
  const { highlightLayer, addFeatures, clearFeatures, highlightSource } =
    useHighlightLayer();

  // Measurement Layer
  const measureLayer = useMeasurementLayer();
  const { activeTool, handleSelectTool } = useMeasurementTool(
    mapInstance.current,
    measureLayer
  );

  // Data layers hook
  const {
    getWMSFeatureInfoUrlDebug,
    getFeaturesFromWMTS,
    dataLayers,
    flattenedLayers,
    activeStyles,
    setLayerActive,
    setLayerOpacity,
    addMapLayer,
    selectedFeatureId,
    setSelectedFeatureId,
    wmsWmtsLayersRef,
    setDataLayers,
  } = useMapLayers({
    projectionCode: currentProjectionCode,
    olProjection: getProjection(currentProjectionCode),
    highlightSource,
  });

  const dataLayersRef = useRef([]);
  useEffect(() => {
    dataLayersRef.current = dataLayers;
  }, [dataLayers]);

  // ----------------------------
  // Map creation function
  // ----------------------------
  const createMap = (
    projCode,
    centerLonLat,
    zoom = 15,
    backgroundId = "pdok_BRT"
  ) => {
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
      mapInstance.current = null;
    }

    const baseLayer = createBaseLayer(projCode, backgroundId);
    backgroundLayerRef.current = baseLayer;

    const center = toProjection(centerLonLat, projCode);

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, highlightLayer, measureLayer],
      view: new View({
        projection: getProjection(projCode),
        center,
        zoom,
      }),
      controls: [],
      renderer: "canvas",
      canvas: { willReadFrequently: true },
    });

    map.addControl(
      new ScaleLine({ units: "metric", bar: true, steps: 4, text: true })
    );
    map.addControl(new Attribution({ collapsible: true }));

    mapInstance.current = map;

    //v6 click handler
    // map.on("singleclick", async (evt) => {
    //   if (!mapInstance.current) return;

    //   const view = mapInstance.current.getView();
    //   const resolution = view.getResolution();
    //   const coordinate = evt.coordinate;

    //   let clickedFeature = null;
    //   let clickedLayerId = null;

    //   const INFO_FORMATS = [
    //     "application/json",
    //     "application/json; subtype=geojson",
    //     "application/vnd.ogc.gml/3.1.1",
    //     "application/vnd.ogc.gml",
    //     "text/xml; subtype=gml/3.1.1",
    //     "text/xml",
    //     "text/plain",
    //     "text/html",
    //   ];

    //   const getFeaturesFromWMS = async (layer) => {
    //     const source = wmsWmtsLayersRef.current[layer.id];
    //     if (!source) {
    //       console.log(`[WMS] No source found for layer: ${layer.id}`);
    //       return null;
    //     }

    //     for (const format of INFO_FORMATS) {
    //       try {
    //         const url = getWMSFeatureInfoUrlDebug(
    //           layer,
    //           coordinate,
    //           resolution,
    //           view.getProjection().getCode()
    //         );
    //         if (!url) continue;
    //         console.log("URL generated:", url);

    //         const res = await fetch(url);
    //         const text = await res.text();

    //         if (!text.trim()) continue;

    //         if (format.includes("json") && text.trim().startsWith("{")) {
    //           const json = JSON.parse(text);
    //           if (json?.features?.length > 0) {
    //             return new GeoJSON().readFeatures(json, {
    //               featureProjection: view.getProjection(),
    //             });
    //           }
    //         } else {
    //           const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
    //             text,
    //             {
    //               featureProjection: view.getProjection(),
    //             }
    //           );
    //           if (parsedFeatures?.length) return parsedFeatures;
    //         }
    //       } catch (err) {
    //         console.warn(
    //           `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
    //           err
    //         );
    //         continue;
    //       }
    //     }
    //     return null;
    //   };

    //   // Recursive function to walk children
    //   const findActiveFeature = async (layer) => {
    //     if (layer.active) {
    //       const features = await getFeaturesFromWMS(layer);
    //       if (features?.length) return { layer, features };
    //     }
    //     if (layer.children?.length) {
    //       for (const child of layer.children) {
    //         const result = await findActiveFeature(child);
    //         if (result) return result;
    //       }
    //     }
    //     return null;
    //   };

    //   for (const group of dataLayersRef.current) {
    //     console.log(`[Click] Checking group: ${group.id}`);
    //     for (const layer of group.children ?? []) {
    //       console.log(
    //         `[Click] Checking layer: ${layer.id}, active: ${layer.active}`
    //       );
    //       const result = await findActiveFeature(layer);
    //       if (result) {
    //         clickedFeature = result.features[0];
    //         clickedLayerId = result.layer.id;

    //         console.log(
    //           `[Click] Feature found on layer: ${clickedLayerId}, feature ID: ${clickedFeature.getId()}`
    //         );
    //         clearFeatures();
    //         addFeatures(result.features);
    //         setSelectedFeature(clickedFeature.getProperties());
    //         setSelectedFeatureId(clickedLayerId);
    //         setActivePanel("laagdata");
    //         break;
    //       }
    //     }
    //     if (clickedFeature) break;
    //   }

    //   if (!clickedFeature) {
    //     console.log("[Click] No feature found on click");
    //     clearFeatures();
    //     setSelectedFeature(null);
    //     setSelectedFeatureId(null);
    //   }
    // });

    //v7
    // map.on("singleclick", async (evt) => {
    //   if (!mapInstance.current) return;

    //   const view = mapInstance.current.getView();
    //   const resolution = view.getResolution();
    //   const coordinate = evt.coordinate;

    //   const allResults = []; // 👈 store multiple hits here

    //   const INFO_FORMATS = [
    //     "application/json",
    //     "application/json; subtype=geojson",
    //     "application/vnd.ogc.gml/3.1.1",
    //     "application/vnd.ogc.gml",
    //     "text/xml; subtype=gml/3.1.1",
    //     "text/xml",
    //     "text/plain",
    //     "text/html",
    //   ];

    //   const getFeaturesFromWMS = async (layer) => {
    //     const source = wmsWmtsLayersRef.current[layer.id];
    //     if (!source) return null;

    //     for (const format of INFO_FORMATS) {
    //       try {
    //         const url = getWMSFeatureInfoUrlDebug(
    //           layer,
    //           coordinate,
    //           resolution,
    //           view.getProjection().getCode()
    //         );
    //         if (!url) continue;

    //         const res = await fetch(url);
    //         const text = await res.text();
    //         if (!text.trim()) continue;

    //         if (format.includes("json") && text.trim().startsWith("{")) {
    //           const json = JSON.parse(text);
    //           if (json?.features?.length > 0) {
    //             return new GeoJSON().readFeatures(json, {
    //               featureProjection: view.getProjection(),
    //             });
    //           }
    //         } else {
    //           const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
    //             text,
    //             {
    //               featureProjection: view.getProjection(),
    //             }
    //           );
    //           if (parsedFeatures?.length) return parsedFeatures;
    //         }
    //       } catch (err) {
    //         console.warn(
    //           `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
    //           err
    //         );
    //         continue;
    //       }
    //     }
    //     return null;
    //   };

    //   const findActiveFeatures = async (layer) => {
    //     let collected = [];

    //     if (layer.active) {
    //       const features = await getFeaturesFromWMS(layer);
    //       if (features?.length) {
    //         collected.push({ layer, features });
    //       }
    //     }

    //     if (layer.children?.length) {
    //       for (const child of layer.children) {
    //         const childResults = await findActiveFeatures(child);
    //         if (childResults.length) collected.push(...childResults);
    //       }
    //     }

    //     return collected;
    //   };

    //   for (const group of dataLayersRef.current) {
    //     for (const layer of group.children ?? []) {
    //       const results = await findActiveFeatures(layer);
    //       if (results.length) {
    //         allResults.push(...results);
    //       }
    //     }
    //   }

    //   // 🧹 Update map highlights
    //   clearFeatures();
    //   const allFeatures = allResults.flatMap((r) => r.features);
    //   if (allFeatures.length) addFeatures(allFeatures);

    //   if (allResults.length) {
    //     // send all layer/feature pairs to panel
    //     setSelectedFeature(allResults);
    //     setActivePanel("laagdata");
    //   } else {
    //     console.log("[Click] No feature found on click");
    //     setSelectedFeature(null);
    //   }
    // });

    //v8
    // map.on("singleclick", async (evt) => {
    //   if (!mapInstance.current) return;

    //   const view = mapInstance.current.getView();
    //   const resolution = view.getResolution();
    //   const coordinate = evt.coordinate;

    //   const allResults = []; // store features per parent layer

    //   const INFO_FORMATS = [
    //     "application/json",
    //     "application/json; subtype=geojson",
    //     "application/vnd.ogc.gml/3.1.1",
    //     "application/vnd.ogc.gml",
    //     "text/xml; subtype=gml/3.1.1",
    //     "text/xml",
    //     "text/plain",
    //     "text/html",
    //   ];

    //   // ----------------------------------------
    //   // Fetch features for a given WMS layer
    //   // ----------------------------------------

    //   const getFeaturesFromWMS = async (layer) => {
    //     const source = wmsWmtsLayersRef.current[layer.id];
    //     if (!source) {
    //       console.warn(`[WMS] No source found for layer: ${layer.id}`);
    //       toast.warning(`Layer source not found: ${layer.id}`);
    //       return null;
    //     }

    //     for (const format of INFO_FORMATS) {
    //       try {
    //         const url = getWMSFeatureInfoUrlDebug(
    //           layer,
    //           coordinate,
    //           resolution,
    //           view.getProjection().getCode()
    //         );
    //         if (!url) continue;

    //         const res = await fetch(url);

    //         // If server responds with error (status >= 400)
    //         if (!res.ok) {
    //           toast.error(
    //             `[WMS] Server error fetching features for layer ${layer.id}: ${res.status} ${res.statusText}`
    //           );
    //           console.warn(
    //             `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
    //             res
    //           );
    //           return null; // exit early
    //         }

    //         const text = await res.text();
    //         if (!text.trim()) continue;

    //         if (format.includes("json") && text.trim().startsWith("{")) {
    //           const json = JSON.parse(text);
    //           if (json?.features?.length > 0) {
    //             return new GeoJSON().readFeatures(json, {
    //               featureProjection: view.getProjection(),
    //             });
    //           }
    //         } else {
    //           const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
    //             text,
    //             {
    //               featureProjection: view.getProjection(),
    //             }
    //           );
    //           if (parsedFeatures?.length) return parsedFeatures;
    //         }
    //       } catch (err) {
    //         console.warn(
    //           `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
    //           err
    //         );
    //         toast.error(`[WMS] Error fetching features for layer ${layer.id}`);
    //         continue;
    //       }
    //     }

    //     return null;
    //   };

    //   // ----------------------------------------
    //   // Loop only over top-level layers
    //   // ----------------------------------------
    //   for (const group of dataLayersRef.current) {
    //     console.log(`[Click] Checking group: ${group.id}`);

    //     // for (const parentLayer of group.children ?? []) {
    //     //   // Skip inactive parent layers
    //     //   if (!parentLayer.active) continue;

    //     //   console.log(`[Click] Checking parent layer: ${parentLayer.id}`);

    //     //   // 🔹 Only query the parent layer itself, not its children
    //     //   const features = await getFeaturesFromWMS(parentLayer);
    //     //   if (features?.length) {
    //     //     allResults.push({
    //     //       layer: parentLayer,
    //     //       features,
    //     //     });
    //     //     console.log(
    //     //       `[Click] Found ${features.length} feature(s) on parent layer: ${parentLayer.id}`
    //     //     );
    //     //   }
    //     // }
    //     for (const parentLayer of group.children ?? []) {
    //       // Skip inactive parent layers
    //       if (!parentLayer.active) continue;

    //       console.log(`[Click] Checking parent layer: ${parentLayer.id}`);

    //       let features = null;

    //       // 🔹 Branch by type
    //       if (parentLayer.type === "wms") {
    //         features = await getFeaturesFromWMS(parentLayer);
    //       } else if (parentLayer.type === "wmts") {
    //         features = await getFeaturesFromWMTS(parentLayer, evt); // you'll implement this
    //       }

    //       if (features?.length) {
    //         allResults.push({
    //           layer: parentLayer,
    //           features,
    //         });
    //         console.log(
    //           `[Click] Found ${features.length} feature(s) on parent layer: ${parentLayer.id}`
    //         );
    //       }
    //     }
    //   }

    //   // ----------------------------------------
    //   // Update map and panel
    //   // ----------------------------------------
    //   clearFeatures();

    //   const allFeatures = allResults.flatMap((r) => r.features);
    //   if (allFeatures.length) addFeatures(allFeatures);

    //   if (allResults.length) {
    //     setSelectedFeature(allResults);
    //     setActivePanel("laagdata");
    //   } else {
    //     console.log("[Click] No feature found on click");
    //     // toast.info("No feature found.");
    //     setSelectedFeature(null);
    //     setActivePanel(null);
    //   }
    // });

    //v9
    // map.on("singleclick", async (evt) => {
    //   if (!mapInstance.current) return;

    //   const view = mapInstance.current.getView();
    //   const resolution = view.getResolution();
    //   const coordinate = evt.coordinate;

    //   const allResults = []; // store multiple hits here

    //   const INFO_FORMATS = [
    //     "application/json",
    //     "application/json; subtype=geojson",
    //     "application/vnd.ogc.gml/3.1.1",
    //     "application/vnd.ogc.gml",
    //     "text/xml; subtype=gml/3.1.1",
    //     "text/xml",
    //     "text/plain",
    //     "text/html",
    //   ];

    //   // helper to get parent title if it exists
    //   const getDisplayTitle = (layer) => layer.parent?.title || layer.title;

    //   const getFeaturesFromWMS = async (layer) => {
    //     const source = wmsWmtsLayersRef.current[layer.id];
    //     if (!source) return null;

    //     for (const format of INFO_FORMATS) {
    //       try {
    //         const url = getWMSFeatureInfoUrlDebug(
    //           layer,
    //           coordinate,
    //           resolution,
    //           view.getProjection().getCode()
    //         );
    //         if (!url) continue;

    //         const res = await fetch(url);
    //         const text = await res.text();
    //         if (!text.trim()) continue;

    //         if (format.includes("json") && text.trim().startsWith("{")) {
    //           const json = JSON.parse(text);
    //           if (json?.features?.length > 0) {
    //             return new GeoJSON().readFeatures(json, {
    //               featureProjection: view.getProjection(),
    //             });
    //           }
    //         } else {
    //           const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
    //             text,
    //             {
    //               featureProjection: view.getProjection(),
    //             }
    //           );
    //           if (parsedFeatures?.length) return parsedFeatures;
    //         }
    //       } catch (err) {
    //         console.warn(
    //           `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
    //           err
    //         );
    //         continue;
    //       }
    //     }
    //     return null;
    //   };

    //   // recursive feature collection, passing parent layer
    //   const findActiveFeatures = async (layer, parent = null) => {
    //     // only use parent title for display
    //     const displayTitle = parent?.title || layer.title;

    //     // only fetch features if layer.active
    //     if (!layer.active) return [];

    //     const features = await getFeaturesFromWMS(layer);
    //     if (!features?.length) return [];

    //     // return **one object**: features + displayTitle
    //     return [{ layer, features, displayTitle }];
    //   };

    //   // iterate over all layer groups
    //   for (const group of dataLayersRef.current) {
    //     for (const layer of group.children ?? []) {
    //       const results = await findActiveFeatures(layer);
    //       if (results.length) allResults.push(...results);
    //     }
    //   }

    //   // 🧹 Update map highlights
    //   clearFeatures();
    //   const allFeatures = allResults.flatMap((r) => r.features);
    //   if (allFeatures.length) addFeatures(allFeatures);

    //   if (allResults.length) {
    //     // use displayTitle for UI panel
    //     setSelectedFeature(allResults);
    //     setActivePanel("laagdata");
    //   } else {
    //     console.log("[Click] No feature found on click");
    //     setSelectedFeature(null);
    //   }
    // });

    //v10
    mapInstance.current.on("singleclick", async (evt) => {
      const map = mapInstance.current;
      const view = map.getView();
      const projection = view.getProjection();
      const allResults = [];

      /**
       * 🔹 Helper: fetch features from WMS GetFeatureInfo
       */
      const getFeaturesFromWMS = async (layer, evt) => {
        const source = wmsWmtsLayersRef.current[layer.id];
        if (!source || !source.getFeatureInfoUrl) return null;

        const url = source.getFeatureInfoUrl(
          evt.coordinate,
          view.getResolution(),
          projection,
          { INFO_FORMAT: "application/json", FEATURE_COUNT: 10 }
        );
        if (!url) return null;

        try {
          const res = await fetch(url);
          const text = await res.text();
          if (!text.trim()) return null;

          if (text.trim().startsWith("{")) {
            const json = JSON.parse(text);
            if (json?.features?.length) {
              return new GeoJSON().readFeatures(json, {
                featureProjection: projection,
              });
            }
          }

          const parsed = new WMSGetFeatureInfo().readFeatures(text, {
            featureProjection: projection,
          });
          return parsed?.length ? parsed : null;
        } catch (err) {
          console.error(`[WMS] GetFeatureInfo failed for ${layer.id}`, err);
          return null;
        }
      };

      /**
       * 🔹 Helper: fetch features from WMTS GetFeatureInfo (KVP)
       */
      const getFeaturesFromWMTS = async (layer, evt) => {
        const source = wmsWmtsLayersRef.current[layer.id];
        if (!source) {
          console.warn(`[WMTS] No source found for layer: ${layer.id}`);
          return null;
        }

        try {
          const size = map.getSize();
          const extent = view.calculateExtent(size);
          const pixel = evt.pixel;

          // Must be a KVP-type WMTS
          const wmtsUrl = layer.url || source.urls?.[0];
          if (!wmtsUrl || !wmtsUrl.includes("?")) {
            console.warn(`[WMTS] No valid KVP URL for layer: ${layer.id}`);
            return null;
          }

          // Build GetFeatureInfo URL
          const infoUrl =
            `${
              wmtsUrl.split("?")[0]
            }?SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=1.0.0` +
            `&LAYER=${encodeURIComponent(layer.layerName || layer.id)}` +
            `&STYLE=${encodeURIComponent(layer.style || "default")}` +
            `&TILEMATRIXSET=${encodeURIComponent(
              layer.tileMatrixSet || "EPSG:28992"
            )}` +
            `&INFOFORMAT=${encodeURIComponent("application/json")}` +
            `&FEATURE_COUNT=10` +
            `&I=${Math.floor(pixel[0])}&J=${Math.floor(pixel[1])}` +
            `&WIDTH=${size[0]}&HEIGHT=${size[1]}` +
            `&CRS=${projection.getCode()}` +
            `&BBOX=${extent.join(",")}`;

          console.log("[WMTS] GetFeatureInfo URL:", infoUrl);

          const res = await fetch(infoUrl);
          if (!res.ok) {
            console.warn(`[WMTS] GetFeatureInfo failed for ${layer.id}`);
            return null;
          }

          const text = await res.text();
          if (!text.trim()) return null;

          // Try JSON first
          if (text.trim().startsWith("{")) {
            const json = JSON.parse(text);
            if (json?.features?.length) {
              return new GeoJSON().readFeatures(json, {
                featureProjection: projection,
              });
            }
          }

          // Fallback to GML/XML
          const parsed = new WMSGetFeatureInfo().readFeatures(text, {
            featureProjection: projection,
          });
          return parsed?.length ? parsed : null;
        } catch (err) {
          console.error(`[WMTS] Error fetching features for ${layer.id}`, err);
          return null;
        }
      };

      /**
       * 🔹 Iterate active layers (WMS & WMTS)
       */
      for (const group of dataLayersRef.current) {
        for (const layer of group.children ?? []) {
          if (!layer.active) continue;

          let features = null;
          const type = layer.type?.toLowerCase();

          if (type === "wms") {
            features = await getFeaturesFromWMS(layer, evt);
          } else if (type === "wmts") {
            features = await getFeaturesFromWMTS(layer, evt);
          }

          if (features?.length) {
            // 🔹 Filter fields for Bunschoten only
            const datasetKey = group.id || group.groupTitle; // identify dataset
            const datasetConfig = DATASET_CONFIG[datasetKey];

            if (datasetConfig?.allowedFields) {
              // features = features.map((f) => {
              //   const filtered = new Feature();
              //   datasetConfig.allowedFields.forEach((k) => {
              //     if (f.get(k) !== undefined) filtered.set(k, f.get(k));
              //   });
              //   filtered.setGeometry(f.getGeometry());
              //   return filtered;
              // });

              features = features.map((f) => {
                const filtered = new Feature();
                datasetConfig.allowedFields.forEach((k) => {
                  if (f.get(k) !== undefined) filtered.set(k, f.get(k));
                });
                // keep xlink_href
                const xlink =
                  f.get("plangebied.xlink_href") ||
                  f.get("plangebied")?.xlink_href;
                if (xlink) filtered.set("plangebied.xlink_href", xlink);

                filtered.setGeometry(f.getGeometry());
                return filtered;
              });
            }

            allResults.push({
              layer,
              features,
              originalFeatures: features, // keep original unfiltered
              displayTitle: layer.parent?.title || layer.title,
            });
          }
        }
      }

      /**
       * 🔹 Display or handle the results
       */

      clearFeatures();
      const allFeatures = allResults.flatMap((r) => r.features);
      if (allFeatures.length) addFeatures(allFeatures);

      if (allResults.length) {
        console.log("🟢 Feature info results:", allResults);
        setSelectedFeature(allResults);
        setActivePanel("laagdata");
      } else {
        console.log("[Click] No feature found on click");
        setSelectedFeature(null);
      }
    });

    /* debug */

    // const getWMSFeatureInfoUrlDebug = (
    //   layer,
    //   coordinate,
    //   resolution,
    //   projectionCode
    // ) => {
    //   const source = wmsWmtsLayersRef.current[layer.id];
    //   if (!source) {
    //     console.warn("[DEBUG] No WMS source for layer:", layer.id);
    //     return null;
    //   }

    //   const url = source.getFeatureInfoUrl(
    //     coordinate,
    //     resolution,
    //     projectionCode,
    //     {
    //       INFO_FORMAT: "application/json",
    //       QUERY_LAYERS: layer.wmsLayerName || layer.id,
    //       FEATURE_COUNT: 10,
    //     }
    //   );

    //   console.log("[DEBUG] getFeatureInfoUrl for layer:", layer.id, { url });
    //   return url;
    // };
  };

  /*
  // ----------------------------
  // Initialize map
  // ----------------------------
  */
  // useEffect(() => {
  //   const initialCenter = [5.1214, 52.0907]; // default NL center
  //   createMap(
  //     currentProjectionCode,
  //     initialCenter,
  //     10,
  //     activeBackgroundLayer || "openstreet"
  //   );
  // }, []);

  useEffect(() => {
    const bunschotenCenter = [5.375, 52.251]; // Bunschoten-Spakenburg center

    // create the map initially with BRT and NL EPSG
    createMap("EPSG:28992", bunschotenCenter, 15, "pdok_BRT");

    // sync state so the background hook doesn't override
    setActiveBackgroundLayer("pdok_BRT");
    setCurrentProjectionCode("EPSG:28992");
  }, []);

  // useEffect(() => {
  //   const vihigaCenter = [(34.708 + 34.7368) / 2, (0.0722392 + 0.102843) / 2];

  //   createMap(
  //     currentProjectionCode,
  //     vihigaCenter,
  //     18,
  //     activeBackgroundLayer || "openstreet"
  //   );
  // }, []);

  // const TEST_MODE = true; // set to false for production/NL

  // useEffect(() => {
  //   const center = TEST_MODE
  //     ? [(34.708 + 34.7368) / 2, (0.0722392 + 0.102843) / 2] // Vihiga
  //     : [5.1214, 52.0907]; // NL default

  //   const zoom = TEST_MODE ? 18 : 10;

  //   createMap(
  //     currentProjectionCode,
  //     center,
  //     zoom,
  //     activeBackgroundLayer || "openstreet"
  //   );
  // }, [currentProjectionCode, activeBackgroundLayer]);

  // ----------------------------
  // Background layer & projection switch
  // ----------------------------
  useBackgroundLayer({
    mapInstance,
    backgroundLayerRef,
    currentProjectionCode,
    setCurrentProjectionCode,
    activeBackgroundLayer,
    setActiveBackgroundLayer,
    createMap,
    wmsWmtsLayersRef, // <-- pass your data layers ref
    zoomThreshold: 10, // optional
  });
  // ----------------------------
  // Search handler
  // ----------------------------
  const handleSearchResult = (coordsLonLat) => {
    if (!mapInstance.current) return;
    const targetCoords = toProjection(coordsLonLat, currentProjectionCode);
    mapInstance.current
      .getView()
      .animate({ center: targetCoords, zoom: 14, duration: 1000 });
  };

  // ----------------------------
  // Legend setup
  // ----------------------------

  // useEffect(() => {
  //   if (!dataLayers || dataLayers.length === 0) {
  //     setActiveLegendLayers([]);
  //     return;
  //   }

  //   const flattened = flattenDataLayers(dataLayers);

  //   // ✅ Filter by layers that are active
  //   const activeLayers = flattened.filter((layer) => layer.active);
  //   activeLayers.forEach((layer) => {
  //     console.log(
  //       "[LegendEffect] Active layer:",
  //       layer.id,
  //       "→ legendUrl:",
  //       layer.legendUrl
  //     );
  //   });

  //   setActiveLegendLayers(activeLayers);
  // }, [dataLayers]); // only depend on dataLayers

  useEffect(() => {
    if (!dataLayers || dataLayers.length === 0) {
      setActiveLegendLayers([]);
      return;
    }

    const flattened = flattenDataLayers(dataLayers) || [];

    // Only keep active layers
    const activeLayers = flattened.filter((layer) => layer.active) || [];

    setActiveLegendLayers(activeLayers);
  }, [dataLayers]); // No need to depend on activeStyles anymore

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <MapContainer>
      <GlobalStyle />
      <MapStyleContainer ref={mapRef} />

      {/* Floating Map elements */}

      <FloatingSearch>
        <SearchBar onSearchResult={handleSearchResult} />
      </FloatingSearch>

      {/* hidden on tablet/laptop/desktop */}
      {/* sidenote: figure out how to let it open overlay-menu */}
      {/* <HamburgerMenu>
        <NavButton
          icon={<FiSidebar />}
          onClick={onOpenOverlay}
          aria-label="Open menu"
        />
      </HamburgerMenu> */}

      <ZoomControl mapRef={mapInstance} />

      <LaagData
        isOpen={activePanel === "laagdata"}
        setActivePanel={setActivePanel}
        selectedFeature={selectedFeature}
      />

      <Legend activeLayers={activeLegendLayers} />

      {/* menu panels */}
      <AchtergrondLaag
        isOpen={activePanel === "achtergrond"}
        setActivePanel={setActivePanel}
        activeBackgroundLayer={activeBackgroundLayer}
        setActiveBackgroundLayer={setActiveBackgroundLayer}
      />

      <DataLaagSelect
        isOpen={activePanel === "lagen"}
        setActivePanel={setActivePanel}
        dataLayers={dataLayers}
        setDataLayers={setDataLayers}
        setLayerActive={setLayerActive}
        mapRef={mapInstance}
        wmsWmtsLayersRef={wmsWmtsLayersRef}
        currentProjectionCode={currentProjectionCode}
      />

      <TransparantieLaagSelect
        isOpen={activePanel === "transparantie"}
        setActivePanel={setActivePanel}
        dataLayers={dataLayers}
        setLayerOpacity={setLayerOpacity}
      />

      <Measurement
        isOpen={activePanel === "metingen"}
        setActivePanel={setActivePanel}
        onSelectTool={handleSelectTool}
      />

      {/* <DataLabel dataLayers={dataLayers} />*/}
    </MapContainer>
  );
}
