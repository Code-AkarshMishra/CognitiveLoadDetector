# NeuroTrack AI

NeuroTrack AI is a Cognitive Load Analyzer and Mental Fatigue Analyzer built with Next.js. It monitors user interaction signals during an active session and presents them in a modern dashboard for focus, workload, and fatigue awareness.

The application uses keyboard activity, mouse behavior, session timing, and privacy-first webcam status indicators to provide real-time behavioral insights. It is designed as a frontend-focused product experience with clean UI, responsive layouts, and accessible controls.

## Features

- Landing page explaining cognitive load analysis, measured signals, workflow, privacy, and consent.
- Real-time dashboard for active monitoring sessions.
- Keyboard metrics including keystrokes, backspaces, typing speed, and average typing interval.
- Mouse metrics including cursor position, click count, movement distance, movement speed, and idle time.
- Session timer with formatted duration.
- Webcam permission and camera activity tracking for fatigue-related feature extraction.
- Behavioral insight cards for typing activity, correction frequency, mouse engagement, and inactivity level.
- Authentication UI pages for login and registration.
- Documentation, Privacy Policy, and Terms & Conditions pages.
- Modern responsive UI with reusable design tokens, card styles, buttons, forms, and focus states.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Lucide React icons
- React Hook Form
- ESLint

## Project Structure

```text
src/
  app/
    dashboard/
      page.js
    documentation/
      page.js
    login/
      page.js
    privacy-policy/
      page.js
    register/
      page.js
    terms-and-conditions/
      page.js
    globals.css
    layout.js
    page.js
  components/
    dashboard/
    home/
    layout/
  hooks/
    useKeyboardTracker.js
    useMouseTracker.js
    useSessionTimer.js
    useWebcamTracker.js
  services/
    sessionPayloadBuilder.js
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home and product overview |
| `/dashboard` | Live cognitive load and fatigue monitoring dashboard |
| `/documentation` | Project documentation page |
| `/login` | Login form UI |
| `/register` | Registration form UI |
| `/privacy-policy` | Privacy Policy page |
| `/terms-and-conditions` | Terms & Conditions page |

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js may start the app on another available port.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs ESLint checks.

## How the Dashboard Works

The dashboard starts in an inactive state. When the user clicks **Start Analysis**, the app enables session tracking and activates the keyboard, mouse, timer, and webcam tracking hooks.

During an active session:

- Keyboard events are counted and converted into typing metrics.
- Mouse movement and clicks are tracked to estimate activity and inactivity.
- The timer increments every second.
- Webcam access is requested and webcam status metrics are updated.
- Derived insight labels are displayed as Low, Moderate, or High based on existing thresholds.

When the user clicks **Stop Session**, tracking is stopped and the session timer is reset.

## Privacy Notes

NeuroTrack is designed around consent and privacy-first presentation:

- Webcam videos are not stored by the current frontend implementation.
- Webcam images are not stored by the current frontend implementation.
- The dashboard displays webcam permission and camera activity state.
- Users control when a session starts and stops.

## Design System

The visual system is defined mainly in `src/app/globals.css`.

It includes:

- Color tokens for background, surfaces, text, borders, primary, success, warning, danger, and accent colors.
- Reusable card styles such as `surface-card` and `metric-card`.
- Button styles such as `btn-primary`, `btn-secondary`, and `btn-danger`.
- Form styles, focus states, status pills, and responsive containers.
- Reduced motion support for accessibility.
- Opt-in dark theme tokens through `html[data-theme="dark"]`.

## Accessibility

The UI includes:

- Semantic page structure.
- Keyboard-visible focus states.
- Labeled form fields.
- `aria-invalid` and `aria-describedby` for form errors.
- `role="alert"` for validation messages.
- Decorative icons hidden from screen readers with `aria-hidden`.
- Responsive layouts that avoid horizontal overflow.

## Build Status

The project has been verified with:

```bash
npm run lint
npm run build
```

## Detailed Explanation

For a deeper technical explanation of architecture, data flow, hooks, components, styling, and privacy behavior, see:

[PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md)
