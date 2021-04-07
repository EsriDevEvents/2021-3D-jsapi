// @ts-check

import Map from "esri/Map.js";
import Camera from "esri/Camera.js";
import FeatureLayer from "esri/layers/FeatureLayer.js";
import IntegratedMeshLayer from "esri/layers/IntegratedMeshLayer.js";
import SimpleRenderer from "esri/renderers/SimpleRenderer.js";
import SceneView from "esri/views/SceneView.js";
import Editor from "esri/widgets/Editor.js";

let view, waterLayer;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;
if (slideTitle === "water-surface") {
  init();

  const doc = parent.document;
  doc.getElementById("water-surface-1").onclick = addWaterLayer;
  doc.getElementById("water-surface-2").onclick = addRealisticWater;
}

function init() {
  view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    popup: {
      autoOpenEnabled: false, //disable popups
    },
    camera: new Camera({
      position: [2.82087251, 41.98008906, 182.06604],
      heading: 29.45,
      tilt: 73.73,
    }),
    map: new Map({
      layers: [
        new IntegratedMeshLayer({
          portalItem: {
            id: "5e36053103e143bcb2a9e1276b515c21",
            portal: { url: "https://zrhdata.mapsqa.arcgis.com/" },
          },
        }),
      ],
    }),
  });
  // Enable displaying shadows cast by the sun
  view.environment.lighting.directShadowsEnabled = true;
}

function addWaterLayer() {
  waterLayer = new FeatureLayer({
    source: [],
    renderer: {
      type: "simple",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [{ type: "water" }],
      },
    },
    objectIdField: "ObjectID",
    outFields: ["*"],
    geometryType: "polygon",
    spatialReference: {
      wkid: 4326,
    },
    fields: [{ name: "ObjectID", type: "oid" }],
    elevationInfo: { mode: "on-the-ground" },
    title: "Water layer",
  });
  view.map.layers.add(waterLayer);

  const widget = new Editor({ view: view });
  view.ui.add(widget, "top-right");
}

function addRealisticWater() {
  waterLayer.renderer = new SimpleRenderer({
    symbol: {
      type: "polygon-3d",
      symbolLayers: [
        {
          type: "water",
          waveDirection: 0,
          color: "#978152",
          waveStrength: "slight",
          waterbodySize: "small",
        },
      ],
    },
  });

  view.environment.lighting.waterReflectionEnabled = true;
}
