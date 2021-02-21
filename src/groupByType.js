const { TYPES } = require("./translateType");

function groupByType(commits) {
  // First, group all the commits by their types.
  // We end up with a dictionary where the key is the type, and the values is an array of commits.
  const byType = {};
  commits.forEach((commit) => {
    if (!byType[commit.type]) {
      byType[commit.type] = [];
    }
    byType[commit.type].push(commit);
  });

  // Turn that dictionary into an array of objects,
  // where the key is the type, and the values is an array of commits.
  const byTypeArray = [];
  Object.keys(byType).forEach((key) => {
    byTypeArray.push({
      type: key,
      commits: byType[key],
    });
  });

  // And now we sort that array using the TYPES object.
  byTypeArray.sort((a, b) => {
    const aOrder = TYPES[a.type] ? TYPES[a.type].order : 999;
    const bOrder = TYPES[b.type] ? TYPES[b.type].order : 999;
    return aOrder - bOrder;
  });

  return byTypeArray;
}

module.exports = groupByType;
