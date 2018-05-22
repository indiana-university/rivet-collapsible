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
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  var DATA_ATTR = 'data-collapsible';
  var ID_ERROR = 'There is no element with a corresponding id attribute to toggle.';

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

    _fireCustomEvent(collapsibleButton, 'collapsibleOpen');

    var content = document.getElementById(
      collapsibleButton.getAttribute(DATA_ATTR)
    );

    if (!content) {
      throw new Error(ID_ERROR);
    }

    content.setAttribute('aria-hidden', 'false');

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
    collapsibleButton.setAttribute('aria-exapnded', 'false');

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

  var destroy = function() {
    document.removeEventListener('click', _handleClick, false);
  }

  var init = function() {
    // Destroy any current initialization
    destroy();

    // Set up event delegation
    document.addEventListener('click', _handleClick, false);
  }

  return {
    init: init,
    open: open,
    close: close,
    destroy: destroy
  }
});