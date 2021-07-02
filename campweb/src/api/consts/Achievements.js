export class AchievementInfo {
  constructor(index, level, ...targets) {
    this.index = index;
    this.level = level;
    this.targets = targets;
    this.maxLevel = targets.length;
  }

  getLevel(value) {
    for (let i in this.targets.reverse()) {
      if (value >= this.targets[i]) return i + 1;
    }
    return 0;
  }
}

function genArray(size, func) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result[i] = func(i);
  }
  return result;
}

export const achievementImages = {
  IMAGE_ICHI_1_1: 419838,
  IMAGE_ICHI_1_2: 419839,
  IMAGE_ICHI_1_3: 419840,
  IMAGE_ICHI_1_4: 419841,
  IMAGE_ICHI_1_5: 419842,
  IMAGE_ICHI_2_1: 419850,
  IMAGE_ICHI_2_2: 419851,
  IMAGE_ICHI_2_3: 419852,
  IMAGE_ICHI_2_4: 419853,
  IMAGE_ICHI_3_1: 419854,
  IMAGE_ICHI_3_2: 419855,
  IMAGE_ICHI_3_3: 419856,
  IMAGE_ICHI_4_1: 419857,
  IMAGE_ICHI_4_2: 419858,
  IMAGE_ICHI_4_3: 419859,
  IMAGE_ICHI_4_4: 419860,
  IMAGE_ICHI_4_5: 419861,
  IMAGE_ICHI_5_1: 419862,
  IMAGE_ICHI_5_2: 419863,
  IMAGE_ICHI_5_3: 419864,
  IMAGE_ICHI_6: 419865,
  IMAGE_ICHI_7: 419866,
  IMAGE_ICHI_8: 419867,
  IMAGE_ICHI_9: 419868,
  IMAGE_ICHI_10: 419819,
  IMAGE_ICHI_11: 419820,
  IMAGE_ICHI_12: 419821,
  IMAGE_ICHI_13: 419822,
  IMAGE_ICHI_15_1: 419823,
  IMAGE_ICHI_15_2: 419824,
  IMAGE_ICHI_15_3: 419825,
  IMAGE_ICHI_16_1: 419829,
  IMAGE_ICHI_16_2: 419831,
  IMAGE_ICHI_16_3: 419832,
  IMAGE_ICHI_17: 419833,
  IMAGE_ICHI_18: 419834,
  IMAGE_ICHI_19_1: 419835,
  IMAGE_ICHI_19_2: 419836,
  IMAGE_ICHI_19_3: 419837,
  IMAGE_ICHI_20_1: 419843,
  IMAGE_ICHI_20_2: 419844,
  IMAGE_ICHI_20_3: 419845,
  IMAGE_ICHI_21: 419846,
  IMAGE_ICHI_22: 419847,
  IMAGE_ICHI_23: 419848,
  IMAGE_ICHI_24: 419849,
};
export const achievementInfo = {
  ACHI_APP_SHARE: ["achi_share", achievementImages["IMAGE_ICHI_3_2"]],
  ACHI_CONTENT_SHARE: ["achi_content_share", achievementImages["IMAGE_ICHI_3_3"]],
  ACHI_ADD_RECRUITER: ["achi_add_recruiter", achievementImages["IMAGE_ICHI_1_2"]],
  ACHI_ENTERS: ["achi_enters", achievementImages["IMAGE_ICHI_15_2"]],
  ACHI_KARMA_COUNT: ["achi_karma_count", achievementImages["IMAGE_ICHI_20_2"]],
  ACHI_REFERRALS_COUNT: ["achi_referals_count", achievementImages["IMAGE_ICHI_1_3"]],
  ACHI_RATES_COUNT: ["achi_rates_count", achievementImages["IMAGE_ICHI_10"]],
  ACHI_POSTS_COUNT: ["achi_posts_count", achievementImages["IMAGE_ICHI_2_2"]],
  ACHI_POST_KARMA: ["achi_posts_karma_count", achievementImages["IMAGE_ICHI_5_2"]],
  ACHI_COMMENTS_KARMA: ["achi_comments_karma_count", achievementImages["IMAGE_ICHI_4_1"]],
  ACHI_STICKERS_KARMA: ["achi_stickers_karma_count", achievementImages["IMAGE_ICHI_4_2"]],
  ACHI_COMMENTS_COUNT: ["achi_comments_count", achievementImages["IMAGE_ICHI_4_4"]],
  ACHI_LOGIN: ["achi_login", achievementImages["IMAGE_ICHI_17"]],
  ACHI_CHAT: ["achi_chat", achievementImages["IMAGE_ICHI_3_1"]],
  ACHI_COMMENT: ["achi_comment", achievementImages["IMAGE_ICHI_4_2"]],
  ACHI_ANSWER: ["achi_answer", achievementImages["IMAGE_ICHI_4_3"]],
  ACHI_RATE: ["achi_rate", achievementImages["IMAGE_ICHI_1_5"]],
  ACHI_CHANGE_PUBLICATION: ["achi_change_publication", achievementImages["IMAGE_ICHI_2_3"]],
  ACHI_CHANGE_COMMENT: ["achi_change_comment", achievementImages["IMAGE_ICHI_4_5"]],
  ACHI_FIRST_POST: ["achi_first_post", achievementImages["IMAGE_ICHI_2_2"]],
  ACHI_SUBSCRIBE: ["achi_first_follow", achievementImages["IMAGE_ICHI_5_1"]],
  ACHI_TAGS_SEARCH: ["achi_tags_search", achievementImages["IMAGE_ICHI_9"]],
  ACHI_LANGUAGE: ["achi_language", achievementImages["IMAGE_ICHI_24"]],
  ACHI_TITLE_IMAGE: ["achi_title_image", achievementImages["IMAGE_ICHI_8"]],
  ACHI_CREATE_TAG: ["achi_create_tag", achievementImages["IMAGE_ICHI_12"]],
  ACHI_QUESTS: ["achi_quests", achievementImages["IMAGE_ICHI_6"]],
  ACHI_FANDOMS: ["achi_fandoms", achievementImages["IMAGE_ICHI_19_1"]],
  ACHI_RULES_USER: ["achi_rules_user", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RULES_MODERATOR: ["achi_rules_moderator", achievementImages["IMAGE_ICHI_21"]],
  ACHI_FOLLOWERS: ["achi_followers", achievementImages["IMAGE_ICHI_5_3"]],
  ACHI_MODER_CHANGE_POST_TAGS: ["achi_moderators_tags", achievementImages["IMAGE_ICHI_5_3"]],
  ACHI_FIREWORKS: ["achi_50", achievementImages["IMAGE_ICHI_23"]],
  ACHI_MAKE_MODER: ["achi_51", achievementImages["IMAGE_ICHI_21"]],
  ACHI_CREATE_CHAT: ["achi_52", achievementImages["IMAGE_ICHI_13"]],
  ACHI_REVIEW_MODER_ACTION: ["achi_53", achievementImages["IMAGE_ICHI_21"]],
  ACHI_ACCEPT_FANDOM: ["achi_54", achievementImages["IMAGE_ICHI_21"]],
  ACHI_MODERATOR_COUNT: ["achi_55", achievementImages["IMAGE_ICHI_21"]],
  ACHI_MODERATOR_ACTION_KARMA: ["achi_56", achievementImages["IMAGE_ICHI_21"]],
  ACHI_KARMA_30: ["achi_57", achievementImages["IMAGE_ICHI_21"]],
  ACHI_UP_RATES: ["achi_58", achievementImages["IMAGE_ICHI_21"]],
  ACHI_UP_RATES_OVER_DOWN: ["achi_59", achievementImages["IMAGE_ICHI_21"]],
  ACHI_CHAT_SUBSCRIBE: ["achi_60", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RELAY_RACE_FIRST_POST: ["achi_64", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RELAY_RACE_FIRST_NEXT_MEMBER: ["achi_65", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RELAY_RACE_FIRST_CREATE: ["achi_66", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RELAY_RACE_POSTS_COUNT: ["achi_67", achievementImages["IMAGE_ICHI_21"]],
  ACHI_RELAY_RACE_MY_RACE_POSTS_COUNT: ["achi_68", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_ASSIGN: ["achi_69", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_POSTS_COUNT: ["achi_70", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_WIKI_COUNT: ["achi_71", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_KARMA_COUNT: ["achi_72", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_SUBSCRIBERS_COUNT: ["achi_73", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_LINK: ["achi_74", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_IMAGES: ["achi_75", achievementImages["IMAGE_ICHI_21"]],
  ACHI_VICEROY_DESCRIPTION: ["achi_76", achievementImages["IMAGE_ICHI_21"]],
};

export const karmaAchievements = [
  "ACHI_POST_KARMA", "ACHI_COMMENTS_KARMA",
  "ACHI_KARMA_COUNT", "ACHI_KARMA_30",
  "ACHI_MODERATOR_ACTION_KARMA", "ACHI_STICKERS_KARMA",
  "ACHI_VICEROY_KARMA_COUNT"
];

export const achievements = {
  ACHI_APP_SHARE: new AchievementInfo(2, 5, 1),
  ACHI_CONTENT_SHARE: new AchievementInfo(3, 5, 1, 10, 30),
  ACHI_ADD_RECRUITER: new AchievementInfo(4, 10, 1),
  ACHI_ENTERS: new AchievementInfo(5, 5, ...genArray(500, i => (i + 1) * 5)),
  ACHI_KARMA_COUNT: new AchievementInfo(6, 5, ...genArray(20, i => (i + 1) * 20000)),
  ACHI_REFERRALS_COUNT: new AchievementInfo(7, 10, 3, 12, 36),
  ACHI_RATES_COUNT: new AchievementInfo(8, 5, 100),
  ACHI_COMMENTS_KARMA: new AchievementInfo(12, 10, 5000, 25000, 50000),
  ACHI_POSTS_COUNT: new AchievementInfo(15, 5, 10, 50, 200),
  ACHI_COMMENTS_COUNT: new AchievementInfo(16, 5, 100),
  ACHI_LOGIN: new AchievementInfo(28, 5, 1),
  ACHI_CHAT: new AchievementInfo(29, 5, 1),
  ACHI_COMMENT: new AchievementInfo(30, 5, 1),
  ACHI_ANSWER: new AchievementInfo(31, 5, 1),
  ACHI_RATE: new AchievementInfo(32, 5, 1),
  ACHI_CHANGE_PUBLICATION: new AchievementInfo(33, 5, 1),
  ACHI_CHANGE_COMMENT: new AchievementInfo(34, 5, 1),
  ACHI_POST_KARMA: new AchievementInfo(36, 10, 10000, 50000, 100000),
  ACHI_FIRST_POST: new AchievementInfo(37, 5, 1),
  ACHI_SUBSCRIBE: new AchievementInfo(38, 5, 1),
  ACHI_TAGS_SEARCH: new AchievementInfo(39, 5, 1),
  ACHI_LANGUAGE: new AchievementInfo(40, 5, 1),
  ACHI_TITLE_IMAGE: new AchievementInfo(41, 5, 1),
  ACHI_CREATE_TAG: new AchievementInfo(42, 5, 1),
  ACHI_QUESTS: new AchievementInfo(43, 2, ...genArray(500, i => i + 1)),
  ACHI_FANDOMS: new AchievementInfo(44, 10, 1, 3, 5, 10, 20),
  ACHI_RULES_USER: new AchievementInfo(45, 5, 1),
  ACHI_RULES_MODERATOR: new AchievementInfo(46, 5, 1),
  ACHI_FOLLOWERS: new AchievementInfo(47, 5, 10, 100, 250, 500, 1000, 5000, 10000),
  ACHI_MODER_CHANGE_POST_TAGS: new AchievementInfo(48, 5, 1),
  ACHI_FIREWORKS: new AchievementInfo(50, 1, 1),
  ACHI_MAKE_MODER: new AchievementInfo(51, 5, 1),
  ACHI_CREATE_CHAT: new AchievementInfo(52, 5, 1),
  ACHI_REVIEW_MODER_ACTION: new AchievementInfo(53, 5, 1),
  ACHI_ACCEPT_FANDOM: new AchievementInfo(54, 5, 1),
  ACHI_MODERATOR_COUNT: new AchievementInfo(55, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
  ACHI_MODERATOR_ACTION_KARMA: new AchievementInfo(56, 5, 5000, 10000, 20000, 50000, 100000),
  ACHI_KARMA_30: new AchievementInfo(57, 5, 50000, 100000, 200000, 400000, 800000, 1500000, 3000000),
  ACHI_UP_RATES: new AchievementInfo(58, 2, 10, 50, 150, 300, 500),
  ACHI_UP_RATES_OVER_DOWN: new AchievementInfo(59, 2, 5, 20, 50, 150, 300, 500),
  ACHI_CHAT_SUBSCRIBE: new AchievementInfo(60, 2, 1),
  ACHI_STICKERS_KARMA: new AchievementInfo(61, 10, 5000, 25000, 50000),
  ACHI_UNKNOWN: new AchievementInfo(62, 0, 0),
  ACHI_RELAY_RACE_FIRST_POST: new AchievementInfo(64, 1, 1),
  ACHI_RELAY_RACE_FIRST_NEXT_MEMBER: new AchievementInfo(65, 1, 1),
  ACHI_RELAY_RACE_FIRST_CREATE: new AchievementInfo(66, 1, 1),
  ACHI_RELAY_RACE_POSTS_COUNT: new AchievementInfo(67, 5, 5, 10, 20, 50),
  ACHI_RELAY_RACE_MY_RACE_POSTS_COUNT: new AchievementInfo(68, 5, 5, 10, 20, 50, 100),
  ACHI_VICEROY_ASSIGN: new AchievementInfo(69, 1, 1),
  ACHI_VICEROY_POSTS_COUNT: new AchievementInfo(70, 2, 5, 10, 20, 50),
  ACHI_VICEROY_WIKI_COUNT: new AchievementInfo(71, 2, 1, 5, 10, 50, 100),
  ACHI_VICEROY_KARMA_COUNT: new AchievementInfo(72, 2, 50000, 200000, 500000, 1000000),
  ACHI_VICEROY_SUBSCRIBERS_COUNT: new AchievementInfo(73, 2, 10, 20, 50, 100, 500),
  ACHI_VICEROY_LINK: new AchievementInfo(74, 1, 1),
  ACHI_VICEROY_IMAGES: new AchievementInfo(75, 1, 1),
  ACHI_VICEROY_DESCRIPTION: new AchievementInfo(76, 1, 1)
};

export function getByIndex(index) {
  for (let achievement of Object.values(achievements)) {
    if (achievement.index === index) return achievement;
  }
  return null;
}

export const achievementPacksNames = {
  ACHI_PACK_1: "Обучение",
  ACHI_PACK_2: "Шаринг",
  ACHI_PACK_3: "Публикации",
  ACHI_PACK_4: "Модерация",
  ACHI_PACK_6: "Наместник",
  ACHI_PACK_5: "Другие"
};
export const achievementPacks = {
  ACHI_PACK_1: ["ACHI_RULES_USER", "ACHI_LOGIN", "ACHI_CHAT", "ACHI_CHAT_SUBSCRIBE", "ACHI_COMMENT", "ACHI_ANSWER", "ACHI_RATE", "ACHI_CHANGE_PUBLICATION", "ACHI_CHANGE_COMMENT", "ACHI_FIRST_POST", "ACHI_SUBSCRIBE", "ACHI_TAGS_SEARCH", "ACHI_LANGUAGE", "ACHI_TITLE_IMAGE", "ACHI_RELAY_RACE_FIRST_POST", "ACHI_RELAY_RACE_FIRST_NEXT_MEMBER"],
  ACHI_PACK_2: ["ACHI_APP_SHARE", "ACHI_CONTENT_SHARE", "ACHI_ADD_RECRUITER", "ACHI_REFERRALS_COUNT", "ACHI_FOLLOWERS"],
  ACHI_PACK_3: ["ACHI_POSTS_COUNT", "ACHI_COMMENTS_COUNT", "ACHI_POST_KARMA", "ACHI_COMMENTS_KARMA", "ACHI_STICKERS_KARMA", "ACHI_KARMA_COUNT", "ACHI_KARMA_30", "ACHI_UP_RATES", "ACHI_UP_RATES_OVER_DOWN", "ACHI_RELAY_RACE_POSTS_COUNT", "ACHI_RELAY_RACE_MY_RACE_POSTS_COUNT"],
  ACHI_PACK_4: ["ACHI_CREATE_TAG", "ACHI_RULES_MODERATOR", "ACHI_MODER_CHANGE_POST_TAGS", "ACHI_MAKE_MODER", "ACHI_CREATE_CHAT", "ACHI_REVIEW_MODER_ACTION", "ACHI_ACCEPT_FANDOM", "ACHI_MODERATOR_COUNT", "ACHI_MODERATOR_ACTION_KARMA", "ACHI_RELAY_RACE_FIRST_CREATE"],
  ACHI_PACK_6: ["ACHI_VICEROY_ASSIGN", "ACHI_VICEROY_POSTS_COUNT", "ACHI_VICEROY_WIKI_COUNT", "ACHI_VICEROY_KARMA_COUNT", "ACHI_VICEROY_SUBSCRIBERS_COUNT", "ACHI_VICEROY_LINK", "ACHI_VICEROY_IMAGES", "ACHI_VICEROY_DESCRIPTION"],
  ACHI_PACK_5: ["ACHI_RATES_COUNT", "ACHI_ENTERS", "ACHI_QUESTS", "ACHI_FANDOMS", "ACHI_FIREWORKS"],
};
