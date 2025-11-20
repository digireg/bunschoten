# Project Dependencies

## Menu

- **Components**
  - MenuContainer.jsx
  - OverlayMenu.jsx
  - SideBarMenu.jsx
- **Hooks / Utils**
  - -
- **Config**
  - -
- **Props**
  - MenuContainer({activePanel, setActivePanel})
  - OverlayMenu({isOpen, onClose, onOpenOverlay, activePanel, setActivePanel})
  - SideBarMenu({onOpenOverlay, activePanel, setActivePanel})

## Main Parent

- **Component**
  - Map.jsx
- **Child Components**
  - AchtergrondLaagContainer
  - TransparantieLaagContainer
  - DataLaagSelectContainer
  - LaagData
  - MeasurementContainer
  - DataLabelContainer (not in use)
  - ZoomControl
  - Searchbar
  - Legend
- **Hooks / Utils**
  - baseLayerFactory
  - projectionsAndTileGrids (registerEPSG28992, createPdokTileGrid28992, createEsriTileGrid3857)
  - projections
  - useOLMap (init map)
  - useBackgroundLayer
  - useMapLayers
  - useHighlightLayer
  - useMeasurementLayer
  - useMeasurementTool
  - flattenDataLayers
  - addMapLayer
  - fetchLayerBBoxes (addMapLayer uses it)
- **Props**
  - OLMap({ activePanel, setActivePanel, activeBackgroundLayer, setActiveBackgroundLayer})

## Background Layers / Base Layers

- **Components**
  - AchtergrondLaagContainer.jsx
- **Hooks / Utils**
  - useOLMap (init background layers / background layer switching)
  - useBackgroundLayer
  - baseLayerFactory
  - geoHelpers (used by useBackgroundLayer)
- **Config**
  - backgroundLayersConfig
- **Props**
  - AchtergrondLaagContainer({isOpen, setActivePanel, setActiveBackgroundLayer, activeBackgroundLayer})
  - useBackgroundLayer({mapInstance, backgroundLayerRef, currentProjectionCode, setCurrentProjectionCode, activeBackgroundLayer, setActiveBackgroundLayer, createMap, zoomThreshold = 12})
  - createBaseLayer(projectionCode, backgroundId)

## Data Layers Setup

- **Components**
  - DataLaagSelectContainer.jsx
  - DataLayerCreate.jsx
  - RenderLayerStyle.jsx
  - flattenDataLayers
- **Hooks / Utils**
  - addMapLayer
  - useOLMap (init data layers, click handling for feature info, attach map click listener, layer toggling)
  - useMapLayers (recursively register WMS sources, inherit parent URL if missing, toggle layer active)
  - useDataLayerFetch.jsx (uses DataLayerCreate.jsx)
  - handleLayerActive (activates/deactivates a layer)
  - zoomToLayer
  - wmsUtils
  - parseWMTSCapabilities
- **Config**
  - datasetConfig
- **Props**
  - DataLaagSelect({isOpen, setActivePanel, dataLayers, setDataLayers, setLayerActive, mapRef, wmsWmtsLayersRef, currentProjectionCode})
  - DataLayerCreate(wmsUrl, datasetName = "WMS Layer", type = "wms")
  - renderLayer(layer, groupId, level = 0, parentActive = true, onToggleLayer, loadingLayers, parentId = null, activeStyles = {})
  - handleLayerActive({ parent, mapInstance, groupId, inputType = "checkbox", wmsWmtsLayersRef, projectionCode, highlightSource})

## Display Data

- **Components**
  - LaagData.jsx
  - Map.jsx (click handler for features)
  - useMapLayers (click handler debug helper / selected layer highlighter)
  - useHighlightLayer.js
- **Hooks / Utils**
  - -
- **Config**
  - datasetConfig
- **Props**
  - LaagData({selectedFeature, isOpen, setActivePanel})
  - getWMSFeatureInfoUrlDebug(layer, coordinate, resolution, projectionCode)

## Legend

- **Components**
  - Legend.jsx
- **Hooks / Utils**
  - legendHelpers.jsx
  - wmsUtils.jsx
  - useOLMap (Legend useState)
- **Config**
  - -
- **Props**
  - Legend({ activeLayers = [] })

## Measurement

- **Components**
  - MeasurementContainer.jsx
- **Hooks / Utils**
  - useMeasurement.jsx
  - useMeasurementLayer.jsx
  - useMeasurementTools.jsx
  - useOLMap (measurement controls placeholder)
- **Config**
  - -
- **Props**
  - Measurement({ isOpen, setActivePanel, onSelectTool })

## Opacity

- **Components**
  - TransparantieLaagContainer.jsx
- **Hooks / Utils**
  - updateLayerOpacity.jsx
  - useOLMap (opacity update)
- **Config**
  - -
- **Props**
  - TransparantieLaagSelect({isOpen, setActivePanel, dataLayers, setLayerOpacity})

## Zoom Control

- **Components**
  - ZoomControl.jsx
- **Hooks / Utils**
  - useOLMap (search / zoom handling)
- **Config**
  - -
- **Props**
  - ZoomControl({ mapRef })

## Searchbar

- **Components**
  - FloatingSearch.jsx
  - Searchbar.jsx
- **Hooks / Utils**
  - useOLMap (search / zoom handling)
- **Props**
  - -




# Project Dependencies Table

| Component                      | Hooks / Utils                                                                                                                                                                                                    | Config                 | Props                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| MenuContainer.jsx              | -                                                                                                                                                                                                                | -                      | {activePanel, setActivePanel}                                                                                                   |
| OverlayMenu.jsx                | -                                                                                                                                                                                                                | -                      | {isOpen, onClose, onOpenOverlay, activePanel, setActivePanel}                                                                   |
| SideBarMenu.jsx                | -                                                                                                                                                                                                                | -                      | {onOpenOverlay, activePanel, setActivePanel}                                                                                    |
| Map.jsx                        | baseLayerFactory, projectionsAndTileGrids, projections, useOLMap, useBackgroundLayer, useMapLayers, useHighlightLayer, useMeasurementLayer, useMeasurementTool, flattenDataLayers, addMapLayer, fetchLayerBBoxes | -                      | OLMap({activePanel, setActivePanel, activeBackgroundLayer, setActiveBackgroundLayer})                                           |
| AchtergrondLaagContainer.jsx   | useOLMap, useBackgroundLayer, baseLayerFactory, geoHelpers                                                                                                                                                       | backgroundLayersConfig | {isOpen, setActivePanel, setActiveBackgroundLayer, activeBackgroundLayer}                                                       |
| TransparantieLaagContainer.jsx | updateLayerOpacity, useOLMap                                                                                                                                                                                     | -                      | {isOpen, setActivePanel, dataLayers, setLayerOpacity}                                                                           |
| DataLaagSelectContainer.jsx    | useOLMap, useMapLayers, useDataLayerFetch, handleLayerActive, zoomToLayer, wmsUtils, flattenDataLayers                                                                                                           | datasetConfig          | {isOpen, setActivePanel, dataLayers, setDataLayers, setLayerActive, mapRef, wmsWmtsLayersRef, currentProjectionCode}            |
| DataLayerCreate.jsx            | -                                                                                                                                                                                                                | -                      | {wmsUrl, datasetName = "WMS Layer", type = "wms"}                                                                               |
| DataLayerCreateWMTS.jsx        | -                                                                                                                                                                                                                | -                      | (not in use yet)                                                                                                                |
| RenderLayerStyle.jsx           | -                                                                                                                                                                                                                | -                      | {renderLayer(layer, groupId, level = 0, parentActive = true, onToggleLayer, loadingLayers, parentId = null, activeStyles = {})} |
| LaagData.jsx                   | useMapLayers, useHighlightLayer                                                                                                                                                                                  | datasetConfig          | {selectedFeature, isOpen, setActivePanel}                                                                                       |
| Legend.jsx                     | legendHelpers, wmsUtils, useOLMap                                                                                                                                                                                | -                      | {activeLayers = []}                                                                                                             |
| MeasurementContainer.jsx       | useMeasurement, useMeasurementLayer, useMeasurementTools, useOLMap                                                                                                                                               | -                      | {isOpen, setActivePanel, onSelectTool}                                                                                          |
| ZoomControl.jsx                | useOLMap                                                                                                                                                                                                         | -                      | {mapRef}                                                                                                                        |
| FloatingSearch.jsx             | useOLMap                                                                                                                                                                                                         | -                      | -                                                                                                                               |
| Searchbar.jsx                  | useOLMap                                                                                                                                                                                                         | -                      | -                                                                                                                               |
| DataLabelContainer.jsx         | -                                                                                                                                                                                                                | -                      | (not in use)                                                                                                                    |

---

### Note on Unused Modules
- useMapInstance.js  
- olHelper.jsx  
- registerWMSSource.jsx




