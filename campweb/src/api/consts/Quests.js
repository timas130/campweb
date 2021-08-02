class QuestInfo {
  constructor(name, ...targets) {
    this.name = name.toLowerCase();
    this.targets = targets;
  }

  getTarget(lvl) {
    lvl = Math.floor(lvl / 100 - 1);
    return this.targets.length > lvl ?
      this.targets[lvl] :
      this.targets[this.targets.length - 1];
  }
}

const quests = [
  null,
  new QuestInfo("POSTS", 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6),
  new QuestInfo("POSTS_KARMA", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120),
  new QuestInfo("COMMENTS", 2, 5, 8, 12, 16, 20, 24, 28, 30),
  new QuestInfo("COMMENTS_KARMA", 2, 5, 8, 12, 16, 20, 24, 28, 30),
  new QuestInfo("CHAT", 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70),
  new QuestInfo("RATES", 6, 12, 18, 24, 28, 32, 36, 40, 48, 52, 58, 64),
  new QuestInfo("KARMA", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120),
  new QuestInfo("UNKNOWN", 0),
  new QuestInfo("ACTIVITIES", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2),
];
export default quests;
