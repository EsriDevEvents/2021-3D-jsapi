// @ts-check

import WebScene from "esri/WebScene.js";
import SceneView from "esri/views/SceneView.js";
import Slice from "esri/widgets/Slice.js";
import SlicePlane from "esri/widgets/Slice/SlicePlane.js";
import { ESRI_OFFICE_BSL } from "../scenes.js";

let view, widget, scene;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;

if (slideTitle === "slice") {
  initScene();

  parent.document.getElementById("slice-1").onclick = addWidget;
  parent.document.getElementById("slice-2").onclick = setSlicePlane;
} else if (slideTitle === "slice-with-slides") {
  initScene();
  addWidget();

  parent.document.getElementById("slice-with-slides-1").onclick = addButtons;
}

function initScene() {
  scene = new WebScene({ portalItem: { id: ESRI_OFFICE_BSL } });

  view = new SceneView({
    map: scene,
    container: "viewDiv",
    qualityProfile: "high",
  });

  view.popup.defaultPopupTemplateEnabled = false;
}

/**
 * Creates a Slice widget and adds it to the view.
 */
function addWidget() {
  widget = new Slice({ view });
  view.ui.add(widget, "top-right");
}

/**
 * Sets a single slice plane in the widget.
 */
function setSlicePlane() {
  widget.viewModel.shape = new SlicePlane({
    position: {
      spatialReference: { wkid: 4326 },
      x: -117.18678980519542,
      y: 34.05998560966533,
      z: 413.94244076963514,
    },
    heading: 180.46565254458895,
    tilt: 269.9999987925818,
    width: 49.04635028105781,
    height: 33.2090051697465,
  });

  widget.viewModel.start();
}

// Information about which slice plane we would
// like to activate for each slide in our scene.
const SLIDES = [
  {
    title: "Front",
    shape: new SlicePlane({
      position: {
        spatialReference: { wkid: 4326 },
        x: -117.18678980519542,
        y: 34.05998560966533,
        z: 413.94244076963514,
      },
      heading: 180.46565254458895,
      tilt: 269.9999987925818,
      width: 49.04635028105781,
      height: 33.2090051697465,
    }),
  },
  {
    title: "Top",
    shape: new SlicePlane({
      position: {
        spatialReference: { wkid: 4326 },
        x: -117.18677129282855,
        y: 34.05990837974229,
        z: 410.4107119254768,
      },
      heading: 0.6657849842134532,
      tilt: 0.00000775363957927766,
      width: 56.863034126173964,
      height: 54.13647355579905,
    }),
  },
];

function addButtons() {
  scene.when(() => SLIDES.forEach(addSlideButton));
}

/**
 * Creates a button which allows selecting a viewpoint
 * from where one can look at the sliced building.
 */
function addSlideButton({ title, shape }) {
  // Find the slide corresponding to the slice info for
  // which we'll create a button.
  const slide = scene.presentation.slides.find((s) => s.title.text === title);

  // Create a button which applies the slide when clicked.
  const button = document.createElement("button");
  button.classList.add("esri-button", "esri-button--primary");
  button.innerHTML = title;

  button.onclick = async () => {
    // First we set the slice plane shape for the slide.
    widget.viewModel.shape = shape;
    // Then we actually "activate" the slice in the view.
    widget.viewModel.start();

    // Move to the right viewpoint.
    slide.applyTo(view);
  };

  view.ui.add(button, "bottom-left");
}
