// @ts-check

import Map from "esri/Map.js";
import Camera from "esri/Camera.js";
import FeatureLayer from "esri/layers/FeatureLayer.js";
import SceneLayer from "esri/layers/SceneLayer.js";
import SimpleRenderer from "esri/renderers/SimpleRenderer.js";
import SceneView from "esri/views/SceneView.js";
import Editor from "esri/widgets/Editor.js";

let view;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;
if (slideTitle === "visual-variables") {
  init();

  const doc = parent.document;
  doc.getElementById("visual-variables-1").onclick = addBoatLayer;
  doc.getElementById("visual-variables-2").onclick = addHeliLayer;
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

function addBoatLayer() {
  const boatLayer = createFL(
    false,
    "Boat layer",
    { mode: "on-the-ground", offset: 0.5, unit: "meters" },
    {
      type: "web-style",
      name: "Sailboat",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriRealisticTransportationStyle",
    }
  );

  boatLayer.renderer.symbol.fetchSymbol().then(function (actualSymbol) {
    boatLayer.renderer.symbol = actualSymbol;
  });

  view.map.layers.add(boatLayer);

  const widget = new Editor({ view: view });
  view.ui.add(widget, "top-right");
}

function addHeliLayer() {
  const heliLayer = createFL(
    true,
    "Helicopter layer",
    { mode: "relative-to-ground", offset: 2, unit: "meters" },
    {
      type: "web-style",
      name: "Eurocopter_AS-365_-_Flying",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriRealisticTransportationStyle",
    }
  );

  heliLayer.renderer.symbol.fetchSymbol().then(function (actualSymbol) {
    heliLayer.renderer.symbol = actualSymbol;
  });

  view.map.layers.add(heliLayer);
}

function createFL(hasZ, title, elevationInfo, symbol) {
  return new FeatureLayer({
    source: [],
    renderer: new SimpleRenderer({
      symbol: symbol,
      visualVariables: [
        {
          type: "size",
          axis: "height",
          field: "size",
          valueUnit: "meters",
        },
        {
          type: "rotation",
          field: "heading",
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
      { name: "size", alias: "Size [m]", type: "integer" },
      { name: "heading", alias: "Rotation [deg]", type: "integer" },
    ],
    title: title,
    elevationInfo: elevationInfo,
    hasZ: hasZ,
  });
}
