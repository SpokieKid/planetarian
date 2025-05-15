export const events = {
  Era1_Discovery_Prosperity01: {
    eventKey: "Era1_Discovery_Prosperity01",
    title: "event_Era1_Discovery_Prosperity01_title",
    era: 2,
    karmaLevel: [71, 90],
    turns: [30, 49],
    narrative: "event_Era1_Discovery_Prosperity01_narrative",
    conflict:
      "event_Era1_Discovery_Prosperity01_conflict",
    image: '/assets/events/Prosperity01.png',
    options: [
      {
        id: "A",
        description_zh: "event_Era1_Discovery_Prosperity01_option_A_description_zh",
        description_en: "event_Era1_Discovery_Prosperity01_option_A_description_en",
        hashtag_zh: "#宇宙 #接触 #科技 #高风险 #观念转变",
        hashtag_en: "#Cosmos #Contact #Technology #HighRisk #MindsetShift",
        success: {
          probability: 60,
          result_zh: "event_Era1_Discovery_Prosperity01_option_A_success_result_zh",
          result_en: "event_Era1_Discovery_Prosperity01_option_A_success_result_en",
          stateChanges: {
            // Define specific state changes later if needed
            // e.g., technology: +10
          },
          karmaChange: 15,
          hashtag_zh: "#突破 #宇宙沟通 #观念冲击",
          hashtag_en: "#突破 #宇宙沟通 #观念冲击",
          vfx: "Flow",
        },
        failed: {
          probability: 40,
          result_zh: "event_Era1_Discovery_Prosperity01_option_A_failed_result_zh",
          result_en: "event_Era1_Discovery_Prosperity01_option_A_failed_result_en",
          stateChanges: {
            // Define specific state changes later if needed
            // e.g., stability: -5
          },
          karmaChange: -15,
          hashtag_zh: "#误解 #资源浪费 #探索停滞",
          hashtag_en: "#误解 #资源浪费 #探索停滞",
          vfx: "Discussion",
        },
      },
      {
        id: "B",
        description_zh: "event_Era1_Discovery_Prosperity01_option_B_description_zh",
        description_en: "event_Era1_Discovery_Prosperity01_option_B_description_en",
        hashtag_zh: "#谨慎 #隔离 #保守 #规避风险 #错过机遇",
        hashtag_en: "#Caution #Isolation #Conservative #RiskAversion #MissedOpportunity",
        success: {
          probability: 60,
          result_zh: "event_Era1_Discovery_Prosperity01_option_B_success_result_zh",
          result_en: "event_Era1_Discovery_Prosperity01_option_B_success_result_en",
          stateChanges: {
             // Define specific state changes later if needed
          },
          karmaChange: 0,
          hashtag_zh: "#风险规避 #维持现状",
          hashtag_en: "#风险规避 #维持现状",
          vfx: "n.a",
        },
        failed: {
           probability: 40,
           result_zh: "event_Era1_Discovery_Prosperity01_option_B_failed_result_zh",
           result_en: "event_Era1_Discovery_Prosperity01_option_B_failed_result_en",
           stateChanges: {
              // Define specific state changes later if needed
           },
           karmaChange: 0,
           hashtag_zh: "#信息压制 #机遇错失 #内部竞争",
           hashtag_en: "#信息压制 #机遇错失 #内部竞争",
           vfx: "n.a",
        },
      },
    ],
    // Note: The 'Result' section from your prompt is incorporated into the Success/Failed outcomes within each option.
  },
  // Add new event Era1_Empire_Transcendence01 here
  Era1_Empire_Transcendence01: {
    eventKey: "Era1_Empire_Transcendence01",
    title: "event_Era1_Empire_Transcendence01_title", // Assuming title is handled via i18n
    era: 1,
    karmaLevel: [91, 100], // Range (91, 100)
    turns: 2, // Range 30-49
    narrative: [
      "event_Era1_Empire_Transcendence01_narrative_1",
      // If the narrative has multiple paragraphs in i18n, add more keys here
    ],
    conflict: "event_Era1_Empire_Transcendence01_conflict",
    image: '/assets/events/UnstableFortress.png', // Placeholder image name, confirm actual file path
    options: [
      {
        id: "A",
        mainText: "event_Era1_Empire_Transcendence01_option_A_mainText",
        subText: "", // HTML did not provide subText
        hashtag: "#真实 #暴露 #反抗 #高风险 #代价 #牺牲", // Using zh hashtags
        success: {
          probability: 60,
          narrative: "event_Era1_Empire_Transcendence01_option_A_success_narrative",
          stateChanges: {},
          karmaChange: 10,
          hashtag: "#突破 #宇宙沟通 #观念冲击", // Using zh hashtags
          vfx: "Discussion",
        },
        failed: null, // Option A in HTML only listed a Success outcome
      },
      {
        id: "B",
        mainText: "event_Era1_Empire_Transcendence01_option_B_mainText",
        subText: "", // HTML did not provide subText
        hashtag: "#压制 #稳定 #僵化 #隐患 #表面和平 #未来风险", // Using zh hashtags
        success: {
          probability: 60, // HTML says 60% success for B, but also lists a Failed outcome. Assuming 60% success, 40% failed is implied.
          narrative: "event_Era1_Empire_Transcendence01_option_B_success_narrative",
          stateChanges: {},
          karmaChange: 0,
          hashtag: "#风险规避 #维持现状", // Using zh hashtags
          vfx: "DataWave",
        },
        failed: {
           probability: 40, // Assuming 40% failed based on 60% success
           narrative: "event_Era1_Empire_Transcendence01_option_B_failed_narrative",
           stateChanges: {},
           karmaChange: -7,
           hashtag: "", // HTML did not list hashtags for failed outcome
           vfx: "Discussion", // HTML listed Discussion VFX for failed
        },
      },
    ],
  },
  // ... add more events here following the same structure
};

// Function to potentially get an event based on game state (Era, Karma, Turn)
// This is a placeholder for now, the actual logic will be more complex
export const getEligibleEvent = (era, karma, turn, game_mode) => {
    console.log("[getEligibleEvent] Checking for eligible event with state:", { era, karma, turn, game_mode });
    const eligibleEvents = Object.values(events).filter(event => {
        // Check if era matches (Temporarily disabled)
        // if (event.era !== era) {
        //     return false;
        // }
        // Check if karma level is within range (Temporarily disabled)
        // if (karma < event.karmaLevel[0] || karma > event.karmaLevel[1]) {
        //     return false;
        // }
        // Check if turn is within range
        // Assuming event.turns is [start_turn, end_turn]
        if (turn < event.turns[0] || turn > event.turns[1]) {
             return false;
         }
        // Add check for game_mode if events are mode-specific (optional, based on game design)
        // if (event.gameModes && !event.gameModes.includes(game_mode)) {
        //    return false;
        // }

        console.log("[getEligibleEvent] Found eligible event candidate:", event.eventKey);
        return true;
    });

    // For now, if multiple events are eligible, just return the first one found.
    // In a real scenario, you might add logic for weighted random selection or priority.
    if (eligibleEvents.length > 0) {
        console.log("[getEligibleEvent] Returning eligible event:", eligibleEvents[0].eventKey);
        return eligibleEvents[0];
    } else {
        console.log("[getEligibleEvent] No eligible events found.");
        return null; // Or return a default/fallback event
    }
}; 