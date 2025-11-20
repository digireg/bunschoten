Structure:

src/
 ├─assests/
 │   ├─ Digireg-seeklogo.png
 ├─ components/
 │   ├─ AchtergrondLaagContainer.jsx
 │   ├─ DataLaagSelectContainer.jsx
 │   ├─ DataLabelContainer.jsx //nog niet in gebruik
 │   ├─ DataLayerCreate.jsx
 │   ├─ DataLayerCreateWMTS.jsx //nog niet in geburik
 │   ├─ flattenDataLayers.jsx
 │   ├─ LaagData.jsx
 │   ├─ Legend.jsx
 │   ├─ Map.jsx
 │   ├─ MeasurementContainer.jsx
 │   ├─ MenuContainer.jsx
 │   ├─ OverlayMenu.jsx
 │   ├─ Searchbar.jsx
 │   ├─ SideBarMenu.jsx
 │   ├─ TransparantieLaagContainer.jsx
 │   └─ ZoomControl.jsx
 ├─ config/
 │   ├─ backgroundLayersConfig.js
 │   └─ datasetconfig.js
 ├─ hooks/
 │   ├─ useBackgroundLayer.js
 │   ├─ useDataLayerFetch.js
 │   ├─ useHighlightLayer.js
 │   ├─ useMapInstance.js
 │   ├─ useMapLayers.js
 │   ├─ useMeasurement.js
 │   ├─ useMeasurementLayer.js
 │   ├─ useMeasurementTools.js
 │   ├─ useNormalizeLayers.js
 │   └─ useOLMap.js
 ├─ style_components/
 │   ├─ atoms/
 │   │   ├─ BottomSpacer.jsx
 │   │   ├─ Button.jsx
 │   │   ├─ ButtonVariants.jsx
 │   │   ├─ CloseButton.jsx
 │   │   ├─ Container.jsx
 │   │   ├─ Content.jsx
 │   │   ├─ Data.jsx
 │   │   ├─ Drawer.jsx
 │   │   ├─ FieldRow.jsx
 │   │   ├─ Header.jsx
 │   │   ├─ Label.jsx
 │   │   ├─ MapContainers.jsx
 │   │   ├─ NoResults.jsx
 │   │   ├─ Overlay.jsx
 │   │   ├─ Panel.jsx
 │   │   ├─ PanelHeader.jsx
 │   │   ├─ PanelTitle.jsx
 │   │   ├─ PreviewTile.jsx
 │   │   ├─ SideBarIconContainer.jsx
 │   │   ├─ SideBarMenuInconContainer.jsx
 │   │   ├─ Slider.jsx
 │   │   ├─ Spinner.jsx
 │   │   ├─ Switch.jsx
 │   │   ├─ SwitchGroup.jsx                                                                                                                                                                       x
 │   │   ├─ TextInput.jsx
 │   │   ├─ Tilethumbnail.jsx
 │   │   ├─ TitleGroup.jsx
 │   │   ├─ TopRow.jsx  
 │   │   └─ index.js // niet in gebruik 
 │   ├─ molecules/
 │   │   ├─ Accordion.jsx 
 │   │   ├─ CustomAccordion.jsx
 │   │   ├─ MapButton.jsx
 │   │   ├─ NavButton.jsx
 │   │   ├─ OverlayMenuHeader.jsx
 │   │   ├─ OverlayMenuMolecules.jsx                                                                                                                                                                       x
 │   │   ├─ OverlayMenuSection.jsx
 │   │   ├─ PreviewGrid.jsx
 │   │   ├─ SideMenu.jsx
 │   │   └─ index.js // niet in gebruik
 │   ├─ organisms/
 │   │   ├─ FloatingSearch.jsx 
 │   │   ├─ PanelContainers.jsx
 │   │   ├─ Panels.jsx
 │   │   └─ RenderLayerStyle.js 
 │   ├─ themes/
 │   │   ├─ base.jsx 
 │   │   └─ light.js
 │   ├─ GlobalStyle.jsx
 │   ├─ index.jsx  // Style Hub
 │   ├─ Theme.jsx
 ├─ utils/
 │   ├─ addMapLayer.jsx
 │   ├─ baseLayerFactory.jsx
 │   ├─ createWMTSLayer.jsx //nog niet in gebruik
 │   ├─ fetchLayerBBoxes.jsx
 │   ├─ geoHelpers.jsx
 │   ├─ handleLayerActive.jsx
 │   ├─ legendHelpers.jsx
 │   ├─ olHelper.jsx
 │   ├─ projections.jsx
 │   ├─ projectionsAndTileGrids.jsx
 │   ├─ registerWMSSource.jsx
 │   ├─ updateLayerOpacity.jsx
 │   ├─ wmsUtils.jsx
 │   └─ zoomToLayer.js
 ├─ App.css
 ├─ App.jsx
 ├─ index.css
 └─ main.jsx
index.html

Dependencies

Menu
- Components:
-- MenuContainer.jsx 
-- OverlayMenu.jsx
-- SideBarMenu.jsx
- Hooks/ Utils:
-- -
- Config:
-- -
- Props:
-- MenuContainer({activePanel, setActivePanel })
-- OverlayMenu({isOpen, onClose, onOpenOverlay, activePanel, setActivePanel})
--SideBarMenu({onOpenOverlay, activePanel, setActivePanel})

Main parent
- Component:
-- Map.jsx
- Child components:
-- AchtergrondLaagContainer
-- TransparantieLaagContainer
-- DataLaagSelectContainer
-- LaagData
-- MeasurementContainer
-- DataLabelContainer (not in use)
-- ZoomControl
-- Searchbar
-- Legend
- Hooks/ Utils:
-- baseLayerFactory 
-- projectionsAndTileGrids (  registerEPSG28992, createPdokTileGrid28992, createEsriTileGrid3857)
-- projections
-- useOLMap (init map)
-- useBackgroundLayer
-- useMapLayers
-- useHighlightLayer
-- useMeasurementLayer
-- useMeasurementTool
-- flattenDataLayers
-- addMapLayer
--  fetchLayerBBoxes (addMapLayer uses it)
-Props:
-- OLMap({ activePanel, setActivePanel, activeBackgroundLayer, setActiveBackgroundLayer})


Background Layers/ Base Layers
- Components: 
-- AchtergrondLaagContainer.jsx (UI component to display background layer grid)
- Hooks/ Utils:
-- useOLMap (init background layers/ Background layer switching)
-- useBackgroundLayer
-- baseLayerFactory
-- geoHelpers (useBackgroundLayer uses it)
- Config: backgroundLayersConfig
- Props: 
-- AchtergrondLaagContainer({isOpen, setActivePanel, setActiveBackgroundLayer, activeBackgroundLayer})
-- useBackgroundLayer({mapInstance, backgroundLayerRef, currentProjectionCode, setCurrentProjectionCode, activeBackgroundLayer, setActiveBackgroundLayer, createMap, zoomThreshold = 12})
-- createBaseLayer(projectionCode, backgroundId)

Data layers set up
- Components: 
-- DataLaagSelectContainer.jsx (UI component to display data layer)
-- DataLayerCreate.jsx
-- DataLayerCreateWMTS (not in use yet)
-- RenderLayerStyle.jsx (organism that populates the data layer checkboxes & radio buttons in the UI)
-- flattenDataLayers
- Hooks/ Utils:
-- useOLMap (init data layers/ Click handling for feature info & Attach map click listener/  Layer toggling)
-- useMapLayers (Recursively register WMS sources and inherit parent URL if missing & Toggle layer active)
-- useDataLayerFetch.jsx uses DataLayerCreate.jsx
-- handleLayerActive (Activates/deactivates a layer (checkbox or radio))
-- zoomToLayer (zoom to selected data via bbox)
-- wmsUtils
-config: datasetConfig 
- props:
-- DataLaagSelect({isOpen, setActivePanel,dataLayers, setDataLayers, setLayerActive, mapRef, wmsWmtsLayersRef, currentProjectionCode})
-- DataLayerCreate( wmsUrl, datasetName = "WMS Layer", type = "wms")
-- renderLayer(layer, groupId, level = 0, parentActive = true, onToggleLayer, loadingLayers, parentId = null, activeStyles = {})
-- handleLayerActive({ parent, mapInstance, groupId, inputType = "checkbox", wmsWmtsLayersRef, projectionCode, highlightSource})
 
Display Data 
- Components: 
-- LaagData.jsx (UI component that displays the data)
-- Map.jsx (Click Handler clicks features on the map to display in the UI)
-- useMapLayers (Click handler debug helper/ selected layer highlighter)
-- useHighlightLayer.js (highlight selected feature)
- Hooks/ Utils: 
-config: datasetConfig 
- props:
-- LaagData({selectedFeature // array of { layer, features }, isOpen, setActivePanel})
-- getWMSFeatureInfoUrlDebug (layer, coordinate, resolution, projectionCode) //in UseMapLayers

Legend:
- Components:
-- Legend.jsx (UI component to show legend)
- Hooks/Utils:
-- legendHelpers.jsx
-- wmsUtils.jsx
 -- useOLMap (Legend useState)
- Config:
-- -
- Props:
-- Legend({ activeLayers = [] })


Measurement:
- Components:
-- MeasurementContainer.jsx
- Hooks/Utils:
-- useMeasurement.jsx
-- useMeasurementLayer.jsx
-- useMeasurementTools.jsx
-- useOLMap ( Measurement controls placeholder)
- Config:
-- -
- Props:
-- Measurement({ isOpen, setActivePanel, onSelectTool })


Opacity:
- Components:
-- TransparantieLaagContainer.jsx
- Hooks/Utils:
-- updateLayerOpacity.jsx
-- useOLMap ( Opacity update)
- Config:
-- -
- Props:
-- TransparantieLaagSelect({isOpen, setActivePanel, dataLayers, setLayerOpacity})


 Zoom Control
- Components:
-- ZoomControl.jsx (zoom in/out !!Not zoom to location!!)
- Hooks/Utils:
-- useOLMap (Search / Zoom handling)
- Config:
-- -
- Props:
-- ZoomControl({ mapRef })

 
Searchbar:
- Components: 
-- FloatingSearch.jsx // style
-- Searchbar.jsx // logic & UI
- Hooks/ Utils:
-- -- useOLMap (Search / Zoom handling)

- Props: 

 

OverlayMenuHeader & OverlayMenuSection are styled components
olHelper not being used/ to be deleted
useMapInstance not being used/ to be deleted
registerWMSSource not being used/ to be deleted

 
 To-do in the future:

 OLMap Click & Measurement Issue (for later revisit)

Problem:

Click handler for querying WMS features (singleclick) doesn’t reactivate after turning off the measurement tool (isMeasureActive).
Previous attempts to guard the click handler with if (isMeasureActive || !isQueryActive) return; blocked clicks permanently after using the measurement tool.
useEffect logic for setting isQueryActive based on active layers and isMeasureActive didn’t fully restore query mode reliably.

Current Workaround:

Reverted to old version where the click handler always listens and respects active layers, without trying to auto-toggle isQueryActive.
Legend updates for active layers still work.

Potential Fix Ideas (future):
Ensure isQueryActive is recalculated immediately after measurement tool is deactivated.
Consider separating “click listening” from isQueryActive state — the handler could always run but ignore clicks only if isMeasureActive, not based on query state.
Use a useEffect or callback to reactivate query mode whenever measurement mode switches off, without overwriting other state updates.