// @ts-check

import WebScene from "esri/WebScene.js";
import SceneView from "esri/views/SceneView.js";
import DirectLineMeasurement3D from "esri/widgets/DirectLineMeasurement3D.js";
import { ESRI_OFFICE_BSL } from "../scenes.js";

let view, widget;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;

if (slideTitle === "direct-line-measurement") {
  initScene();

  const doc = parent.document;
  doc.getElementById("direct-line-measurement-1").onclick = addWidget;
  doc.getElementById("direct-line-measurement-2").onclick = setUnits;
}

/**
 * Initializes the scene.
 */
function initScene() {
  view = new SceneView({
    map: new WebScene({ portalItem: { id: ESRI_OFFICE_BSL } }),
    container: "viewDiv",
    qualityProfile: "high",
  });

  view.popup.defaultPopupTemplateEnabled = false;
}

/**
 * Creates a new DirectLineMeasurement3D widget and adds it to the view.
 */
function addWidget() {
  widget = new DirectLineMeasurement3D({ view: view });
  view.ui.add(widget, "top-right");
}

/**
 * Set "proper" units on the widget =P
 */
function setUnits() {
  // Measure in kilometers.
  widget.viewModel.unit = "kilometers";
  // Only allow selecting certain units.
  widget.viewModel.unitOptions = ["meters", "kilometers"];
}
