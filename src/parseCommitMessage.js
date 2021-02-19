const { parser, toConventionalChangelogFormat } = require("@conventional-commits/parser");

const PR_REGEX = /#([1-9]\d*)/g;

function parseCommitMessage(message, repoUrl) {
  let cAst;

  try {
    const ast = parser(message);
    cAst = toConventionalChangelogFormat(ast);
  } catch (error) {
    // Not a valid commit
    cAst = {
      subject: message.split("\n")[0],
      type: "other",
    };
  }

  cAst.subject = cAst.subject.replace(
    PR_REGEX,
    (match, pull) => `[${match}](${repoUrl}/pull/${pull})`,
  );

  return cAst;
}

function groupByType(commits) {
  let byType = {};

  commits.forEach(commit => {
    if (!byType[commit.type]) {
      byType[commit.type] = [];
    }
    byType[commit.type].push(commit);
  });

  return byType;
}

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
}

function translateType(type) {
  if (TYPES[type]) {
    return TYPES[type];
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = {
  parseCommitMessage,
  groupByType,
  translateType,
};
