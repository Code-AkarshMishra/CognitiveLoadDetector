(() => {
  // Check if a valid instance of the content script is already running
  if (typeof window.neurotrackPing === 'function' && window.neurotrackPing()) {
    return;
  }

  // Define the ping-back function for this instance
  window.neurotrackPing = () => {
    try {
      return !!(typeof chrome !== 'undefined' && chrome.runtime?.id);
    } catch (e) {
      return false;
    }
  };

  const EVENT_SOURCE = 'neurotrack-extension';
  const EVENT_TYPE = 'neurotrack-extension:activity';

  // Local state for throttling mouse events
  let pendingMouseMoveCount = 0;
  let pendingDistance = 0;
  let lastPosition = null;
  let throttleInterval = null;

  // Cleanup listeners if extension context is invalidated
  const cleanupListeners = () => {
    try {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleMouseClick, true);
      window.removeEventListener('message', handleWindowMessage);
      if (throttleInterval) {
        clearInterval(throttleInterval);
        throttleInterval = null;
      }
      console.log('NeuroTrack extension disconnected: cleaned up active listeners.');
    } catch (e) {
      // ignore
    }
  };

  // Safe wrapper for chrome.runtime.sendMessage using classic callback + lastError check
  const safeSendMessage = (message, callback) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
        chrome.runtime.sendMessage(message, (response) => {
          // Reading chrome.runtime.lastError notifies the browser that the error was caught/handled
          if (chrome.runtime.lastError) {
            cleanupListeners();
            return;
          }
          if (callback) {
            callback(response);
          }
        });
      } else {
        cleanupListeners();
      }
    } catch (error) {
      cleanupListeners();
    }
  };

  // Function to send mouse movement increments to background
  const sendMouseUpdates = () => {
    if (pendingMouseMoveCount > 0 || pendingDistance > 0) {
      safeSendMessage({
        type: 'neurotrack-extension:mouse-moved',
        count: pendingMouseMoveCount,
        distance: Math.round(pendingDistance),
        position: lastPosition
      });
      pendingMouseMoveCount = 0;
      pendingDistance = 0;
    }
  };

  // Keyboard events
  function handleKeyDown(event) {
    console.log('NeuroTrack content: key down on', window.location.host, event.key);
    safeSendMessage({
      type: 'neurotrack-extension:key-pressed',
      key: event.key
    });
  }

  // Mouse click events
  function handleMouseClick() {
    console.log('NeuroTrack content: mouse click on', window.location.host);
    safeSendMessage({
      type: 'neurotrack-extension:click-recorded'
    });
  }

  // Mouse move events
  function handleMouseMove(event) {
    const currentPosition = { x: event.clientX, y: event.clientY };
    if (lastPosition) {
      const dx = currentPosition.x - lastPosition.x;
      const dy = currentPosition.y - lastPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      pendingDistance += distance;
    }
    lastPosition = currentPosition;
    pendingMouseMoveCount += 1;

    // Start throttle interval if not already running
    if (!throttleInterval) {
      throttleInterval = setInterval(sendMouseUpdates, 150);
    }
  }

  // Relay messages from Web Page to Background Script
  function handleWindowMessage(event) {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'neurotrack-extension:start-session') {
      console.log('NeuroTrack content: start-session requested from dashboard');
      safeSendMessage({ type: 'neurotrack-extension:start-session' });
    } else if (event.data.type === 'neurotrack-extension:stop-session') {
      console.log('NeuroTrack content: stop-session requested from dashboard');
      safeSendMessage({ type: 'neurotrack-extension:stop-session' });
    } else if (event.data.type === 'neurotrack-extension:ping' || event.data.type === 'neurotrack-extension:get-state') {
      safeSendMessage({ type: 'neurotrack-extension:get-state' }, (response) => {
        if (response) {
          window.postMessage({
            source: EVENT_SOURCE,
            type: EVENT_TYPE,
            payload: response
          }, '*');
        }
      });
    }
  }

  // Listen for DOM events on the document
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleMouseClick, true);

  // Relay messages from Background Script to Web Page
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message?.source === EVENT_SOURCE) {
          window.postMessage(message, '*');
        }
      });
    }
  } catch (error) {
    // Context invalidated, ignore
  }

  // Relay window messages
  window.addEventListener('message', handleWindowMessage);

  // Query background for initial state on load
  safeSendMessage({ type: 'neurotrack-extension:get-state' }, (response) => {
    if (response) {
      window.postMessage({
        source: EVENT_SOURCE,
        type: EVENT_TYPE,
        payload: response
      }, '*');
    }
  });

  console.log('NeuroTrack content script successfully loaded on', window.location.href);
})();
