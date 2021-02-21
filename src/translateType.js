const DEFAULT_TYPES = [
  { types: ["feat", "feature"], label: "New Features" },
  { types: ["fix", "bugfix"], label: "Bugfixes" },
  { types: ["improvements", "enhancement"], label: "Improvements" },
  { types: ["perf"], label: "Performance Improvements" },
  { types: ["build", "ci"], label: "Build System" },
  { types: ["refactor"], label: "Refactors" },
  { types: ["doc", "docs"], label: "Documentation Changes" },
  { types: ["test", "tests"], label: "Tests" },
  { types: ["style"], label: "Code Style Changes" },
  { types: ["chore"], label: "Chores" },
  { types: ["other"], label: "Other Changes" },
];

function translateType(type, typeConfig) {
  const foundType = typeConfig.find((t) => t.types.includes(type));
  if (foundType) {
    return foundType.label;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = {
  DEFAULT_TYPES,
  translateType,
};
