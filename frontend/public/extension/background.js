let globalState = {
  keyboard: {
    totalKeystrokes: 0,
    backspaceCount: 0,
    characters: 0,
    lastKeyAt: null,
    totalIntervals: 0,
    intervalCount: 0,
    averageInterval: 0
  },
  mouse: {
    movementEvents: 0,
    clickCount: 0,
    totalDistance: 0,
    lastActivityAt: null,
    lastPosition: null
  },
  distractions: {
    tabSwitches: 0,
    windowFocusChanges: 0
  },
  timestamp: new Date().toISOString()
};

let isSessionActive = false;

// Initialize state from chrome.storage.local
chrome.storage.local.get(['neurotrackGlobalState', 'neurotrackSessionActive'], (result) => {
  if (result.neurotrackGlobalState) {
    globalState = result.neurotrackGlobalState;
  }
  if (result.neurotrackSessionActive !== undefined) {
    isSessionActive = result.neurotrackSessionActive;
  }
  console.log('NeuroTrack background state loaded', { globalState, isSessionActive });
});

// Inject content.js into all open tabs on install/reload
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    if (!tabs) return;
    for (const tab of tabs) {
      if (tab.id && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://') || tab.url.startsWith('file://'))) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(() => {
          // Ignore secure pages
        });
      }
    }
  });
});

// Helper function to save state
function saveState() {
  chrome.storage.local.set({
    neurotrackGlobalState: globalState,
    neurotrackSessionActive: isSessionActive
  });
}

// Helper function to broadcast state to all tabs
function broadcastState() {
  const message = {
    source: 'neurotrack-extension',
    type: 'neurotrack-extension:activity',
    payload: globalState
  };

  chrome.tabs.query({}, (tabs) => {
    if (!tabs) return;
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Ignore errors for tabs where content script isn't loaded
        });
      }
    }
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const now = Date.now();
  console.log('NeuroTrack background: received message', message?.type, { message, isSessionActive });

  if (message?.type === 'neurotrack-extension:start-session') {
    isSessionActive = true;
    globalState = {
      keyboard: {
        totalKeystrokes: 0,
        backspaceCount: 0,
        characters: 0,
        lastKeyAt: null,
        totalIntervals: 0,
        intervalCount: 0,
        averageInterval: 0
      },
      mouse: {
        movementEvents: 0,
        clickCount: 0,
        totalDistance: 0,
        lastActivityAt: null,
        lastPosition: null
      },
      distractions: {
        tabSwitches: 0,
        windowFocusChanges: 0
      },
      timestamp: new Date().toISOString()
    };
    saveState();
    broadcastState();
    sendResponse({ ok: true, active: isSessionActive, state: globalState });
    return true;
  }

  if (message?.type === 'neurotrack-extension:stop-session') {
    isSessionActive = false;
    saveState();
    sendResponse({ ok: true, active: isSessionActive });
    return true;
  }

  if (message?.type === 'neurotrack-extension:key-pressed') {
    if (!isSessionActive) {
      sendResponse({ ok: false, reason: 'Session not active' });
      return true;
    }

    const { key } = message;
    
    // Accumulate intervals
    if (globalState.keyboard.lastKeyAt) {
      const interval = now - globalState.keyboard.lastKeyAt;
      // Sanity check: ignore extremely long intervals (e.g. idle periods > 30 seconds)
      if (interval < 30000) {
        globalState.keyboard.totalIntervals += interval;
        globalState.keyboard.intervalCount += 1;
        globalState.keyboard.averageInterval = Math.round(
          globalState.keyboard.totalIntervals / globalState.keyboard.intervalCount
        );
      }
    }

    globalState.keyboard.totalKeystrokes += 1;
    globalState.keyboard.lastKeyAt = now;

    if (key === 'Backspace') {
      globalState.keyboard.backspaceCount += 1;
    }

    if (key.length === 1 || key === ' ') {
      globalState.keyboard.characters += 1;
    }

    globalState.mouse.lastActivityAt = now;
    globalState.timestamp = new Date().toISOString();

    saveState();
    broadcastState();
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === 'neurotrack-extension:click-recorded') {
    if (!isSessionActive) {
      sendResponse({ ok: false, reason: 'Session not active' });
      return true;
    }

    globalState.mouse.clickCount += 1;
    globalState.mouse.movementEvents += 1; // Click counts as movement event too
    globalState.mouse.lastActivityAt = now;
    globalState.timestamp = new Date().toISOString();

    saveState();
    broadcastState();
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === 'neurotrack-extension:mouse-moved') {
    if (!isSessionActive) {
      sendResponse({ ok: false, reason: 'Session not active' });
      return true;
    }

    const { count, distance, position } = message;

    globalState.mouse.movementEvents += count;
    globalState.mouse.totalDistance += distance;
    if (position) {
      globalState.mouse.lastPosition = position;
    }
    globalState.mouse.lastActivityAt = now;
    globalState.timestamp = new Date().toISOString();

    saveState();
    broadcastState();
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === 'neurotrack-extension:get-state') {
    sendResponse(globalState);
    return true;
  }

  if (message?.type === 'neurotrack-extension:ping') {
    sendResponse({ ok: true, active: isSessionActive });
    return true;
  }
});

// Tab activity and window focus listeners for distraction tracking
chrome.tabs.onActivated.addListener(() => {
  if (!isSessionActive) return;
  globalState.distractions.tabSwitches += 1;
  globalState.timestamp = new Date().toISOString();
  saveState();
  broadcastState();
});

chrome.windows.onFocusChanged.addListener(() => {
  if (!isSessionActive) return;
  globalState.distractions.windowFocusChanges += 1;
  globalState.timestamp = new Date().toISOString();
  saveState();
  broadcastState();
});
