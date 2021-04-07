// @ts-check

import WebScene from "esri/WebScene.js";
import SceneView from "esri/views/SceneView.js";
import ElevationProfile from "esri/widgets/ElevationProfile.js";
import ElevationProfileLineGround from "esri/widgets/ElevationProfile/ElevationProfileLineGround.js";
import ElevationProfileLineView from "esri/widgets/ElevationProfile/ElevationProfileLineView.js";
import { HIKING_TRAILS, ZURICH_KAFERBERG } from "../scenes.js";

let view, widget;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;

if (slideTitle === "elevation-profile") {
  initScene(ZURICH_KAFERBERG);

  parent.document.getElementById("elevation-profile-1").onclick = addWidget;
  parent.document.getElementById(
    "elevation-profile-2"
  ).onclick = setGroundAndViewProfileLines;
} else if (slideTitle === "elevation-profile-csv") {
  initScene(HIKING_TRAILS);
  addWidget();

  parent.document.getElementById("elevation-profile-csv-1").onclick = addButton;
}

/**
 * Initializes the scene.
 */
function initScene(sceneId) {
  view = new SceneView({
    map: new WebScene({ portalItem: { id: sceneId } }),
    container: "viewDiv",
    qualityProfile: "high",
  });

  view.popup.defaultPopupTemplateEnabled = false;
}

/**
 * Creates a new elevation profile widget and adds it to the view.
 */
function addWidget() {
  widget = new ElevationProfile({
    view,
    profiles: [makeGroundProfileLine()], // Only a line which samples the ground
  });
  view.ui.add(widget, "top-right");
}

/**
 * Configures the elevation profile widget such that it displays a line
 * representing the elevation of the ground and another one representing the
 * elevation of everything else (buildings, integrated mesh, etc).
 */
function setGroundAndViewProfileLines() {
  widget.profiles = [makeGroundProfileLine(), makeViewProfileLine()];
}

/**
 * Makes a new profile line which samples elevation from the elevation layers in
 * the `view.map.ground`.
 */
function makeGroundProfileLine() {
  return new ElevationProfileLineGround({
    color: "#0000ff", // Optional custom color
    title: "Ground", // Optional custom title
  });
}

/**
 * Makes a new profile line which samples elevation from the view itself by
 * intersecting buildings, integrated mesh, etc. We also configure it to exclude
 * the ground from the intersections since we'll include the ground in another
 * profile line.
 */
function makeViewProfileLine() {
  return new ElevationProfileLineView({
    title: "Layers",
    color: "#555555",
    exclude: [view.map.ground], // We're not interested in the ground
  });
}

/**
 * Adds a button to the view which, when clicked, allows the user to download
 * the currently-generated elevation profile as a CSV file.
 */
function addButton() {
  const button = document.createElement("button");
  button.classList.add("esri-button", "esri-button--primary");
  button.innerHTML = "Download as CSV";
  button.onclick = downloadCSV;
  view.ui.add(button, "bottom-left");
}

/**
 * Generates a CSV file from the elevation profile data
 * and offers it for download.
 */
function downloadCSV() {
  // Grab the samples from our profile line.
  const groundProfileLine = widget.profiles.getItemAt(0);

  // Make sure the profile is fully generated.
  if (groundProfileLine.progress !== 1) {
    alert("Profile not yet generated.");
    return;
  }

  // Generate CSV data from the samples stored in
  // the elevation profile line.
  const fields = ["distance", "elevation", "x", "y", "z"];
  const parser = new json2csv.Parser({ fields });
  const csv = parser.parse(groundProfileLine.samples);

  // Make a new blob with our CSV data and offer it
  // for download using FileSaver.js
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "profile-data.csv");
}
