const TYPES = {
  feat: { label: "New Features", order: 0 },
  fix: { label: "Bugfixes", order: 1 },
  perf: { label: "Performance Improvements", order: 2 },
  build: { label: "Build System", order: 3 },
  refactor: { label: "Refactors", order: 4 },
  doc: { label: "Documentation Changes", order: 5 },
  style: { label: "Code Style Changes", order: 6 },
  chore: { label: "Chores", order: 7 },
  other: { label: "Other Changes", order: 8 },
};

function translateType(type) {
  if (TYPES[type]) {
    return TYPES[type].label;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = {
  TYPES,
  translateType,
};
