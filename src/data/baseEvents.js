export const baseEvents = {
    BASESTONE_01: {
        eventKey: 'BASESTONE_01',
        title: 'baseEvents.BASESTONE_01.title',
        image: '/assets/events/Basestone.jpg', 
        nextEventKey: 'BASE_LADDER_02',
        turns: [1],
        narrativePages: [
            "baseEvents.BASESTONE_01.narrativePages.0",
            "baseEvents.BASESTONE_01.narrativePages.1",
            "baseEvents.BASESTONE_01.narrativePages.2",
            "baseEvents.BASESTONE_01.narrativePages.3"
        ],
        options: [
            {
                id: 'A',
                emoji: '🛠️',
                description_key: 'baseEvents.BASESTONE_01.options.A.description',
                success: {
                    probability: 75,
                    result_key: 'baseEvents.BASESTONE_01.options.A.success.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.A.success.hashtag',
                    karmaChange: 7,
                },
                failed: {
                    result_key: 'baseEvents.BASESTONE_01.options.A.failed.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.A.failed.hashtag',
                    karmaChange: -3,
                },
            },
            {
                id: 'B',
                emoji: '🏢',
                description_key: 'baseEvents.BASESTONE_01.options.B.description',
                success: {
                    probability: 80,
                    result_key: 'baseEvents.BASESTONE_01.options.B.success.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.B.success.hashtag',
                    karmaChange: 5,
                },
                failed: {
                    result_key: 'baseEvents.BASESTONE_01.options.B.failed.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.B.failed.hashtag',
                    karmaChange: -2,
                },
            },
            {
                id: 'C',
                emoji: '💰',
                description_key: 'baseEvents.BASESTONE_01.options.C.description',
                success: {
                    probability: 70,
                    result_key: 'baseEvents.BASESTONE_01.options.C.success.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.C.success.hashtag',
                    karmaChange: 2,
                },
                failed: {
                    result_key: 'baseEvents.BASESTONE_01.options.C.failed.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.C.failed.hashtag',
                    karmaChange: -4,
                },
            },
            {
                id: 'D',
                emoji: '🔗',
                description_key: 'baseEvents.BASESTONE_01.options.D.description',
                success: {
                    probability: 65,
                    result_key: 'baseEvents.BASESTONE_01.options.D.success.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.D.success.hashtag',
                    karmaChange: 6,
                },
                failed: {
                    result_key: 'baseEvents.BASESTONE_01.options.D.failed.result',
                    hashtag_key: 'baseEvents.BASESTONE_01.options.D.failed.hashtag',
                    karmaChange: -1,
                },
            },
        ],
    },
    BASE_LADDER_02: {
        eventKey: 'BASE_LADDER_02',
        title: 'baseEvents.BASE_LADDER_02.title',
        image: '/assets/events/ladder.jpg',
        turns: [2],
        nextEventKey: 'BASE_GIANT_03',
        narrativePages: [
            "baseEvents.BASE_LADDER_02.narrativePages.0",
            "baseEvents.BASE_LADDER_02.narrativePages.1",
            "baseEvents.BASE_LADDER_02.narrativePages.2",
            "baseEvents.BASE_LADDER_02.narrativePages.3"
        ],
        options: [
            {
                id: 'A',
                emoji: '🚀',
                description_key: 'baseEvents.BASE_LADDER_02.options.A.description',
                success: {
                    probability: 55,
                    result_key: 'baseEvents.BASE_LADDER_02.options.A.success.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.A.success.hashtag',
                    karmaChange: 5,
                },
                failed: {
                    probability: 45,
                    result_key: 'baseEvents.BASE_LADDER_02.options.A.failed.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.A.failed.hashtag',
                    karmaChange: -25,
                },
            },
            {
                id: 'B',
                emoji: '🔬',
                description_key: 'baseEvents.BASE_LADDER_02.options.B.description',
                success: {
                    probability: 60,
                    result_key: 'baseEvents.BASE_LADDER_02.options.B.success.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.B.success.hashtag',
                    karmaChange: 4,
                },
                failed: {
                    probability: 40,
                    result_key: 'baseEvents.BASE_LADDER_02.options.B.failed.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.B.failed.hashtag',
                    karmaChange: -6,
                },
            },
            {
                id: 'C',
                emoji: '🛡️',
                description_key: 'baseEvents.BASE_LADDER_02.options.C.description',
                success: {
                    probability: 85,
                    result_key: 'baseEvents.BASE_LADDER_02.options.C.success.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.C.success.hashtag',
                    karmaChange: 15,
                },
                failed: {
                    probability: 15,
                    result_key: 'baseEvents.BASE_LADDER_02.options.C.failed.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.C.failed.hashtag',
                    karmaChange: -5,
                },
            },
            {
                id: 'D',
                emoji: '💸',
                description_key: 'baseEvents.BASE_LADDER_02.options.D.description',
                success: {
                    probability: 50,
                    result_key: 'baseEvents.BASE_LADDER_02.options.D.success.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.D.success.hashtag',
                    karmaChange: 20,
                },
                failed: {
                    probability: 50,
                    result_key: 'baseEvents.BASE_LADDER_02.options.D.failed.result',
                    hashtag_key: 'baseEvents.BASE_LADDER_02.options.D.failed.hashtag',
                    karmaChange: -20,
                },
            },
        ],
    },
    BASE_GIANT_03: {
        eventKey: 'BASE_GIANT_03',
        title: 'baseEvents.BASE_GIANT_03.title',
        image: '/assets/events/event3.jpg',
        era: 2,
        turns: [3],
        nextEventKey: 'BASE_SPRING_04',
        narrativePages: [
            "baseEvents.BASE_GIANT_03.narrativePages.0",
            "baseEvents.BASE_GIANT_03.narrativePages.1",
            "baseEvents.BASE_GIANT_03.narrativePages.2",
            "baseEvents.BASE_GIANT_03.narrativePages.3",
            "baseEvents.BASE_GIANT_03.narrativePages.4"
        ],
        options: [
            {
                id: 'A',
                emoji: '🔄',
                description_key: 'baseEvents.BASE_GIANT_03.options.A.description',
                success: { probability: 80, result_key: 'baseEvents.BASE_GIANT_03.options.A.success.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.A.success.hashtag', karmaChange: 7 },
                failed: { probability: 20, result_key: 'baseEvents.BASE_GIANT_03.options.A.failed.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.A.failed.hashtag', karmaChange: -5 },
            },
            {
                id: 'B',
                emoji: '🏦',
                description_key: 'baseEvents.BASE_GIANT_03.options.B.description',
                success: { probability: 75, result_key: 'baseEvents.BASE_GIANT_03.options.B.success.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.B.success.hashtag', karmaChange: 2 },
                failed: { probability: 25, result_key: 'baseEvents.BASE_GIANT_03.options.B.failed.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.B.failed.hashtag', karmaChange: -2 },
            },
            {
                id: 'C',
                emoji: '🌐',
                description_key: 'baseEvents.BASE_GIANT_03.options.C.description',
                success: { probability: 90, result_key: 'baseEvents.BASE_GIANT_03.options.C.success.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.C.success.hashtag', karmaChange: 20 },
                failed: { probability: 10, result_key: 'baseEvents.BASE_GIANT_03.options.C.failed.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.C.failed.hashtag', karmaChange: -5 },
            },
            {
                id: 'D',
                emoji: '🤝',
                description_key: 'baseEvents.BASE_GIANT_03.options.D.description',
                success: { probability: 65, result_key: 'baseEvents.BASE_GIANT_03.options.D.success.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.D.success.hashtag', karmaChange: 15 },
                failed: { probability: 35, result_key: 'baseEvents.BASE_GIANT_03.options.D.failed.result', hashtag_key: 'baseEvents.BASE_GIANT_03.options.D.failed.hashtag', karmaChange: -3 },
            },
        ],
    },
    BASE_SPRING_04: {
        eventKey: 'BASE_SPRING_04',
        title: 'baseEvents.BASE_SPRING_04.title',
        image: '/assets/events/event4.jpg',
        era: 3,
        turns: [4],
        nextEventKey: null,
        narrativePages: [
            "baseEvents.BASE_SPRING_04.narrativePages.0",
            "baseEvents.BASE_SPRING_04.narrativePages.1",
            "baseEvents.BASE_SPRING_04.narrativePages.2",
            "baseEvents.BASE_SPRING_04.narrativePages.3"
        ],
        options: [
            {
                id: 'A',
                emoji: '🎉',
                description_key: 'baseEvents.BASE_SPRING_04.options.A.description',
                success: { probability: 80, result_key: 'baseEvents.BASE_SPRING_04.options.A.success.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.A.success.hashtag', karmaChange: 15 },
                failed: { probability: 20, result_key: 'baseEvents.BASE_SPRING_04.options.A.failed.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.A.failed.hashtag', karmaChange: -10 },
            },
            {
                id: 'B',
                emoji: '🤔',
                description_key: 'baseEvents.BASE_SPRING_04.options.B.description',
                success: { probability: 50, result_key: 'baseEvents.BASE_SPRING_04.options.B.success.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.B.success.hashtag', karmaChange: 5 },
                failed: { probability: 50, result_key: 'baseEvents.BASE_SPRING_04.options.B.failed.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.B.failed.hashtag', karmaChange: -8 },
            },
            {
                id: 'C',
                emoji: '🏗️',
                description_key: 'baseEvents.BASE_SPRING_04.options.C.description',
                success: { probability: 75, result_key: 'baseEvents.BASE_SPRING_04.options.C.success.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.C.success.hashtag', karmaChange: 10 },
                failed: { probability: 25, result_key: 'baseEvents.BASE_SPRING_04.options.C.failed.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.C.failed.hashtag', karmaChange: -5 },
            },
            {
                id: 'D',
                emoji: '👨‍👩‍👧‍👦',
                description_key: 'baseEvents.BASE_SPRING_04.options.D.description',
                success: { probability: 70, result_key: 'baseEvents.BASE_SPRING_04.options.D.success.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.D.success.hashtag', karmaChange: 12 },
                failed: { probability: 30, result_key: 'baseEvents.BASE_SPRING_04.options.D.failed.result', hashtag_key: 'baseEvents.BASE_SPRING_04.options.D.failed.hashtag', karmaChange: -7 },
            },
        ],
    },
    // ... more Base planet events can be added here
}; 