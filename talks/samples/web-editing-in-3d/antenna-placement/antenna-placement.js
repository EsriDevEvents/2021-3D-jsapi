// @ts-check

import Map from "esri/Map.js";
import Camera from "esri/Camera.js";
import FeatureLayer from "esri/layers/FeatureLayer.js";
import SceneLayer from "esri/layers/SceneLayer.js";
import SimpleRenderer from "esri/renderers/SimpleRenderer.js";
import WebStyleSymbol from "esri/symbols/WebStyleSymbol.js";
import SceneView from "esri/views/SceneView.js";
import Editor from "esri/widgets/Editor.js";

const features = new FeatureLayer({
  source: [],
  renderer: new SimpleRenderer({
    symbol: new WebStyleSymbol({
      name: "Radio_Antenna",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriInfrastructureStyle",
    }),
    visualVariables: [
      {
        type: "size",
        axis: "height",
        field: "size",
        valueUnit: "feet",
      },
      {
        type: "rotation",
        field: "rotation",
        rotationType: "geographic",
      },
    ],
  }),
  objectIdField: "ObjectID",
  outFields: ["*"],
  geometryType: "point",
  spatialReference: {
    wkid: 4326,
  },
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "size", alias: "Size [ft]", type: "integer" },
    { name: "rotation", alias: "Rotation [deg]", type: "integer" },
  ],
  title: "Relative to scene",
  elevationInfo: { mode: "relative-to-scene", offset: 0 },
  hasZ: false,
});

features.renderer.symbol.fetchSymbol().then(function (actualSymbol) {
  features.renderer.symbol = actualSymbol;
});

const scene = new SceneLayer({
  portalItem: {
    id: "b991bb77dfd04bfb83748c12db961f56",
    portal: { url: "https://zurich.maps.arcgis.com/" },
  },
  renderer: new SimpleRenderer({
    symbol: {
      type: "mesh-3d",
      symbolLayers: [
        {
          type: "fill",
          material: {
            color: "#ffffff",
            colorMixMode: "replace",
          },
          edges: {
            type: "sketch",
            color: [0, 0, 0, 0.6],
            size: 0.5,
          },
        },
      ],
    },
  }),
});

const view = new SceneView({
  container: "viewDiv",
  qualityProfile: "high",
  popup: {
    autoOpenEnabled: false, //disable popups
  },
  camera: new Camera({
    position: [-123.12686013, 49.27051623, 122.83995],
    heading: 36.94,
    tilt: 85.72,
  }),
  map: new Map({
    basemap: "topo",
    ground: "world-elevation",
    layers: [scene, features],
  }),
});

view.when(() => {
  const widget = new Editor({ view: view });
  view.ui.add(widget, "top-right");
});
