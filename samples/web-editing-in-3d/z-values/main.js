// @ts-check

import Map from "esri/Map.js";
import Camera from "esri/Camera.js";
import FeatureLayer from "esri/layers/FeatureLayer.js";
import SceneLayer from "esri/layers/SceneLayer.js";
import SimpleRenderer from "esri/renderers/SimpleRenderer.js";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol.js";
import SceneView from "esri/views/SceneView.js";
import Editor from "esri/widgets/Editor.js";

let view;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;
if (slideTitle === "z-values") {
  init();

  const doc = parent.document;
  doc.getElementById("z-values-1").onclick = addLayer;
}

function init() {
  view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    popup: {
      autoOpenEnabled: false, //disable popups
    },
    camera: new Camera({
      position: [8.54423482, 47.36471638, 439.3211],
      heading: 13.03,
      tilt: 86.74,
    }),
    map: new Map({
      basemap: "topo",
      ground: "world-elevation",
      layers: [
        new SceneLayer({
          portalItem: {
            id: "a5e7c7c6b98b43d9b09bbba5b3c79efc",
            portal: { url: "https://zrhdata.mapsqa.arcgis.com/" },
          },
        }),
      ],
    }),
  });
}

function addLayer() {
  const onTheGroundLayer = createFL(
    "Boat layer",
    { mode: "on-the-ground", offset: 0.5, unit: "meters" },
    new SimpleMarkerSymbol({ size: 16, color: "red" })
  );
  const absHeightLayer = createFL(
    "Helicopter layer",
    { mode: "absolute-height" },
    new SimpleMarkerSymbol({ size: 16, color: "red" }),
    true
  );

  view.map.layers.add(absHeightLayer);
  view.map.layers.add(onTheGroundLayer);

  const widget = new Editor({ view: view });
  view.ui.add(widget, "top-right");
}

function createFL(title, elevationInfo, symbol, hasZ = false) {
  return new FeatureLayer({
    elevationInfo: elevationInfo,
    hasZ: hasZ,
    renderer: new SimpleRenderer({
      symbol: symbol,
    }),
    title: title,
    source: [],
    objectIdField: "ObjectID",
    outFields: ["*"],
    geometryType: "point",
    spatialReference: {
      wkid: 4326,
    },
    fields: [{ name: "ObjectID", type: "oid" }],
  });
}
