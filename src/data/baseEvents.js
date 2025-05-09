export const baseEvents = {
    BASESTONE_01: {
        eventKey: 'BASESTONE_01',
        title: '基石',
        image: '/assets/events/Basestone.jpg', 
        nextEventKey: 'BASE_LADDER_02',
        narrativePages: [
            "在金融危机后的余波中，一种全新的数字曙光开始在地平线闪耀 —— 比特币开启了去中心化账本的纪元。",
            "少数富有远见的人们开始关注其底层技术，构思一个更强大、更灵活的底层技术平台，一个能够承载未来无数去中心化应用的\"基石\"。",
            "在这个充满潜力的萌芽阶段，文明面临一个关键选择：",
            "是强调这项技术的革命性本质，将其视为构建一个全新、去中心化赛博\"新大陆\"的力量，还是侧重于通过更易于被接受的中心化平台来推广和使用它，从而加速普及？"
        ],
        options: [
            {
                id: 'A',
                emoji: '🛠️',
                description_zh: '汇聚并强化对\"底层协议\"和\"技术平台\"概念的关注，引导赛博意识理解其构建通用、可组合应用的巨大潜力。',
                success: {
                    probability: 75,
                    result_zh: '区块链技术的潜力吸引了许多开发者和密码朋克群体。围绕早期区块链技术以及对其扩展性提出构想的讨论日益热烈，技术社区和贡献者快速聚集在一些特定的咖啡厅里。',
                    hashtag_zh: '#底层技术 #构建者 #开放协议 #早期生态 #思想萌芽',
                    karmaChange: 7,
                },
                failed: {
                    result_zh: '技术过于抽象，并没有激发广泛的建设热情。人们更多停留在利用已有工具和简单应用层面，对构建更宏大、更基础架构的认知未得到充分讨论。',
                    hashtag_zh: '#技术抽象 #建设缓慢 #浅层应用 #认知不足',
                    karmaChange: -3,
                },
            },
            {
                id: 'B',
                emoji: '🏢',
                description_zh: '安抚对新技术的陌生感，强调通过现有、可靠的中心化平台来接触和使用早期链上资产和基本功能。',
                success: {
                    probability: 80,
                    result_zh: '这些中心化平台降低了学习门槛，更多普通用户开始通过信誉良好的平台接触到早期加密资产，为未来更复杂的链上交互培养了基础用户基数和习惯。',
                    hashtag_zh: '#用户友好 #中心化过渡 #早期采用 #习惯培养',
                    karmaChange: 5,
                },
                failed: {
                    result_zh: '过于强调通过中心化入口接入，让用户更习惯于依赖中心化平台，这在无形中强化了中心化思维，使得很多用户对完全去中心化用户主权认知不足。',
                    hashtag_zh: '#平台依赖 #中心化思维 #主权缺失 #认知固化',
                    karmaChange: -2,
                },
            },
            {
                id: 'C',
                emoji: '💰',
                description_zh: '突出早期技术发展中蕴含的\"数字黄金\"或\"新兴资产\"叙事，导引早期用户关注基于新协议产生的早期代币和资产的投资增值潜力。',
                success: {
                    probability: 70,
                    result_zh: '更多关注资产增值的人们开始关注并探索投资基于新技术协议的早期代币。资本开始流入这个新兴领域，为技术项目带来早期资金支持，但也伴随极高的风险和投机色彩。',
                    hashtag_zh: '#数字黄金 #资产叙事 #早期投资 #风险与机遇',
                    karmaChange: 2,
                },
                failed: {
                    result_zh: '投机热情未能被底层技术发展所支撑，早期代币市场剧烈波动甚至崩盘，人们将其仅仅视为一种高风险赌博。',
                    hashtag_zh: '#投机泡沫 #市场崩盘 #高风险 #价值缺失',
                    karmaChange: -4,
                },
            },
            {
                id: 'D',
                emoji: '🔗',
                description_zh: '强调新技术具备的\"开放性\"和\"无许可\"特性，导引关注用户可以直接与早期协议互动、创建个人数字身份和资产的可能性。',
                success: {
                    probability: 65,
                    result_zh: '一部分先锋用户开始大胆探索直接与早期链上协议交互。他们尝试创建并管理自己的链上身份，体验资产的直接转移和基本智能合约的调用。这股力量推动了早期钱包工具和直接交互界面的发展，也催生了很多早期类似 DAO 组织的萌芽。',
                    hashtag_zh: '#开放协议 #无许可交互 #数字身份 #DAO萌芽',
                    karmaChange: 6,
                },
                failed: {
                    result_zh: '早期直接与协议交互的门槛高，工具简陋，且风险巨大，去中心化实践的尝试显得孤立且困难，用户对自身数字主权的感知并未普遍觉醒。',
                    hashtag_zh: '#高门槛 #工具匮乏 #孤立实践 #主权意识弱',
                    karmaChange: -1,
                },
            },
        ],
    },
    BASE_LADDER_02: {
        eventKey: 'BASE_LADDER_02',
        title: '阶梯',
        image: '/assets/events/ladder.jpg',
        nextEventKey: 'BASE_GIANT_03',
        narrativePages: [
            "在早期技术探索和概念萌芽之后，区块链技术生态迎来了一个快速的膨胀期，随之而来的是链上活动边界以前所未有的速度扩张。",
            "中心化交易所在这波浪潮中扮演了关键角色，它们提供的便捷入口让数百万新用户得以触碰这个新兴的数字世界。",
            "这段加速的生长螺旋为未来的链上经济体打下了基础，但其发展路径充满了矛盾。",
            "这种爆炸性的增长是链上经济迈向大规模采用的必经之路，还是一次去中心化的停滞？"
        ],
        options: [
            {
                id: 'A',
                emoji: '🚀',
                description_zh: '汇聚并强化中心化平台作为用户"飞速增长的阶梯"的叙事，突出其在降低门槛、引入新用户、加速链上资产流动方面的贡献。',
                success: {
                    probability: 55,
                    result_zh: '更多传统领域的目光被吸引，资金和人才持续涌入。这种广泛的接受度为未来大规模采用提供了巨大便利。',
                    hashtag_zh: '#增长阶梯 #用户涌入 #传统关注 #大规模采用',
                    karmaChange: 5,
                },
                failed: {
                    probability: 45,
                    result_zh: '对中心化风险的警告未能引起广泛关注。用户为了便捷和市场机会，忽略了潜在的危险，甚至相信"大而不倒"的神话。直到一些巨头平台突然崩溃，用户资产化为乌有，才血淋淋地揭示了过度依赖中心化平台的巨大风险。',
                    hashtag_zh: '#中心化风险 #大而不倒 #平台崩溃 #资产损失',
                    karmaChange: -25,
                },
            },
            {
                id: 'B',
                emoji: '🔬',
                description_zh: '引导集体关注 Layer 1 生态和早期 Layer 2 构想背后的技术创新和实际应用进展，强调长期价值构建而非短期代币价格。',
                success: {
                    probability: 60,
                    result_zh: '一部分关注者开始深入研究可拓展性方案的技术原理。一些致力于构建实际应用和基础设施的团队获得更多关注和资源倾斜。',
                    hashtag_zh: '#价值构建 #技术创新 #L1L2 #基础设施',
                    karmaChange: 4,
                },
                failed: {
                    probability: 40,
                    result_zh: '价值构建的叙事未能有效改变市场对短期财富效应的追逐。非理性的投机活动继续主导市场，技术和应用层面的实际进展被噪音所掩盖。',
                    hashtag_zh: '#短期投机 #市场噪音 #价值被忽视',
                    karmaChange: -6,
                },
            },
            {
                id: 'C',
                emoji: '🛡️',
                description_zh: '突出中心化交易平台在数据垄断和资产托管方面的"潜在风险"叙事，激发对去中心化替代方案的需求和思考。',
                success: {
                    probability: 85,
                    result_zh: '部分用户和社区开始认识到将资产和个人数据完全托管在中心化平台上的风险。自托管钱包、去中心化借贷、去中心化 Swap 等 DeFi 需求逐渐增加。',
                    hashtag_zh: '#风险意识 #去中心化需求 #自托管 #DeFi萌芽',
                    karmaChange: 15,
                },
                failed: {
                    probability: 15,
                    result_zh: '早期涌现的各类 DeFi 项目，由于审计不足、智能合约漏洞或团队恶意行为，频繁发生资产被盗、合约被攻击甚至项目方直接"跑路"的事件。 这种混乱和风险使得许多用户对去中心化失去了信任，甚至对整个链上经济体感到失望。',
                    hashtag_zh: '#DeFi乱象 #项目跑路 #信任危机 #安全漏洞',
                    karmaChange: -5,
                },
            },
            {
                id: 'D',
                emoji: '💸',
                description_zh: '强调早期市场的"财富效应"叙事，聚焦于通过参与 ICO 和早期项目可能带来的经济回报，鼓励更多人进入市场分享利益。',
                success: {
                    probability: 50,
                    result_zh: '大量逐利资金和新用户被市场的财富效应吸引。一些新兴协议获得了充裕的资金支持和前所未有的关注。',
                    hashtag_zh: '#财富效应 #ICO热潮 #资金涌入 #市场关注',
                    karmaChange: 20,
                },
                failed: {
                    probability: 50,
                    result_zh: '过度强化的财富效应未能转化为可持续的发展动力。非理性的炒作迅速破灭，市场经历剧烈回调，许多后期进入者遭受重大损失，更有甚者开始寻求短见。',
                    hashtag_zh: '#泡沫破裂 #市场回调 #投资损失 #非理性炒作',
                    karmaChange: -20,
                },
            },
        ],
    },
    BASE_GIANT_03: {
        eventKey: 'BASE_GIANT_03',
        title: '巨头的彷徨',
        image: '/assets/events/event3.jpg',
        era: 2,
        turns: 9,
        nextEventKey: 'BASE_SPRING_04',
        narrativePages: [
            "CoinDock 已然成为连接传统金融世界与新兴加密宇宙的标志性桥梁。",
            "然而，体量的庞大和中心化的结构也带来了成长的烦恼：",
            "日益严格的全球监管、与以太坊生态蓬勃发展的 DeFi、NFT 等去中心化趋势的理念碰撞。",
            "在这个十字路口，CoinDock 应更倾向于成为一个高效但受限的传统金融改良者，",
            "还是勇敢地投入资源，在以太坊和 Optimism 等基石之上，构建更具去中心化精神的 Layer 2 网络，从而深刻塑造未来星球化链上经济体的版图？"
        ],
        options: [
            {
                id: 'A',
                emoji: '🔄',
                description_zh: '汇聚并强化"中心化平台的局限性"和"链上原生潜力"叙事，引导星球文明关注以太坊生态（如 DeFi、NFT）的创新活力与 CoinDock 现有模式的脱节，暗示 CoinDock 需要进行更深层的链上转型。',
                success: { probability: 80, result_zh: '受CoinDock 加速对以太坊 L2 技术，尤其是与 Optimism 等的潜在合作进行研究和决策，Base 网络的构建计划获得更有利的土壤。', hashtag_zh: '#链上转型 #L2加速 #Base网络 #生态合作', karmaChange: 7 },
                failed: { probability: 20, result_zh: '"链上原生潜力" 叙事未能有效穿透巨头的惯性壁垒。CoinDock 更倾向于在现有框架内进行修补，而非战略性投入去中心化基础设施建设。', hashtag_zh: '#惯性壁垒 #转型缓慢 #保守策略', karmaChange: -5 },
            },
            {
                id: 'B',
                emoji: '🏦',
                description_zh: '突出 CoinDock 作为"可信中介"在简化用户体验、保障安全方面的优势，暗示其可以在现有模式下逐步整合部分链上功能。',
                success: { probability: 75, result_zh: '公司专注于在现有平台内引入简单的链上功能或展示链上活动，虽然没有完全拥抱去中心化，但也稳定了用户群体，为链上活动提供了潜在用户池。', hashtag_zh: '#可信中介 #体验优化 #用户稳定 #渐进整合', karmaChange: 2 },
                failed: { probability: 25, result_zh: '中心化平台的安全性受到用户质疑，用户对"不持有私钥就不拥有资产"的担忧加剧，更具风险意识的用户转向完全去中心化的替代方案。', hashtag_zh: '#安全质疑 #用户流失 #信任危机', karmaChange: -2 },
            },
            {
                id: 'C',
                emoji: '🌐',
                description_zh: '突出构建 Base 的战略必要性和潜在优势，导引集体意识理解 CoinDock 在以太坊之上构建自主可控、同时服务海量用户的"全球链上经济体"的宏大愿景。',
                success: { probability: 90, result_zh: 'CoinDock 内部构建基于以太坊和 Optimism 技术栈的 Layer 2 网络 —— Base 的战略获得了强大支持。高层决策者坚定地推动资源投入，与以太坊和 Optimism 生态的合作关系得以深化。', hashtag_zh: '#Base战略 #全球链上经济 #L2自主 #强大支持', karmaChange: 20 },
                failed: { probability: 10, result_zh: '由于一些声音的质疑，构建自身 L2 的 Narrative 未能完全克服内部的疑虑和外部的挑战。决策过程缓慢，资源投入不足，Base 网络的建设未能按预期推进。', hashtag_zh: '#内部疑虑 #推进缓慢 #资源不足', karmaChange: -5 },
            },
            {
                id: 'D',
                emoji: '🤝',
                description_zh: '强调与以太坊生态中现有 Layer 2 方案（尤其是 Optimism）的"合作共赢"叙事，导引关注通过联盟和集成，而非独立构建，来拥抱 Layer 2 的可能性。',
                success: { probability: 65, result_zh: 'CoinDock 更倾向于加强与以太坊生态中领先 Layer 2 方案的技术集成和生态合作。双方共享资源和技术，共同推动 Layer 2 的发展，形成更为紧密的生态联盟。', hashtag_zh: '#合作共赢 #L2联盟 #生态集成 #技术共享', karmaChange: 15 },
                failed: { probability: 35, result_zh: '"合作共赢"的叙事未能完全阻止 CoinDock 内部对独立构建的渴望或外部的竞争。合作进展缓慢或遇到阻碍，未能充分利用与现有 L2 的协同效应。', hashtag_zh: '#合作受阻 #独立渴望 #协同不足', karmaChange: -3 },
            },
        ],
    },
    BASE_SPRING_04: {
        eventKey: 'BASE_SPRING_04',
        title: '石上之春',
        image: '/assets/events/event4.jpg',
        era: 3,
        turns: 21,
        nextEventKey: null,
        narrativePages: [
            "Base 沐浴着 Layer 2 技术的滋养，在全球链上经济迈向\"星球化\"之际 ，迎来了应用的爆发期，链上活力如野草般在石上蔓延。",
            "链上 Social、链上游戏、去中心化身份，甚至早期的 Agent 经济体，以前所未有的速度涌现，塑造着全新的数字生态。",
            "在这场\"Base 之春\"的繁荣之下，文明需要理解其深层意义。",
            "是歌颂这些涌现的创新，它们如何赋能个体、重塑社会经济，带来自由与创造力？还是审视伴随而来的复杂性？"
        ],
        options: [
            {
                id: 'A',
                emoji: '🎉',
                description_zh: '强调链上涌现创新和链上社会重塑的积极叙事，突出 Base 生态在赋能个体、连接社群和创造新价值形态方面的贡献。',
                success: { probability: 80, result_zh: '赛博意识开始理解并认同链上创新带来的自由、创造力，激发了更大范围的参与和实践热情。全新的链上生产关系和价值流转模式出现。探索者们积极参与到链上原生经济活动中，探索全新的链上生产关系和价值流转模式，显著推动了链上 GDP 的增长。', hashtag_zh: '#链上创新 #个体赋能 #新价值 #GDP增长', karmaChange: 15 },
                failed: { probability: 20, result_zh: '过于强调积极面导致对潜在风险和问题的忽视。非理性繁荣掩盖了早期 Agent 经济体等的复杂性和漏洞，为未来的泡沫破裂和信任危机埋下隐患。', hashtag_zh: '#风险忽视 #非理性繁荣 #泡沫隐患', karmaChange: -10 },
            },
            {
                id: 'B',
                emoji: '🤔',
                description_zh: '引导文明审慎看待这场涌现，聚焦于 Agent 经济体和未知应用带来的复杂性、不确定性和潜在风险。',
                success: { probability: 50, result_zh: '集体意识形成了更健康的风险意识，对新兴链上应用的盲目乐观情绪得到抑制。用户和开发者更加注重安全审计、合约稳健性以及 Agent 交互的潜在问题，推动生态更稳健地发展。', hashtag_zh: '#风险意识 #审慎发展 #安全审计 #生态稳健', karmaChange: 5 },
                failed: { probability: 50, result_zh: '过度强调风险和不确定性未能有效阻止市场的投机狂热，用户主要出于经济回报目的进入生态，对需要深度参与的消费级应用缺乏耐心和兴趣。审慎的叙事未能激发投机热情，也没有培养出真正的用户，导致整个生态的活跃度下降，未能如预期般推动链上经济体的发展。', hashtag_zh: '#投机主导 #用户流失 #生态降温', karmaChange: -8 },
            },
            {
                id: 'C',
                emoji: '🏗️',
                description_zh: '强调这场涌现所依赖的链上基础设施的重要性，呼吁持续投入技术研发和维护，为上层应用构建更坚实的基础。',
                success: { probability: 75, result_zh: '对基础设施的重视促使更多资源流向底层技术研究和协议优化。Base 网络本身和相关的 Layer 2 技术得到进一步巩固和发展，增强了生态的长期可持续性和可扩展性。', hashtag_zh: '#基建为王 #技术巩固 #协议优化 #长期发展', karmaChange: 10 },
                failed: { probability: 25, result_zh: '过度关注基础设施建设导致对应用创新和用户体验的忽视，Base 网络开始变得与其他 Layer 2 高度雷同。尽管基础设施在理论上得到提升，生态失去了原有的特色和吸引力，Base 和其他 278 条 Layer 2 中的数百条没有太大的区别，"泯然众人矣"。', hashtag_zh: '#创新不足 #体验忽视 #生态同质化 #泯然众人', karmaChange: -5 },
            },
            {
                id: 'D',
                emoji: '👨‍👩‍👧‍👦',
                description_zh: '引导关注涌现生态背后形成的独特链上文化和社群力量，强调其在凝聚共识、推动协作和构建共享价值观方面的作用。',
                success: { probability: 70, result_zh: '文化和社群的凝聚力得到强化。基于共同兴趣和价值观的去中心化社群更加活跃，他们通过链上协作推动项目发展、创造大量全球性一流应用，形成强大的内生驱动力和网络效应，链上原生经济活动进一步繁荣。', hashtag_zh: '#文化凝聚 #社群力量 #协作创新 #网络效应', karmaChange: 12 },
                failed: { probability: 30, result_zh: '仅强调文化和社群可能导致对技术和经济基础的忽视。脱离实际技术和经济支撑，文化和社群的热情难以持久，最终可能演变为虚假的狂欢甚至内部分裂，无法真正支撑链上资本的有效再生和增值。', hashtag_zh: '#空中楼阁 #热情退却 #经济基础薄弱', karmaChange: -7 },
            },
        ],
    },
    // ... more Base planet events can be added here
}; 