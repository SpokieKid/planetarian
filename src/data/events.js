export const events = {
  Era1_Discovery_Prosperity01: {
    eventKey: "Era1_Discovery_Prosperity01",
    title: "星空的低语",
    era: 1,
    karmaLevel: [1, 200], // Representing the range (71, 90)
    turns: [1, 49], // Representing the range 1-49
    narrative: [
      "在星球文明繁荣的光辉下，探索引擎全速运转。",
      "低维度生命的目光投向更遥远的未知。通过改进的早期天文设备或长距离通讯技术，探测到来自地表之外、甚至可能来自其他星球的重复性、非自然信号。",
      "这些信号极其微弱，难以捕捉，但在持续的监测中显现出某种规律。"
    ],
    conflict:
      `这\"星空的低语\"是宇宙中偶然的能量波动，还是来自未知智能文明的刻意尝试？低维度文明内部，一些人急切地想投入庞大资源进行深入研究和回应，希望建立联系。另一些人则保持警惕，认为任何未知接触都蕴含巨大的风险，主张谨慎分析，甚至隔离信息。你作为星球史学家，感知到这股\"接触未知\"的集体意识正在两极分化。`,
    image: '/assets/events/Prosperity01.png',
    options: [
      {
        id: "A",
        mainText: "推动低维文明中对未知信号积极回应倾向",
        subText: "引导其集体意识聚焦于\"机遇\"、\"宇宙中的潜在盟友\"、\"知识的飞跃\"等概念。",
        hashtag: "#宇宙 #接触 #科技 #高风险 #观念转变", // Combined hashtags for the option branch
        success: {
          probability: 60, // Percentage
          narrative: "研究取得突破，解锁宇宙沟通的初步技术，星球文明的观点出现了巨大冲击。",
          stateChanges: {
            // Define specific state changes later if needed
            // e.g., technology: +10
          },
          karmaChange: 15,
          hashtag: "#突破 #宇宙沟通 #观念冲击", // Specific result hashtag
        },
        failed: {
          probability: 40, // Percentage
          narrative: "研究引发灾难性误解，大量民众纷纷质疑如此高的资金投入大量挤占其他重要领域资源，在舆论压力下星际探索陷入了长期的停滞。",
          stateChanges: {
            // Define specific state changes later if needed
            // e.g., stability: -5
          },
          karmaChange: -15,
          hashtag: "#误解 #资源浪费 #探索停滞", // Specific result hashtag
        },
      },
      {
        id: "B",
        mainText: "强化低维文明中对潜在风险的警惕意识",
        subText: "引导其集体意识关注\"未知威胁\"、\"盲目投入的愚蠢\"、\"保持隔离的安全\"等概念。",
        hashtag: "#谨慎 #隔离 #保守 #规避风险 #错过机遇", // Combined hashtags for the option branch
        success: {
          probability: 60, // Percentage
          narrative: "保守的选择规避了未知风险，保持了现有秩序和发展轨迹。",
          stateChanges: {
             // Define specific state changes later if needed
          },
          karmaChange: 0,
          hashtag: "#风险规避 #维持现状", // Specific result hashtag
        },
        failed: {
          probability: 40, // Percentage
          narrative: `对星空信号的研究被限制在极小范围内，信息遭到压制。低维度文明将注意力重新投向地表内部的发展和竞争。星球上的各文明错失了与更广阔宇宙连接的潜在机遇。`,
          stateChanges: {
             // Define specific state changes later if needed
          },
          karmaChange: -3,
          hashtag: "#信息压制 #机遇错失 #内部竞争", // Specific result hashtag
        },
      },
    ],
    // Note: The 'Result' section from your prompt is incorporated into the Success/Failed outcomes within each option.
  },
  // ... add more events here following the same structure
};

// Function to potentially get an event based on game state (Era, Karma, Turn)
// This is a placeholder for now, the actual logic will be more complex
export const getEligibleEvent = (era, karma, turn) => {
    // Simple example: return the first event if conditions match (partially)
    const event = events.Era1_Discovery_Prosperity01;
    if (
        event.era === era &&
        karma >= event.karmaLevel[0] && karma <= event.karmaLevel[1] &&
        turn >= event.turns[0] && turn <= event.turns[1]
    ) {
        return event;
    }
    // In a real scenario, you would filter through all events in the `events` object
    // and potentially select one randomly from the eligible ones.
    console.warn("No eligible event found for current state:", { era, karma, turn });
    return null; // Or return a default/fallback event
}; 