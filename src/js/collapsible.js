
(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], function () {
      return factory(root);
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.Collapsible = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  var init = function () {
    document.addEventListener('click', function (e) {
      let toggleButton = e.target.closest('[data-collapsible-toggle]');

      // Bail if the target was not a toggle button.
      if (!toggleButton) return;

      toggle(toggleButton);
    });
  }

  /**
   *
   * @param {HTMLButtonElement} element
   * @param {String} attr any HTML atribute with a true/false string value
   */
  var _toggleState = function (element, attr) {
    /**
     * Setting variable like this is a nice way to convert
     * the true/false attribute value from a string to a boolean.
     */
    var initialState = element.getAttribute(attr) === 'true' || false;
    element.setAttribute(attr, !initialState);
  }

  /**
   *
   * @param {HTMLButtonElement} button
   * @param {Function} callback
   */
  var toggle = function (button, callback) {
    // Get the corresponding panel content
    var content = document.getElementById(
      button.getAttribute('data-collapsible-toggle')
    );

    if (!content) {
      throw new Error('There is no element with a corresponding id attribute to toggle.');
    }

    // Toggle state
    _toggleState(button, 'aria-expanded');
    _toggleState(content, 'aria-hidden');

    if (typeof callback === 'function') {
      callback();
    }
  }

  return {
    init: init,
    toggle: toggle
  }
});