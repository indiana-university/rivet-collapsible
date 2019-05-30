/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.Collapsible = factory(root);
  }
  // eslint-disable-next-line no-unused-vars
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  var DATA_ATTR = 'data-collapsible';
  var ID_ERROR = 'There is no element with a corresponding id attribute to toggle.';
  var keys = {
    up: 38,
    down: 40,
    home: 36,
    end: 35
  };

  /**
   * Creates a new custom event and stores a reference
   * to the unique "data-collapsible" attribute in the custom
   * event's options "detail" property.
   *
   * More here:
   * https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
   *
   */

  var _fireCustomEvent = function(element, eventName) {
    var event = new CustomEvent(eventName, {
      bubbles: true,
      detail: {
        name: function () {
          return element.getAttribute(DATA_ATTR);
        }
      }
    });

    // Distpatch the event
    element.dispatchEvent(event);
  }

  /**
   *
   * @param {HTMLElement} collapsibleButton
   * @param {Function} callback
   */
  var open = function(collapsibleButton, callback) {
    collapsibleButton.setAttribute('aria-expanded', 'true');

    var content = document.getElementById(
      collapsibleButton.getAttribute(DATA_ATTR)
    );

    if (!content) {
      throw new Error(ID_ERROR);
    }

    content.setAttribute('aria-hidden', 'false');

    _fireCustomEvent(collapsibleButton, 'collapsibleOpen');

    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   *
   * @param {HTMLElement} collapsibleButton
   * @param {Function} callback
   */
  var close = function (collapsibleButton, callback) {
    collapsibleButton.setAttribute('aria-expanded', 'false');

    var content = document.getElementById(
      collapsibleButton.getAttribute(DATA_ATTR)
    );

    if (!content) {
      throw new Error(ID_ERROR);
    }

    collapsibleButton.setAttribute('aria-expanded', 'false')
    content.setAttribute('aria-hidden', 'true');

    _fireCustomEvent(collapsibleButton, 'collapsibleClose');

    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  var _handleClick = function(event) {
    var toggleButton = event.target.closest('[' + DATA_ATTR + ']');

    // Bail if the target was not a toggle button.
    if (!toggleButton) return;

    var collapsibleState = toggleButton.getAttribute('aria-expanded');

    // If the swithch is off, set the checked state to "true"
    if (collapsibleState === 'false') {
      open(toggleButton);
    } else {
      close(toggleButton);
    }
  }

  var _handleKeyup = function(event) {
    if (event.keyCode === keys.up || event.keyCode === keys.down) {
      var accordionParent = event.target.closest('[data-accordion]');

      if (!accordionParent) return;

      var accordionToggles = accordionParent.querySelectorAll('[' + DATA_ATTR + ']');

      /**
       * Warn if there is only one collapsible inside the accrodion.
       * In this case a plain collapsible will do.
       */
      if (accordionToggles.length < 2) {
        // eslint-disable-next-line no-console
        console.warn('An accordions should contain *at least two* accordion toggles with the "data-collapsible" attribute');
      }

      // Convert the nodeList into an array
      var accordionTogglesArr = Array.prototype.slice.call(accordionToggles);

      // Store a refernce to the current toggle
      var currentToggle = document.activeElement;

      // Find the next toggle index based on current activeElement
      var nextToggle = accordionTogglesArr.indexOf(currentToggle) + 1;

      // Find the previous toggle index based on current activeElement
      var prevToggle = accordionTogglesArr.indexOf(currentToggle) - 1;

      // Handle moving foucs based on up or down arrow key
      switch (event.keyCode) {
        // Up arrow key
        case keys.up:
          // If the current active toggle is the first bail
          if (accordionTogglesArr[prevToggle] === undefined) return;

          // Focus the previous toggle
          accordionTogglesArr[prevToggle].focus();
          break;

        // Down arrow key
        case keys.down:
          // If the current active toggle is the last bail
          if (accordionTogglesArr[nextToggle] === undefined) return;

          // Focus the next toggle
          accordionTogglesArr[nextToggle].focus();
          break;
      }
    }
  }

  // Cleans up event listeners
  var destroy = function() {
    document.removeEventListener('click', _handleClick, false);
    document.removeEventListener('keyup', _handleKeyup, false);
  }

  var init = function() {
    // Destroy any current initialization
    destroy();

    // Set up event delegation
    document.addEventListener('click', _handleClick, false);
    document.addEventListener('keyup', _handleKeyup, false);
  }

  // Return public APIs
  return {
    init: init,
    open: open,
    close: close,
    destroy: destroy
  }
});