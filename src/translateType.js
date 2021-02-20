const TYPES = {
  feat: "New Features",
  fix: "Bugfixes",
  other: "Other Changes",
  chore: "Chores",
  build: "Build System",
  perf: "Performance Improvements",
  style: "Code Style Changes",
  refactor: "Refactors",
  doc: "Documentation Changes",
};

function translateType(type) {
  if (TYPES[type]) {
    return TYPES[type];
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = translateType;
