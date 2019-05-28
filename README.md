## rivet-collapsible
An accessible expand-and-collapse widget for Rivet

[Download Rivet collapsible](https://github.com/indiana-university/rivet-collapsible/archive/master.zip) | [View the demo](https://indiana-university.github.io/rivet-collapsible/)

### Build status

[![CircleCI](https://circleci.com/gh/indiana-university/rivet-collapsible.svg?style=svg)](https://circleci.com/gh/indiana-university/rivet-collapsible)

### Getting started
The Rivet collapsible add-on requires the use of the core Rivet CSS. You can find out more about how to get started in [the Rivet documentation](https://rivet.iu.edu/components/). Once you are using Rivet, you can download the Rivet collapsible source files and include them in your project.

#### Note: `closest()` polyfill
The Rivet Collapsible uses the `.closest()` JavaScript method which works in all modern web browsers, but requires a small polyfill to add support for Internet Explorer 11. The main Rivet JavaScript file (`rivet.js`) already includes the `closest()` polyfill so if you are using it on your page there is no need to add it.

```js
/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  Element.prototype.closest = function (s) {
    var el = this;
    var ancestor = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (ancestor.matches(s)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return null;
  };
}
```

#### 1. Include the CCS and JavaScript in your page
```html
<link rel="stylesheet" href="dist/css/rivet-collapsible.min.css">
<script src="dist/js/rivet-collapsible.min.js"></script>
```

#### 2. Add the markup to your HTML
It is possible to either show or hide the collapsible content by default. To hide the the content by default set the `aria-expanded` attribute on the `<button>` element inside the `.rvt-collapsible__title` element to `false`, then set the `aria-hidden` attribute on the `.rvt-collapsible__content` element to "true". You can hide the collapsible content by default by doing the opposite and setting `aria-expanded` to a value of `true` and `aria-hidden` to a value of `false`.

Lastly, you need to make sure to add the `[data-collapsible]` to the button toggle element with a value that matches the `id` attribute of the content that yo uwant to exapand/collapse.

```html
<!-- Hidden by default -->

<div class="rvt-collapsible">
  <h1 class="rvt-collapsible__title">
    <button data-collapsible="users" aria-expanded="false">
      <svg role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path fill="currentColor" d="M5.5,15a1,1,0,0,1-.77-1.64L9.2,8,4.73,2.64A1,1,0,0,1,6.27,1.36L11.13,7.2a1.25,1.25,0,0,1,0,1.61L6.27,14.64A1,1,0,0,1,5.5,15ZM9.6,8.48h0Zm0-1h0Z"/>
      </svg>
      <span>Default Rivet collapsible</span>
    </button>
  </h1>
  <div class="rvt-collapsible__content" id="users" aria-hidden="true">
    <p class="rvt-m-all-remove">Nostrum fugit a natus. Corporis voluptates ut odio omnis nobis voluptas. Est dolor et eum quis deleniti explicabo autem est magnam. Unde expedita ab quia maxime quia. Qui voluptas distinctio ipsa laborum laboriosam.</p>
  </div>
</div>
```

#### 3. Initialize the add-on
Lastly, you'll need to initialize somewhere right before the closing `</body>` tag of you page.

```html
<script>
  Collapsible.init();
</script>
```

### Installing with NPM
(_Coming soon..._)

## Contolling the collapsible in your own scripts
The Rivet collapsible component exposes a handful of methods you can use to programmatically control the component. The `.init()` method must be called somewhere in your document after the `rivet-collapsible.js` script is included. The `init()` method attaches and event listener to the document that listens for clicks on buttons with the `data-collapsible` attribute. With that in mind you should be able to dynamically add collapsibles to the DOM without having the re-initialize the component.

#### Methods

| Method                               | Description                                                                                                                                                       |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Collapsible.init()`                   | Initializes the collapsible component                                                                                                                             |
| `Collapsible.open(collapsibleButton, callback)` | Accepts a collapsible toggle button element `[data-collapsible]` and an optional callback function that is run after the collapsible is toggled opened. |
| `Collapsible.close(collapsibleButton, callback)` | Accepts a collapsible toggle button element `[data-collapsible]` and an optional callback function that is run after the collapsible is toggled closed. |
| `Collapsible.destroy()`                | Destroys the current initialization of the collapsible component and removes it's event listener.                                                                 |

### Testing
We're using [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html) for integration testing. To run the tests:

#### Testing with the Cypress GUI
1. First you need to start the development server by typing `npm run start` in your terminal.
1. Type `npm run cypress:open` in your terminal. This will open the Cypress automation client/GUI.
2. Select the test you want to run from the list of test, usually called `componentname_spec.js` where `componentname` is the name of the component you're testing.
3. The test will start runing in a new chrome window.
4. [Refer to the Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress.html) for more info.

### Testing on the command line only
Alternatively, you can run the Cypress integration tests on the _command line only_.

1. First you need to start the development server by typing `npm run start` in your terminal.
2. Then type `npm run test`.
3. This will run the test and report any failures in the terminal output. It will also record a video session of the tests and save it to `cypress/videos`.

### To-do
- [X] Add docs for testing with Cypress
- [ ] Create NPM package and documentation for including in a project
- [X] Add implementation docs to README
- [X] Test UMD implementation e.g. `const Collapsible = require('rivet-collapsible.js')`
- [X] Add Github pages demo
- [X] Add minnification step to build process for CSS and JS
- [X] Add Version banner to files in `dist` folder
