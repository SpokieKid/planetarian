# Planetary Pet (Project Planetarian)

A simple web-based game prototype where you nurture your own planet through different societal stages (International, Global, Planetary).

This project is based on the concepts outlined in the Aaros #4 Article and associated design documents.

## Features (Phase 1 - Hackathon Goal)

*   Choose starting mode (International, Global, Planetary).
*   Basic planet visualization using Pixi.js.
*   Resource tracking (Water, Light, Air, Ideas).
*   Time-based growth points accumulation influenced by the chosen mode.
*   Simple environmental changes based on mode.
*   Triggering of basic narrative events.
*   Adding resources through UI interaction.
*   State management with Zustand (persisted to localStorage).

## Tech Stack

*   React (via Vite)
*   Zustand (State Management)
*   Pixi.js (2D Rendering)
*   CSS

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, usually at `http://localhost:5173`.

## Project Structure

```
/planetary-pet
  /public
    /assets         # Placeholder for image/texture assets
      /planets
      /particles
      /backgrounds
  /src
    /components     # React UI components
      PlanetCanvas.jsx
      ResourcePanel.jsx
      StoryEvent.jsx
      *.css
    /hooks          # Custom React hooks (Zustand store)
      usePlanetState.js
    /scenes         # Pixi.js scene logic
      PlanetScene.js
    /utils          # Helper functions & mappings
      resourceMapping.js
      eventTrigger.js
    App.jsx         # Main application component
    main.jsx        # Entry point
    index.css       # Global styles
    App.css         # App-specific styles
  README.md
  package.json
  vite.config.js
  ...
```

## Next Steps (Potential Future Work)

*   Load actual textures for planets and environments.
*   Implement more complex particle effects.
*   Add more diverse narrative events and branching choices.
*   Integrate AI assistant concepts.
*   Connect to blockchain for NFT minting or on-chain state.
*   Refine UI/UX and visual styling.
*   Deploy to Farcaster Frames / Telegram MiniApp.
