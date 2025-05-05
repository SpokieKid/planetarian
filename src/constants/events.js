// src/constants/events.js

// Centralized event definitions for the game
export const ALL_EVENTS = [
  {
    id: 'evt_001_info_freedom',
    title: 'Information Freedom Act Proposed',
    text: 'A proposal suggests making all non-critical planetary data freely accessible. This could spur innovation but might decrease centralized control.',
    bias: 'positive', // Generally good for Planetary
    conditions: { growthPointsMin: 10 },
    options: [
      {
        text: 'Approve (+2 Ideas, +5 Growth)',
        effect: { resources: { ideas: +2 }, growthPoints: +5, narrative: 'Open data sparks a wave of creativity across the settlements.' }
      },
      {
        text: 'Study Further (-1 Ideas, +2 Growth)',
        effect: { resources: { ideas: -1 }, growthPoints: +2, narrative: 'Caution prevails. You commission further studies on the potential impacts.' }
      },
      {
        text: 'Reject (-3 Ideas)',
        effect: { resources: { ideas: -3 }, narrative: 'The proposal is shelved, maintaining the status quo for information control.' }
      }
    ]
  },
  {
    id: 'evt_002_trade_routes',
    title: 'Open Borders for Trade?',
    text: 'Off-world merchants request permission to establish direct trade routes, bypassing planetary customs. This could increase resource flow but introduces external dependencies.',
    bias: 'mixed',
    conditions: { growthPointsMin: 25 },
    options: [
      {
        text: 'Open Routes (+3 Water, +1 Ideas)',
        effect: { resources: { water: +3, ideas: +1 }, narrative: 'New trade routes flourish, bringing diverse goods and perspectives.' }
      },
      {
        text: 'Regulated Access (+1 Water, +5 Growth)',
        effect: { resources: { water: +1 }, growthPoints: +5, narrative: 'Controlled trade zones are established, balancing opportunity and risk.' }
      },
      {
        text: 'Maintain Borders (-1 Light)',
        effect: { resources: { light: -1 }, narrative: 'Planetary borders remain closed to unregulated external trade.' }
      }
    ]
  },
   {
    id: 'evt_003_energy_crisis',
    title: 'Energy Shortage Looms',
    text: 'Growing settlements strain the existing power infrastructure. Urgent action is needed.',
    bias: 'negative',
    conditions: { growthPointsMin: 40, resources: { light_min: 30 } }, // Example resource condition
    options: [
      {
        text: 'Invest in Renewables (+3 Light, -5 Growth)',
        effect: { resources: { light: +3 }, growthPoints: -5, narrative: 'A long-term investment in sustainable energy begins, causing short-term slowdown.' }
      },
      {
        text: 'Ration Power (-2 Growth)',
        effect: { growthPoints: -2, narrative: 'Temporary power rationing measures are implemented across the planet.' }
      }
    ]
  },
   {
    id: 'evt_004_planetary_network',
    title: 'Planetary Network Upgrade',
    text: 'A breakthrough allows for a decentralized, high-speed communication network across the planet.',
    bias: 'positive',
    conditions: { mode: 'Planetary', growthPointsMin: 50 }, // More likely in Planetary
    options: [
      {
        text: 'Deploy Network (+5 Ideas, +10 Growth)',
        effect: { resources: { ideas: +5 }, growthPoints: +10, narrative: 'Instantaneous, permissionless communication connects every corner of your planet.' }
      }
    ]
  },
  {
    id: 'evt_005_cultural_exchange',
    title: 'Cultural Exchange Initiative',
    text: 'A proposal for fostering deeper cultural understanding between different settlements emerges.',
    bias: 'positive',
    conditions: { growthPointsMin: 60 },
    options: [
      {
        text: 'Fund Initiative (+3 Ideas, +5 Growth)',
        effect: { resources: { ideas: +3 }, growthPoints: +5, narrative: 'Arts and ideas flourish as settlements share their unique traditions.' }
      },
      {
        text: 'Let it develop organically (+1 Ideas)',
        effect: { resources: { ideas: +1 }, narrative: 'Cultural exchange proceeds naturally, without direct intervention.' }
      }
    ]
  },
   // Add more events...
];

// Define the number of events required to trigger the game end
export const EVENTS_TO_FINISH = 5; 