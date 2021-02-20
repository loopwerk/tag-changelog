function groupByType(commits) {
  const byType = {};

  commits.forEach((commit) => {
    if (!byType[commit.type]) {
      byType[commit.type] = [];
    }
    byType[commit.type].push(commit);
  });

  return byType;
}

module.exports = groupByType;
