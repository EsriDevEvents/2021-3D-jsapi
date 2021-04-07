// @ts-check

import { NAPERVILLE } from "../scenes.js";

import WebMap from "esri/WebMap.js";
import SceneView from "esri/views/SceneView.js";
import Editor from "esri/widgets/Editor.js";

let view, widget;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;

if (slideTitle === "editor-widget-3d") {
  init();

  const doc = parent.document;
  doc.getElementById("editor-widget-3d-2").onclick = addWidget;
}

function init() {
  view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    popup: {
      autoOpenEnabled: false, //disable popups
    },

    map: new WebMap({ portalItem: { id: NAPERVILLE } }),
  });
}

function addWidget() {
  widget = new Editor({ view: view });
  view.ui.add(widget, "top-right");
}
