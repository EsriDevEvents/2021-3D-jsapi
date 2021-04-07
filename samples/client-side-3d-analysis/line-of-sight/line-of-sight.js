// @ts-check

import WebScene from "esri/WebScene.js";
import SceneView from "esri/views/SceneView.js";
import Point from "esri/geometry/Point.js";
import LineOfSight from "esri/widgets/LineOfSight.js";
import { ZURICH_CITY } from "../scenes.js";

let view, widget;

const slideTitle = parent.Reveal.getCurrentSlide().dataset.title;

if (slideTitle === "line-of-sight") {
  initScene();

  parent.document.getElementById("line-of-sight-1").onclick = addWidget;
  parent.document.getElementById("line-of-sight-2").onclick = addClickHandler;
}

/**
 * Initializes the scene.
 */
function initScene() {
  view = new SceneView({
    map: new WebScene({ portalItem: { id: ZURICH_CITY } }),
    container: "viewDiv",
    qualityProfile: "high",
  });

  view.popup.defaultPopupTemplateEnabled = false;
}

/**
 * Creates a new LineOfSight widget and adds it to the view.
 */
function addWidget() {
  widget = new LineOfSight({ view });
  view.ui.add(widget, "top-right");
}

/**
 * Adds a click handler to the view so that when the user clicks on the view,
 * we set up a line-of-sight analysis to show whether the clicked point can
 * "see" our landmark points.
 */
function addClickHandler() {
  const viewModel = widget.viewModel;

  // Positions on the landmark we are interested in. When the user clicks in the
  // view, we'll build a line of sight analysis showing whether each of these
  // points is visible from the clicked point.
  const TARGETS = [
    {
      location: new Point({
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 950778.4503402564,
        y: 6002855.944295663,
        z: 451.60308170318604,
      }),
    },
    {
      location: new Point({
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 950783.9260876748,
        y: 6002863.975903705,
        z: 452.31429374497384,
      }),
    },
    {
      location: new Point({
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 950776.4884166865,
        y: 6002863.604780774,
        z: 477.4038194231689,
      }),
    },
    {
      location: new Point({
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 950775.8947719822,
        y: 6002870.213783867,
        z: 454.0025756144896,
      }),
    },
    {
      location: new Point({
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 950769.2494087839,
        y: 6002861.647797235,
        z: 450.3787940014154,
      }),
    },
  ];

  // When clicking the view, we'll build a line-of-sight analysis
  // indicating whether the clicked point can see the landmark.
  view.on("click", async (e) => {
    // Query the view to see what we hit.
    const result = await view.hitTest(e);
    // Pick either the first object we hit, or the ground.
    const hit = result.results.length > 0 ? result.results[0] : result.ground;

    if (hit) {
      // Start a new analysis and then immediately
      // fill out the observer and target for it.
      viewModel.start();
      viewModel.observer = hit.mapPoint;
      viewModel.targets = TARGETS;
    }
  });

  // When the view model switches to the "creating" state,
  // the analysis is in interactive mode. In our case, we
  // want to force it to stop because we are setting the
  // observer and targets ourselves.
  viewModel.watch("state", (state) => {
    if (state === "creating") {
      viewModel.stop();
    }
  });
}
