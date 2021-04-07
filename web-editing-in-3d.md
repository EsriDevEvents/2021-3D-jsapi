<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <title>Esri Developer Summit 2021: ArcGIS API for JavaScript Presentations</title>
    <meta property="og:title" content="Esri Developer Summit 2021: ArcGIS API for JavaScript Presentations" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://esri.github.io/devsummit-2021-3D-jsapi/featured-slide.jpg" />
    <meta property="og:url" content="https://esri.github.io/devsummit-2021-3D-jsapi" />
    <meta name="description" content="Esri Developer Summit 2021: ArcGIS API for JavaScript Presentations">
    <meta property="og:description" content="Esri Developer Summit 2021: ArcGIS API for JavaScript Presentations">
    <link rel="stylesheet" href="./css/reveal.css" />
    <link rel="stylesheet" href="./css/theme/black.css" id="theme" />
    <!-- <link rel="stylesheet" href="./css/highlight/railscasts.css" /> -->
    <link rel="stylesheet" href="./css/print/paper.css" type="text/css" media="print" />
    <link rel="stylesheet" href="./assets/style.css" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>
  </head>
  <body>
    <div class="reveal">
      <div class="slides"><section  data-markdown><script type="text/template"><!-- .slide: data-background="images/bg-1.png" class="title" -->

# ArcGIS API for JavaScript

## Web Editing in 3D

Arno Fiva, Esri R&D Center Zürich \
Roman Cattaneo, Esri R&D Center Zürich

2021 ESRI DEVELOPER SUMMIT​ | Palm Springs, CA
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Preface

Browser requirements

- Any _modern_ browser will work (Chrome, Firefox, Microsoft Edge, Safari)
- Mobile: _latest_ Samsung & Apple devices
- Desktop: dedicated graphics card recommended
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Agenda

- From 2D to 3D
- 3D feature layer editing applied
- Beyond feature layers
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Agenda

- From 2D to 3D
- <!-- .element style="opacity: 0.3;" --> 3D feature layer editing applied
- <!-- .element style="opacity: 0.3;" --> Beyond feature layers
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" data-title="editor-widget-3d" -->

### Using the Editor widget in 3D

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column" style="vertical-align: center">

<div class="code-snippet">
<pre><code class="lang-ts">// SceneView diplaying a WebMap
view = new SceneView({
  map: new WebMap({ portalItem: { id: "web-map-id" } }),
});
</code></pre>
</div>

<div class="code-snippet">
<button class="play" id="editor-widget-3d-2"></button>
<pre><code class="lang-ts">// Create an Editor widget
const editor = new Editor({
  view: view
});
// Add widget to top-right of the view
view.ui.add(editor, "top-right");
</code></pre>
</div>

<br/>

- Using the `Editor` widget in a `SceneView` works out of the box
- Usage of `SketchViewModel`, `FeatureForm`, and `Editor` widget is the same in 2D and 3D

</div>

<div class="right-column">
  <iframe data-src="./samples/web-editing-in-3d/editor-widget-3d/index.html" ></iframe>
</div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

### Transition from 2D to 3D

1. Store z-values in the GeoDB
2. Add `ElevationInfo` on the layer (metadata how to interpret the raw z-values)
3. 3D-Symbology for appropriate visualizations
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

### Z-values and elevation modes

<!-- markdownlint-disable html -->
<div>
  <img style="border: 8px solid white" src="./images/elevation-info.png">
  <p style="text-align:left">Elevation modes define how the API interprets z-values from the GeoDB. Check
  out our
  <a href="https://developers.arcgis.com/javascript/latest/sample-code/scene-elevationinfo/">interactive sample</a>
  on developers.argis.com.</p>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" data-title="z-values"-->

### Placing points in 3D in a FeatureLayer

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<p style="text-align:left">Two point feature layers: one for boats on the lake and one for flying helicopters.</p>
<div class="code-snippet">
<button class="play" id="z-values-1"></button>
<pre><code class="lang-ts">// Boat feature layer
view.map.add(new FeatureLayer({
  title: "Boat layer",
  elevationInfo: { mode: "on-the-ground" },
  // ...
})
// Helicopter feature layer
// featureLayerWithZ.capabilities.data.supportsZ == true
view.map.add(new FeatureLayer({
  title: "Helicopter layer",
  hasZ: true,
  elevationInfo: { mode: "absolute-height" },
  // ...
}));
// Add the editor widget
widget = new Editor({ view: view });
view.ui.add(widget, "top-right");
</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe data-src="./samples/web-editing-in-3d/z-values/index.html" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" data-title="visual-variables"-->

### Using 3D-models as symbology for points in a FeatureLayer

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="visual-variables-1"></button>
<pre><code class="lang-ts">view.map.add(new FeatureLayer({
  title: "Boat layer",
  elevationInfo: { mode: "on-the-ground" },
  renderer: new SimpleRenderer({
    // Use a sailboat as symbol for the boat layer
    symbol: {
      type: "web-style",
      name: "Sailboat",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriRealisticTransportationStyle"
    },
    visualVariables: [
      { type: "size", field: "size" },
      { type: "rotation", field: "heading"}
    ]
  }),
  // ...
})
</code></pre>
</div>
<div class="code-snippet">
<button class="play" id="visual-variables-2"></button>
<pre><code class="lang-ts">view.map.add(new FeatureLayer({
  title: "Helicopter layer",
  hasZ: true,
  elevationInfo: { mode: "absolute-height" },
  renderer: new SimpleRenderer({
    // Use a helicopter as symbol for the helicopter layer
    symbol: {
      type: "web-style",
      name: "Eurocopter_AS-365_-_Flying",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriRealisticTransportationStyle"
    },
    visualVariables: [
      { type: "size", field: "size" },
      { type: "rotation", field: "heading"}
    ]
  }),
  // ...
}));
</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe data-src="./samples/web-editing-in-3d/visual-variables" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

### Editor widget in 3D

<!-- markdownlint-disable html -->
<div>
<img width="600px" src="images/widgets-editor-3d.png">

<p>Check out the interactive <a href="https://developers.arcgis.com/javascript/latest/sample-code/widgets-editor-3d/">editing in 3D sample</a> on our <a href="https://developers.arcgis.com/javascript">developer portal</a>.</p>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-3.png" -->

### Recap: Using the editor widget in 3D

- The editor widget works out of the box going from 2D to 3D
- Editing in 3D allows you to change z-values
- Elevation modes put your z-values in perspective
- 3D manipulators allow you to adjust attribute-driven visualizations
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Agenda

- <!-- .element style="opacity: 0.3;" --> From 2D to 3D
- 3D feature layer editing applied
  - Rooftop antenna placement
  - Digitize water
  - Plan sightseeing tour
- <!-- .element style="opacity: 0.3;" --> Beyond feature layers
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" data-title="antenna-placement" -->

### Rooftop antenna placement

Point geometries with `relative-to-scene` elevation mode.

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<pre><code class="lang-ts">var layer = new FeatureLayer({
  // Add FL with "relative-to-scene" elevation mode
  elevationInfo: { mode: "relative-to-scene", offset: 0 },
  // Disable manipulator for movement in Z-direction
  hasZ: false
  renderer: new SimpleRenderer({
    // Use web-style symbology to add realism
    symbol: {
      type: "web-style",
      name: "Radio_Antenna",
      portal: { url: "https://www.arcgis.com" },
      styleName: "EsriInfrastructureStyle"
    }),
    // Add visual variable to let the user tweak size and rotation of antenna
    visualVariables: [
      { type: "size", axis: "height", field: "size" },
      { type: "rotation", field: "rotation" }
    ]
  }),
  // ...
});
// Add the editor widget
var widget = new Editor({ view: view });
view.ui.add(widget, "top-right");
</code></pre>

</div>

  </div>
  <div class="right-column">
    <iframe data-src="./samples/web-editing-in-3d/antenna-placement/index.html" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" data-title="water-surface" -->

### Digitize water

Polygon geometries with `on-the-ground` elevation mode.

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="water-surface-1"></button>
<pre><code class="lang-ts">// Add a water layer
const waterLayer = new FeatureLayer({
  renderer: {
    type: "simple",
    symbol: {
      type: "polygon-3d",
      symbolLayers: [
        { type: "water" },
      ]
    }
  }
  elevationInfo: { mode: "on-the-ground" },
  // ...
});
</code></pre>

</div>

<div class="code-snippet">
<button class="play" id="water-surface-2"></button>
<pre><code class="lang-ts">// Tweak the water color
new SimpleRenderer({
  symbol: {
    type: "polygon-3d",
    symbolLayers: [
      {
        type: "water",
        waveDirection: 0,
        color: "#978152",
        waveStrength: "slight",
        waterbodySize: "small",
      }
    ]
  }
});
// Enable water reflections
view.environment.lighting.waterReflectionEnabled = true;
</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe data-src="./samples/web-editing-in-3d/draped-water-surface/index.html" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

### Sightseeing tour

Line geometries with `absolute-height` elevation mode.

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">

```ts
view.map.add(
  new FeatureLayer({
    url: "https://services2.arcgis.com/.../FeatureServer",
    elevationInfo: {
      mode: "absolute-height",
    },
    renderer: {
      /* use PathSymbolLayer3D */
    },
  })
);

const editor = new Editor({ view });
```

</div>

<div class="code-snippet fragment">

```ts
// Access sketch view model
const svm = editor.viewModel.sketchViewModel;

// Called on each vertex move
svm.on("update", (event) => {
  if (event.toolEventInfo.type === "reshape") {
    const graphic = event.graphics[0];
    const line = graphic.geometry; // Polyline

    /* Use vertices in line.path */
  }
});
```

</div>

  </div>
  <div class="right-column">
    <iframe data-src="./samples/web-editing-in-3d/sightseeing-tour.html" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->

<!-- https://zrh-app-sd-2.esri.com/arcgis-play/f/k4rZ -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

### Recap: 3D feature layer editing

- <!-- .element class="fragment" --> Different variations of 3D editing using <code>elevationInfo</code>
- <!-- .element class="fragment" --> Customize workflows using the <code>Editor</code> and <code>SketchViewModel</code> widgets
- <!-- .element class="fragment" --> Edit volumetric symbols using<br /><code>WebStyleSymbol</code>, <code>ObjectSymbol3DLayer</code> <code>PathSymbol3DLayer</code> and <code>ExtrudeSymbol3DLayer</code>
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Agenda

- <!-- .element style="opacity: 0.3;" --> From 2D to 3D
- <!-- .element style="opacity: 0.3;" --> 3D feature layer editing applied
- Beyond feature layers
  - Integrated mesh modifications
  - Scene layer attribute editing
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Integrated mesh modifications

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">
    <img src="./images/web-editing-in-3d/im-modifications.png">
  </div>

  <div class="right-column">
    <ul>
      <li class="fragment">Applied client-side</li>
      <li class="fragment">Does not change underlying data (mesh)</li>
      <li class="fragment">Persist and share with <code>WebScene.save()</code></li>
    </ul>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Integrated mesh modifications

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column">

<div>
<table>
  <thead style="background-color: #f3f3f3;">
    </tr>
      <th style="font-size: 0.8em; color: #4a4a4a; border: 1px solid #cacaca;">Clip</th>
      <th style="font-size: 0.8em; color: #4a4a4a; border: 1px solid #cacaca;">Mask</th>
      <th style="font-size: 0.8em; color: #4a4a4a; border: 1px solid #cacaca;">Replace</th>
    </tr>
  </thead>
  <tbody style="background-color: #ffffff;">
    <tr>
      <td style="border: 1px solid #cacaca;"><img src="./images/web-editing-in-3d/modification-clip.png" style="width: 130px;" /></td>
      <td style="border: 1px solid #cacaca;"><img src="./images/web-editing-in-3d/modification-mask.png" style="width: 130px;" /></td>
      <td style="border: 1px solid #cacaca;"><img src="./images/web-editing-in-3d/modification-replace.png" style="width: 130px;" /></td>
    </tr>
    </tr>
      <td style="font-size: 0.7em; color: #4a4a4a; border: 1px solid #cacaca">Removes selected area</td>
      <td style="font-size: 0.7em; color: #4a4a4a; border: 1px solid #cacaca">Displays only selected area</td>
      <td style="font-size: 0.7em; color: #4a4a4a; border: 1px solid #cacaca">Flattens selected area</td>
    </tr>
  </tbody>
</table>
</div>

<p></p>

<div class="code-snippet fragment">

```ts
// Create integrated mesh layer
const imLayer = new IntegratedMeshLayer({ url });

// Select area
const area = new Polygon({ ... });

// Apply modification type
imLayer.modifications = new SceneModifications([
  new SceneModification(area, "replace")
]);
```

</div>

</div>

  <div class="right-column">
    <iframe class="fragment" data-src="./samples/web-editing-in-3d/im-modifications.html" ></iframe>
  </div>
</div>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Integrated mesh modifications

Flatten: expose underground utility

<!-- markdownlint-disable html -->
<img src="./images/web-editing-in-3d/construction.png">
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Scene layer attribute editing

JavaScript API documentation: [Working with Scene Layers](https://developers.arcgis.com/javascript/latest/working-with-scene-layers/)

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column" style="width: 50%">
    <img src="./images/web-editing-in-3d/sl-attribute-editing.png">
  </div>

  <div class="right-column">
    <ul>
      <li class="fragment">Requires associated feature layer
        <div style="text-align: center;">
          <img style="width: 301px; height: 105px;" src="./images/web-editing-in-3d/data-connected-scene-layer.png">
        </div>
      </li>
      <li class="fragment">Attribute edits applied to feature layer</li>
      <li class="fragment">Owner updates scene layer cache in <br />ArcGIS Online/Enterprise</li>
    </ul>
  </div>

  </div>
</div>
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Scene layer attribute editing

<!-- markdownlint-disable html -->
<div class="two-columns">
  <div class="left-column" style="width: 35%">

<div class="code-snippet fragment">

```ts
const sceneLayer = new SceneLayer({ ... });

// Same API as for feature layers
await sceneLayer.applyEdits({

  // Only updates
  updateFeatures: [

    new Graphic({
      attributes: {
        OBJECTID: 10506,
        buildingState: "planned",
        ...
      }
    }
  )]
});

console.log("Success");
```

</div>
  </div>

  <div class="right-column">

  <div style="text-align: left;">
    <p class="fragment">JavaScript API automatically:</p>

  <ul>
      <li class="fragment">Applies edits to associacted feature layer</li>
      <li class="fragment">Loads edits from associated feature layer</li>
      <li class="fragment">Uses updated attribute values in renderer and popups</li>
    </ul>

  </div>
  </div>

</div>

<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Scene layer attribute editing

<!-- markdownlint-disable html -->
<iframe data-src="https://developers.arcgis.com/javascript/latest/sample-code/widgets-editor-3d-scenelayer/live/" ></iframe>
<!-- markdownlint-restore -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-2.png" -->

## Web Editing in 3D

<img src="./images/web-editing-in-3d/3d-editing.png" style="width: 50%;">

https://developers.arcgis.com/javascript/latest/sample-code/widgets-editor-3d
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-survey.png" -->
</script></section><section  data-markdown><script type="text/template">
<!-- .slide: data-background="images/bg-exit.png" -->
</script></section></div>
    </div>

    <script src="./js/reveal.js"></script>

    <script>
      function extend() {
        var target = {};
        for (var i = 0; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (source.hasOwnProperty(key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      }

      // Optional libraries used to extend on reveal.js
      var deps = [
        { src: './plugin/markdown/marked.js', condition: function() { return !!document.querySelector('[data-markdown]'); } },
        { src: './plugin/markdown/markdown.js', condition: function() { return !!document.querySelector('[data-markdown]'); } },
        // { src: './plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: './plugin/zoom-js/zoom.js', async: true },
        { src: './plugin/notes/notes.js', async: true },
        { src: './plugin/math/math.js', async: true },
        { src: './prism/plugin.js', async: true }
      ];

      // default options to init reveal.js
      var defaultOptions = {
        controls: true,
        progress: true,
        history: true,
        center: true,
        transition: 'default', // none/fade/slide/convex/concave/zoom
        dependencies: deps
      };

      // options from URL query string
      var queryOptions = Reveal.getQueryHash() || {};

      var options = extend(defaultOptions, {"transition":"none","backgroundTransition":"none","width":1366,"height":768,"preloadIframes":false}, queryOptions);
    </script>


    <script>
      Reveal.initialize(options);

      // Define default background
      // for (var slide of document.getElementsByTagName('section')){
      //   if (!(slide.getAttribute('data-background') ||
      //         slide.getAttribute('data-background-video') ||
      //         slide.getAttribute('data-background-iframe') ||
      //         slide.getAttribute('data-background-image'))){
      //     slide.setAttribute('data-background', 'images/bg-2.png');
      //     slide.setAttribute('data-background-image', 'images/bg-2.png');
      //   }
      // }

      Reveal.addEventListener('ready', function(event) {
        addEventListener("message", function(event) {
          if (event.data && event.data.type === "fullscreen") {
            if (document.webkitCurrentFullScreenElement) {
              document.webkitExitFullscreen();
              return;
            }
            var iframes = document.querySelectorAll("iframe");
            for (var i = 0; i < iframes.length; i++) {
              var iframe = iframes[i];
              if (iframe.contentWindow === event.source) {
                iframe.webkitRequestFullscreen();
                return;
              }
            }
          }
        });

        var playButtons = document.querySelectorAll('[data-play-frame]');

        for (var i = 0; i < playButtons.length; i++) {
          playButtons[i].addEventListener('click', (function(frameName, argument) {
            return function(event) {
              event.stopPropagation();
              event.preventDefault();
              window.frames[frameName].contentWindow.postMessage({ play: true, argument: argument }, '*');
            };
          })(playButtons[i].getAttribute('data-play-frame'), playButtons[i].getAttribute("data-play-argument")));
          playButtons[i].addEventListener('mousedown', function(event) {
            event.preventDefault();
            event.stopPropagation();
          });
        }
      });

      Reveal.addEventListener( 'slide-animation-title', function() {
        var textWrapper = document.getElementById('letters');
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        var textWrapper = document.getElementById('animation');
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime({
            targets: '.letter',
            scale: [0.3,1],
            opacity: [0,1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 600,
            delay: (el, i) => 1000 + 70 * (i+1)
          });
    } );
    </script>
  </body>
</html>