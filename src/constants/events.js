// src/constants/events.js

// Centralized event definitions for the game
export const ALL_EVENTS = [
  {
    id: 'evt_001_info_freedom',
    title: 'event_evt_001_info_freedom_title',
    text: 'event_evt_001_info_freedom_text',
    bias: 'positive', // Generally good for Planetary
    conditions: { growthPointsMin: 10 },
    options: [
      {
        text: 'event_evt_001_info_freedom_option_1_text',
        effect: { resources: { ideas: +2 }, growthPoints: +5, narrative: 'event_evt_001_info_freedom_option_1_narrative' }
      },
      {
        text: 'event_evt_001_info_freedom_option_2_text',
        effect: { resources: { ideas: -1 }, growthPoints: +2, narrative: 'event_evt_001_info_freedom_option_2_narrative' }
      },
      {
        text: 'event_evt_001_info_freedom_option_3_text',
        effect: { resources: { ideas: -3 }, narrative: 'event_evt_001_info_freedom_option_3_narrative' }
      }
    ]
  },
  {
    id: 'evt_002_trade_routes',
    title: 'event_evt_002_trade_routes_title',
    text: 'event_evt_002_trade_routes_text',
    bias: 'mixed',
    conditions: { growthPointsMin: 25 },
    options: [
      {
        text: 'event_evt_002_trade_routes_option_1_text',
        effect: { resources: { water: +3, ideas: +1 }, narrative: 'event_evt_002_trade_routes_option_1_narrative' }
      },
      {
        text: 'event_evt_002_trade_routes_option_2_text',
        effect: { resources: { water: +1 }, growthPoints: +5, narrative: 'event_evt_002_trade_routes_option_2_narrative' }
      },
      {
        text: 'event_evt_002_trade_routes_option_3_text',
        effect: { resources: { light: -1 }, narrative: 'event_evt_002_trade_routes_option_3_narrative' }
      }
    ]
  },
   {
    id: 'evt_003_energy_crisis',
    title: 'event_evt_003_energy_crisis_title',
    text: 'event_evt_003_energy_crisis_text',
    bias: 'negative',
    conditions: { growthPointsMin: 40, resources: { light_min: 30 } }, // Example resource condition
    options: [
      {
        text: 'event_evt_003_energy_crisis_option_1_text',
        effect: { resources: { light: +3 }, growthPoints: -5, narrative: 'event_evt_003_energy_crisis_option_1_narrative' }
      },
      {
        text: 'event_evt_003_energy_crisis_option_2_text',
        effect: { growthPoints: -2, narrative: 'event_evt_003_energy_crisis_option_2_narrative' }
      }
    ]
  },
   {
    id: 'evt_004_planetary_network',
    title: 'event_evt_004_planetary_network_title',
    text: 'event_evt_004_planetary_network_text',
    bias: 'positive',
    conditions: { mode: 'Planetary', growthPointsMin: 50 }, // More likely in Planetary
    options: [
      {
        text: 'event_evt_004_planetary_network_option_1_text',
        effect: { resources: { ideas: +5 }, growthPoints: +10, narrative: 'event_evt_004_planetary_network_option_1_narrative' }
      }
    ]
  },
  {
    id: 'evt_005_cultural_exchange',
    title: 'event_evt_005_cultural_exchange_title',
    text: 'event_evt_005_cultural_exchange_text',
    bias: 'positive',
    conditions: { growthPointsMin: 60 },
    options: [
      {
        text: 'event_evt_005_cultural_exchange_option_1_text',
        effect: { resources: { ideas: +3 }, growthPoints: +5, narrative: 'event_evt_005_cultural_exchange_option_1_narrative' }
      },
      {
        text: 'event_evt_005_cultural_exchange_option_2_text',
        effect: { resources: { ideas: +1 }, narrative: 'event_evt_005_cultural_exchange_option_2_narrative' }
      }
    ]
  },
   // Add more events...
];

// Define the number of events required to trigger the game end
export const EVENTS_TO_FINISH = 5; 