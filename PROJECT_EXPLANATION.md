# NeuroTrack AI - Detailed Project Explanation

## 1. Project Overview

NeuroTrack AI is a frontend application for cognitive load and mental fatigue analysis. The app presents a product landing page and a live dashboard where user interaction signals are monitored during an active session.

The main purpose of the project is to show how behavioral signals can be collected and presented in a readable analytics interface. It focuses on:

- Cognitive load awareness.
- Mental fatigue monitoring.
- Keyboard interaction patterns.
- Mouse behavior patterns.
- Session duration.
- Webcam permission and camera activity state.
- Privacy-first user consent.

The application does not require users to complete surveys. Instead, it reads real interaction signals while the session is active.

## 2. Application Routes

The project uses the Next.js App Router.

| Route | File | Description |
| --- | --- | --- |
| `/` | `src/app/page.js` | Main landing page |
| `/dashboard` | `src/app/dashboard/page.js` | Live monitoring dashboard |
| `/documentation` | `src/app/documentation/page.js` | Documentation page |
| `/login` | `src/app/login/page.js` | Login UI |
| `/register` | `src/app/register/page.js` | Registration UI |
| `/privacy-policy` | `src/app/privacy-policy/page.js` | Privacy policy content |
| `/terms-and-conditions` | `src/app/terms-and-conditions/page.js` | Terms and conditions content |

## 3. High-Level Architecture

The app is organized into four main layers:

1. **Pages**

   Page files under `src/app/` define routes and compose components.

2. **Components**

   Components under `src/components/` contain the reusable UI sections for layout, landing page, and dashboard.

3. **Hooks**

   Hooks under `src/hooks/` contain the tracking logic for keyboard, mouse, webcam, and session duration.

4. **Services**

   Services under `src/services/` contain utility functions such as building a structured session payload.

## 4. Home Page Explanation

The home page is defined in:

```text
src/app/page.js
```

It renders these sections:

- `Navbar`
- `HeroSection`
- `WhatWeMeasureSection`
- `HowItWorksSection`
- `PrivacySection`
- `ConsentSection`
- `CTASection`
- `Footer`

### Hero Section

The hero section introduces NeuroTrack as a cognitive load and mental fatigue analysis platform. It includes calls to action for starting a session and viewing documentation.

### What We Measure Section

This section explains the three main signal groups:

- Keyboard metrics.
- Mouse metrics.
- Facial fatigue-related indicators.

### How It Works Section

This section describes the workflow:

1. Start session.
2. Collect signals.
3. Process features.
4. Analyze patterns.
5. Generate insights.

### Privacy Section

This section explains what the app collects and what it does not store.

### Consent Section

This section explains that users control the tracking session and that webcam access requires explicit permission.

## 5. Dashboard Page Explanation

The dashboard is defined in:

```text
src/app/dashboard/page.js
```

This is the main live monitoring interface.

### Dashboard State

The dashboard manages three main state values:

```js
const [sessionActive, setSessionActive] = useState(false);
const [keyboardTracking, setKeyboardTracking] = useState(false);
const [mouseTracking, setMouseTracking] = useState(false);
```

- `sessionActive` controls whether the whole session is running.
- `keyboardTracking` controls keyboard status display.
- `mouseTracking` controls mouse status display.

### Start Session

When the user starts a session:

```js
const startSession = () => {
  setSessionActive(true);
  setKeyboardTracking(true);
  setMouseTracking(true);
};
```

This activates the hooks and updates the UI to show that monitoring is running.

### Stop Session

When the user stops a session:

```js
const stopSession = () => {
  setSessionActive(false);
  setKeyboardTracking(false);
  setMouseTracking(false);
  sessionTimer.resetTimer();
};
```

This stops active tracking and resets the timer.

## 6. Tracking Hooks

The dashboard uses four custom hooks.

### 6.1 `useKeyboardTracker`

File:

```text
src/hooks/useKeyboardTracker.js
```

Purpose:

Tracks keyboard activity during an active session.

Metrics returned:

- `totalKeystrokes`
- `backspaceCount`
- `typingSpeed`
- `averageInterval`

How it works:

- Adds a `keydown` event listener when tracking starts.
- Counts every key press.
- Counts `Backspace` separately.
- Measures time between key presses.
- Calculates typing speed based on elapsed minutes.
- Removes the event listener when tracking stops.

### 6.2 `useMouseTracker`

File:

```text
src/hooks/useMouseTracker.js
```

Purpose:

Tracks mouse movement, clicking, distance, speed, and idle time.

Metrics returned:

- `x`
- `y`
- `clickCount`
- `totalDistance`
- `movementSpeed`
- `idleTime`

How it works:

- Adds `mousemove` and `click` event listeners when tracking starts.
- Stores the previous mouse position.
- Calculates distance between the previous and current mouse position.
- Calculates movement speed from distance and time difference.
- Tracks idle time every second.
- Removes listeners and intervals when tracking stops.

### 6.3 `useSessionTimer`

File:

```text
src/hooks/useSessionTimer.js
```

Purpose:

Tracks session duration.

Values returned:

- `seconds`
- `formattedTime`
- `resetTimer`

How it works:

- Starts a one-second interval when the session is running.
- Increments elapsed seconds.
- Formats time as `HH:MM:SS`.
- Provides a reset function used when the session stops.

### 6.4 `useWebcamTracker`

File:

```text
src/hooks/useWebcamTracker.js
```

Purpose:

Requests webcam access and tracks camera-related session metrics.

Metrics returned:

- `permissionGranted`
- `cameraActive`
- `snapshotCount`
- `lastCaptureTime`

How it works:

- Requests camera access through `navigator.mediaDevices.getUserMedia`.
- Marks permission and camera status when access is granted.
- Increments a snapshot counter every 30 seconds.
- Stops camera tracks during cleanup.
- Resets webcam metrics when tracking stops.

## 7. Behavioral Insights

The dashboard derives readable labels from the raw metrics.

### Typing Activity

Based on total keystrokes:

- More than 100 keystrokes: `High`
- More than 30 keystrokes: `Moderate`
- Otherwise: `Low`

### Correction Frequency

Based on backspace count:

- More than 20 backspaces: `High`
- More than 5 backspaces: `Moderate`
- Otherwise: `Low`

### Mouse Engagement

Based on click count:

- More than 20 clicks: `High`
- More than 5 clicks: `Moderate`
- Otherwise: `Low`

### Inactivity Level

Based on idle time:

- More than 30 seconds idle: `High`
- More than 10 seconds idle: `Moderate`
- Otherwise: `Low`

These labels are display-level insights. They do not change the raw metrics.

## 8. Session Payload Builder

File:

```text
src/services/sessionPayloadBuilder.js
```

Purpose:

Builds a structured payload from the current session state.

The payload includes:

- Timestamp.
- Session duration.
- Keyboard metrics.
- Mouse metrics.
- Webcam metrics.

Example shape:

```js
{
  timestamp: "...",
  session: {
    durationSeconds: 60,
    durationFormatted: "00:01:00"
  },
  keyboard: {
    totalKeystrokes: 120,
    backspaceCount: 8,
    typingSpeed: 100,
    averageInterval: 250
  },
  mouse: {
    positionX: 450,
    positionY: 300,
    clickCount: 12,
    totalDistance: 840,
    movementSpeed: "0.42",
    idleTime: 3
  },
  webcam: {
    permissionGranted: true,
    cameraActive: true,
    snapshotCount: 2,
    lastCaptureTime: "10:30:00 AM"
  }
}
```

## 9. Dashboard Components

Dashboard components are stored in:

```text
src/components/dashboard/
```

Important components:

- `DashboardHeader.js`: Main dashboard title, session status, and timer display.
- `SessionControls.js`: Start, stop, and report buttons.
- `CurrentActivity.js`: Shows live state of session, keyboard, mouse, and camera.
- `KeyboardMetrics.js`: Displays keyboard metric cards.
- `MouseMetrics.js`: Displays mouse metric cards.
- `WebcamMetrics.js`: Displays webcam permission and activity metrics.
- `FatigueAnalysis.js`: Shows the fatigue analysis status panel.
- `LiveWebcamPreview.js`: Shows webcam preview or waiting state.
- `PayloadPreview.js`: Displays a JSON payload preview when used.
- `SessionDuration.js`: Displays session duration when used.
- `TrackingStatus.js`: Displays tracking states when used.

## 10. UI and Design System

The global design system is defined in:

```text
src/app/globals.css
```

It contains:

- CSS variables for colors and spacing.
- Reusable card styles.
- Button styles.
- Form styles.
- Status indicators.
- Focus-visible accessibility styles.
- Reduced motion support.
- Optional dark theme tokens.

Important utility classes:

| Class | Purpose |
| --- | --- |
| `app-shell` | Page background wrapper |
| `app-container` | Consistent max-width layout container |
| `app-section` | Consistent vertical section spacing |
| `surface-card` | Main reusable card surface |
| `metric-card` | Reusable dashboard metric card |
| `btn-primary` | Primary action button |
| `btn-secondary` | Secondary action button |
| `btn-danger` | Destructive or stop action button |
| `status-pill` | Compact status label |
| `status-dot` | Visual active/inactive indicator |
| `legal-prose` | Readable legal/content page formatting |

## 11. Accessibility Considerations

The app includes several accessibility improvements:

- Form labels are connected to inputs through `htmlFor` and `id`.
- Invalid fields use `aria-invalid`.
- Error messages use `aria-describedby`.
- Error messages use `role="alert"`.
- Decorative icons use `aria-hidden="true"`.
- Navigation uses semantic `nav` elements with `aria-label`.
- Focus states are visible through global `:focus-visible` styling.
- Reduced motion preferences are respected with `prefers-reduced-motion`.

## 12. Privacy Behavior

The current frontend implementation is designed around user control:

- Tracking starts only when the user clicks Start Analysis.
- Tracking stops when the user clicks Stop Session.
- Webcam access is requested through the browser permission prompt.
- Camera tracks are stopped during cleanup.
- Webcam video and images are not stored by the frontend.

## 13. Styling and Theme Notes

The app uses a light theme by default. Dark theme tokens exist but are opt-in through:

```html
<html data-theme="dark">
```

This avoids accidental browser or operating system dark mode changes that could reduce contrast on light surfaces.

## 14. Development Workflow

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Create production build:

```bash
npm run build
```

Run production build:

```bash
npm run start
```

## 15. Current Limitations

- Login and registration currently log form data to the console.
- The dashboard is frontend-only and does not persist session data.
- Webcam tracking currently records permission/activity state and snapshot timing, not stored image data.
- The fatigue analysis panel is a presentation layer that indicates collection and pending output.
- The report download button is currently presentational unless connected to export logic later.

## 16. Future Enhancement Ideas

- Add persisted session history.
- Add exportable PDF or JSON reports.
- Connect dashboard data to a backend prediction model.
- Add charts for typing speed, mouse activity, and fatigue trends.
- Add user authentication and protected dashboard access.
- Add settings for privacy preferences and tracking permissions.
- Add an explicit UI toggle for dark theme.

## 17. Summary

NeuroTrack AI demonstrates how cognitive load and mental fatigue indicators can be collected from live interaction signals and presented in a professional dashboard. The project combines a clear product landing page, real-time tracking hooks, accessible UI components, and a reusable design system.
